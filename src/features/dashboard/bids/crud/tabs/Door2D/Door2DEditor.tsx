import { FC, useCallback, useState, useMemo } from "react";
import { cn } from "@/shared/helpers";
import { DoorCanvas } from "./DoorCanvas";
import { ColorPicker, PartSelector, SashSelector } from "./ui";
import { defaultDoorConfig, DoorConfig } from "./data/data2D";
import { useDoor2DImages } from "./model/useDoor2DImages";
import { useCategoryProducts, getSashType, SashType } from "./model/useCategoryProducts";
import { useStaticAssetsUrl } from "@/shared/hooks";

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
  /** Current sash value from form */
  sashValue?: string | null;
  /** Callback when sash is changed in 2D editor */
  onSashChange?: (value: string) => void;
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
  sashValue,
  onSashChange,
  className,
}) => {
  // Door configuration state
  const [config, setConfig] = useState<DoorConfig>({
    ...defaultDoorConfig,
    ...initialConfig,
  });

  // Track selected sash type for filtering parts
  const [selectedSashType, setSelectedSashType] = useState<SashType | null>(null);

  // Fetch door products to determine sash type when door is selected
  const { data: doorProducts } = useCategoryProducts("doors");

  // Fetch images from API based on product IDs
  const { data: apiImages } = useDoor2DImages(productIds || {});
  const { getAssetUrl } = useStaticAssetsUrl();

  // Fetch products for other categories to get images when selected
  const { data: frameProducts } = useCategoryProducts("frames");
  const { data: crownProducts } = useCategoryProducts("crowns");
  const { data: lockProducts } = useCategoryProducts("locks");

  // Determine sash type from selected door product
  const currentSashType = useMemo((): SashType | null => {
    if (selectedSashType) return selectedSashType;

    // Try to get from selected door in PartSelector
    if (config.doorId && doorProducts) {
      const doorProduct = doorProducts.find((p) => p.product_id === config.doorId);
      if (doorProduct?.product_images?.length) {
        // Get sash type from first door image
        const firstImage = doorProduct.product_images.find((img) =>
          img.assignment.includes("-door"),
        );
        if (firstImage) {
          return getSashType(firstImage.assignment);
        }
      }
    }

    return null;
  }, [selectedSashType, config.doorId, doorProducts]);

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
      ? product.product_images.filter((img) => getSashType(img.assignment) === sashType)
      : product.product_images;

    if (filteredImages.length === 0) return undefined;

    // Prefer SVG
    const svgImage = filteredImages.find((img) =>
      img.image_url.toLowerCase().endsWith(".svg"),
    );
    return svgImage?.image_url || filteredImages[0]?.image_url;
  };

  // Build image URLs - prioritize PartSelector selection, then API images from form
  const imageUrls = useMemo(() => {
    // Get URLs from selected products in PartSelector
    const doorUrl = getSelectedProductImageUrl(doorProducts, config.doorId, currentSashType);
    const frameUrl = getSelectedProductImageUrl(frameProducts, config.frameId, currentSashType);
    const crownUrl = getSelectedProductImageUrl(crownProducts, config.crownId, currentSashType);
    const lockUrl = getSelectedProductImageUrl(lockProducts, config.lockId);

    // Fall back to API images from form if no PartSelector selection
    return {
      doorUrl: doorUrl ? getAssetUrl(doorUrl) : (apiImages?.door ? getAssetUrl(apiImages.door.image_url) : undefined),
      frameUrl: frameUrl ? getAssetUrl(frameUrl) : (apiImages?.frame ? getAssetUrl(apiImages.frame.image_url) : undefined),
      crownUrl: crownUrl ? getAssetUrl(crownUrl) : (apiImages?.crown ? getAssetUrl(apiImages.crown.image_url) : undefined),
      lockUrl: lockUrl ? getAssetUrl(lockUrl) : undefined,
    };
  }, [doorProducts, frameProducts, crownProducts, lockProducts, config.doorId, config.frameId, config.crownId, config.lockId, currentSashType, apiImages, getAssetUrl]);

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

  // Handle part selection
  const handleFrameSelect = useCallback(
    (id: number) => updateConfig({ frameId: id }),
    [updateConfig],
  );

  const handleCrownSelect = useCallback(
    (id: number | null) => updateConfig({ crownId: id }),
    [updateConfig],
  );

  const handleDoorSelect = useCallback(
    (id: number) => {
      updateConfig({ doorId: id });

      // Update sash type based on selected door
      if (doorProducts) {
        const doorProduct = doorProducts.find((p) => p.product_id === id);
        if (doorProduct?.product_images?.length) {
          const firstImage = doorProduct.product_images.find((img) =>
            img.assignment.includes("-door"),
          );
          if (firstImage) {
            setSelectedSashType(getSashType(firstImage.assignment));
          }
        }
      }
    },
    [updateConfig, doorProducts],
  );

  const handleLockSelect = useCallback(
    (id: number | null) => updateConfig({ lockId: id }),
    [updateConfig],
  );

  const handleFullHeightToggle = useCallback(
    (enabled: boolean) => updateConfig({ fullHeight: enabled }),
    [updateConfig],
  );

  // Handle wall color change
  const handleWallColorChange = useCallback(
    (color: string) => {
      updateConfig({ wallColor: color });
    },
    [updateConfig],
  );

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Main content: Canvas + Color picker + Sash selector */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-gray-50 to-white py-6">
        {/* Sash selector - vertical on the left side */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <SashSelector
            value={sashValue}
            onChange={onSashChange}
          />
        </div>

        {/* Door canvas visualization - larger size */}
        <DoorCanvas
          config={config}
          containerWidth={420}
          containerHeight={500}
          showDimensions={true}
          imageUrls={imageUrls}
        />

        {/* Wall color picker - vertical on the right side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <ColorPicker
            wallColor={config.wallColor}
            onWallColorChange={handleWallColorChange}
            vertical={true}
          />
        </div>
      </div>

      {/* Bottom section: Part selector only */}
      <div className="border-t border-[rgba(5,5,5,0.06)] bg-white px-4 py-4">
        <PartSelector
          selectedFrameId={config.frameId}
          selectedCrownId={config.crownId}
          selectedDoorId={config.doorId}
          selectedLockId={config.lockId}
          fullHeight={config.fullHeight}
          sashType={currentSashType}
          onFrameSelect={handleFrameSelect}
          onCrownSelect={handleCrownSelect}
          onDoorSelect={handleDoorSelect}
          onLockSelect={handleLockSelect}
          onFullHeightToggle={handleFullHeightToggle}
          displayColor={config.frameColor}
          centered={true}
        />
      </div>
    </div>
  );
};

export default Door2DEditor;
