import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/helpers";
import { DoorCanvas } from "./DoorCanvas";
import { ColorPicker, PartSelector, SashSelector } from "./ui";
import { defaultDoorConfig, DoorConfig } from "./data/data2D";
import { useDoor2DImages } from "./model/useDoor2DImages";
import {
  getSashType,
  SashType,
  useCategoryProductsByIndex,
} from "./model/useCategoryProducts";
import { useStaticAssetsUrl } from "@/shared/hooks";
import { getAssignmentFromSash } from "./data/sashOptions";

/** Section index mapping for common part types */
const SECTION_INDEX = {
  frame: 5,
  crown: 7,
  doorWindow: 2,
  doorDeaf: 3,
  casing: 9,
} as const;

interface Door2DEditorProps {
  /** Initial configuration (for edit mode) */
  initialConfig?: Partial<DoorConfig>;
  /** Callback when configuration changes */
  onChange?: (config: DoorConfig) => void;
  /** Product IDs for loading images from API */
  productIds?: {
    doorProductId?: number | null;
    frameProductId?: number | null;
    crownProductId?: number | null;
  };
  /** Selected products by section index */
  selectedProducts?: Record<number, number | null>;
  /** Callback when product is selected/deselected in 2D editor (by section index) */
  onSectionProductSelect?: (sectionIndex: number, productId: number | null) => void;
  /** Current sash value from form */
  sashValue?: string | null;
  /** Callback when sash is changed in 2D editor */
  onSashChange?: (value: string) => void;
  /** Product type from form (door-window, door-deaf) */
  productType?: string | null;
  /** Visible section indexes for tabs */
  visibleSections?: number[];
  /** Custom class name */
  className?: string;
}

/**
 * Main 2D Door Editor component
 * Combines visualization, part selection, and color picker
 */
export const Door2DEditor: FC<Door2DEditorProps> = ({
  initialConfig,
  onChange,
  productIds,
  selectedProducts: externalSelectedProducts = {},
  onSectionProductSelect,
  sashValue,
  onSashChange,
  productType,
  visibleSections, // Optional - PartSelector will use all sections if not provided
  className,
}) => {
  // Door configuration state
  const [config, setConfig] = useState<DoorConfig>({
    ...defaultDoorConfig,
    ...initialConfig,
  });

  // Local selected products state - allows immediate UI update before form sync
  const [localSelectedProducts, setLocalSelectedProducts] = useState<Record<number, number | null>>(
    externalSelectedProducts,
  );

  // Sync local state with external props when they change (form → 2D editor)
  useEffect(() => {
    setLocalSelectedProducts((prev) => {
      // Merge external values, but don't overwrite local selections with null
      const merged = { ...prev };
      for (const key of Object.keys(externalSelectedProducts)) {
        const sectionIndex = Number(key);
        const externalValue = externalSelectedProducts[sectionIndex];
        // Only update if external has a value (don't overwrite local deselection)
        if (externalValue !== null && externalValue !== undefined) {
          merged[sectionIndex] = externalValue;
        }
      }
      return merged;
    });
  }, [externalSelectedProducts]);

  // Local sash state - allows selection even when form field is not registered
  const [localSashValue, setLocalSashValue] = useState<string | null>(
    sashValue ?? null,
  );

  // Sync local sash with form sash value when it changes from form
  useEffect(() => {
    if (sashValue && sashValue !== localSashValue) {
      setLocalSashValue(sashValue);
    }
  }, [sashValue]);

  // Handle sash change - update local state and notify parent
  const handleSashChange = useCallback(
    (value: string) => {
      setLocalSashValue(value);
      onSashChange?.(value);
    },
    [onSashChange],
  );

  // Sync config with productIds from form (one-way: form → 2D editor)
  // Only sync when form has a value (don't overwrite local deselection)
  useEffect(() => {
    const doorId = productIds?.doorProductId;
    if (doorId && doorId !== config.doorId) {
      setConfig((prev) => ({ ...prev, doorId }));
    }
  }, [productIds?.doorProductId]);

  useEffect(() => {
    const frameId = productIds?.frameProductId;
    if (frameId && frameId !== config.frameId) {
      setConfig((prev) => ({ ...prev, frameId }));
    }
  }, [productIds?.frameProductId]);

  useEffect(() => {
    const crownId = productIds?.crownProductId;
    if (crownId !== undefined && crownId !== config.crownId) {
      setConfig((prev) => ({ ...prev, crownId }));
    }
  }, [productIds?.crownProductId]);

  // Fetch door products by section index (ДО = 2, ДГ = 3)
  const { data: doorWindowProducts } = useCategoryProductsByIndex(SECTION_INDEX.doorWindow);
  const { data: doorDeafProducts } = useCategoryProductsByIndex(SECTION_INDEX.doorDeaf);

  // Fetch images from API based on product IDs
  const { data: apiImages } = useDoor2DImages(productIds || {});
  const { getAssetUrl } = useStaticAssetsUrl();

  // Fetch products for other categories to get images when selected
  const { data: frameProducts } = useCategoryProductsByIndex(SECTION_INDEX.frame);
  const { data: crownProducts } = useCategoryProductsByIndex(SECTION_INDEX.crown);
  const { data: casingProducts } = useCategoryProductsByIndex(SECTION_INDEX.casing);

  // Determine sash type from local sash value (which syncs with form)
  // Maps: sash=1 → one-sash, sash=2 → one-half-sash, sash=3 → two-sash, etc.
  const currentSashType = useMemo((): SashType | null => {
    // Use local sash value (allows selection when form field is not registered)
    const assignmentFromSash = getAssignmentFromSash(localSashValue);
    if (assignmentFromSash) {
      return assignmentFromSash as SashType;
    }

    return null;
  }, [localSashValue]);

  // Get image URL from selected product in PartSelector
  const getSelectedProductImageUrl = (
    products: typeof doorProducts,
    productId: number | null,
    sashType?: SashType | null,
  ): string | undefined => {
    if (!products || !productId) return undefined;
    const product = products.find((p) => p.product_id === productId);
    if (!product?.product_images?.length) return undefined;

    // Filter by sash type if provided
    const filteredImages = sashType
      ? product.product_images.filter(
          (img) => getSashType(img.assignment) === sashType,
        )
      : product.product_images;

    if (filteredImages.length === 0) return undefined;

    // Prefer SVG
    const svgImage = filteredImages.find((img) =>
      img.image_url.toLowerCase().endsWith(".svg"),
    );
    return svgImage?.image_url || filteredImages[0]?.image_url;
  };

  // Build image URLs from localSelectedProducts (by section index)
  const imageUrls = useMemo(() => {
    // Get product IDs from localSelectedProducts by section index
    const doorWindowProductId = localSelectedProducts[SECTION_INDEX.doorWindow] ?? null;
    const doorDeafProductId = localSelectedProducts[SECTION_INDEX.doorDeaf] ?? null;
    const frameProductId = localSelectedProducts[SECTION_INDEX.frame] ?? null;
    const crownProductId = localSelectedProducts[SECTION_INDEX.crown] ?? null;
    const casingProductId = localSelectedProducts[SECTION_INDEX.casing] ?? null;

    // Get URLs from selected products - use correct product list for each door type
    const doorWindowUrl = getSelectedProductImageUrl(
      doorWindowProducts,
      doorWindowProductId,
      currentSashType,
    );
    const doorDeafUrl = getSelectedProductImageUrl(
      doorDeafProducts,
      doorDeafProductId,
      currentSashType,
    );
    // Use whichever door type has a selection
    const doorUrl = doorWindowUrl || doorDeafUrl;
    const frameUrl = getSelectedProductImageUrl(
      frameProducts,
      frameProductId,
      currentSashType,
    );
    const crownUrl = getSelectedProductImageUrl(
      crownProducts,
      crownProductId,
      currentSashType,
    );
    const casingUrl = getSelectedProductImageUrl(
      casingProducts,
      casingProductId,
      currentSashType,
    );

    // Fall back to API images from form if no PartSelector selection
    return {
      doorUrl: doorUrl
        ? getAssetUrl(doorUrl)
        : apiImages?.door
          ? getAssetUrl(apiImages.door.image_url)
          : undefined,
      frameUrl: frameUrl
        ? getAssetUrl(frameUrl)
        : apiImages?.frame
          ? getAssetUrl(apiImages.frame.image_url)
          : undefined,
      crownUrl: crownUrl
        ? getAssetUrl(crownUrl)
        : apiImages?.crown
          ? getAssetUrl(apiImages.crown.image_url)
          : undefined,
      casingUrl: casingUrl ? getAssetUrl(casingUrl) : undefined,
    };
  }, [
    doorWindowProducts,
    doorDeafProducts,
    frameProducts,
    crownProducts,
    casingProducts,
    localSelectedProducts,
    currentSashType,
    apiImages,
    getAssetUrl,
  ]);

  // Update config and notify parent
  const updateConfig = useCallback(
    (updates: Partial<DoorConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates };
        onChange?.(newConfig);
        return newConfig;
      });
    },
    [onChange],
  );

  // Handle wall color change
  const handleWallColorChange = useCallback(
    (color: string) => {
      updateConfig({ wallColor: color });
    },
    [updateConfig],
  );

  // Handle product selection - update local state immediately and notify parent
  const handleProductSelect = useCallback(
    (sectionIndex: number, productId: number | null) => {
      // Update local state immediately for instant UI feedback
      setLocalSelectedProducts((prev) => ({
        ...prev,
        [sectionIndex]: productId,
      }));
      // Notify parent to sync with form
      onSectionProductSelect?.(sectionIndex, productId);
    },
    [onSectionProductSelect],
  );

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Main content: Canvas + Color picker + Sash selector */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-gray-50 to-white py-6">
        {/* Sash selector - vertical on the left side */}
        <div className="absolute left-6 top-1/2 z-50 -translate-y-1/2">
          <SashSelector value={localSashValue} onChange={handleSashChange} />
        </div>

        {/* Door canvas visualization - larger size */}
        <DoorCanvas
          config={config}
          containerWidth={1020}
          containerHeight={500}
          showDimensions={true}
          imageUrls={imageUrls}
        />

        {/* Wall color picker - vertical on the right side */}
        <div className="absolute right-6 top-1/2 z-50 -translate-y-1/2">
          <ColorPicker
            wallColor={config.wallColor}
            onWallColorChange={handleWallColorChange}
            vertical={true}
          />
        </div>
      </div>

      {/* Bottom section: Part selector with dynamic tabs */}
      <div className="border-t border-[rgba(5,5,5,0.06)] bg-white px-4 py-4">
        <PartSelector
          visibleSections={visibleSections}
          selectedProducts={localSelectedProducts}
          sashType={currentSashType}
          productType={productType}
          onProductSelect={handleProductSelect}
          centered={true}
        />
      </div>
    </div>
  );
};

export default Door2DEditor;
