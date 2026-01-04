import { FC, useMemo, useState } from "react";
import { cn } from "@/shared/helpers";
import { Spin } from "antd";
import { useStaticAssetsUrl } from "@/shared/hooks";
import {
  CategoryProduct,
  getProductImageUrl,
  hasImageForSashType,
  PartCategory2D,
  SashType,
  useCategoryProducts,
} from "../model/useCategoryProducts";

// Extended category type for UI tabs (includes door types)
type TabCategory = PartCategory2D | "door-window" | "door-deaf";

// Category tab configuration
const CATEGORY_TABS: { key: TabCategory; label: string }[] = [
  { key: "frames", label: "Рамки" },
  { key: "crowns", label: "Короны" },
  { key: "door-window", label: "ДО дверь" },
  { key: "door-deaf", label: "ДГ дверь" },
  { key: "casings", label: "Подналичник" },
];

interface PartSelectorProps {
  /** Currently selected frame ID */
  selectedFrameId: number | null;
  /** Currently selected crown ID */
  selectedCrownId: number | null;
  /** Currently selected door ID */
  selectedDoorId: number | null;
  /** Currently selected casing ID */
  selectedCasingId: number | null;
  /** Current sash type filter (from selected door) */
  sashType?: SashType | null;
  /** Product type from form (door-window, door-deaf) - controls which door tab is visible */
  productType?: string | null;
  /** Frame selection handler */
  onFrameSelect: (id: number) => void;
  /** Crown selection handler */
  onCrownSelect: (id: number | null) => void;
  /** Door selection handler */
  onDoorSelect: (id: number) => void;
  /** Casing selection handler */
  onCasingSelect: (id: number | null) => void;
  /** Center the content */
  centered?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Product thumbnail component
 */
const ProductThumbnail: FC<{
  product: CategoryProduct;
  selected: boolean;
  onClick: () => void;
  sashType?: SashType | null;
}> = ({ product, selected, onClick, sashType }) => {
  const { getAssetUrl } = useStaticAssetsUrl();
  const imageUrl = getProductImageUrl(product, sashType);
  const fullUrl = imageUrl ? getAssetUrl(imageUrl) : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-[80px] flex-col items-center gap-1 rounded-lg border border-transparent p-2 transition-all duration-200",
        selected
          ? "border-primary bg-primary/10"
          : "bg-gray-50 hover:bg-gray-100",
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded">
        {fullUrl ? (
          <img
            src={fullUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-400">
            Нет фото
          </div>
        )}
      </div>
      <span className="line-clamp-2 max-w-[80px] text-center text-xs text-gray-400">
        {product.name}
      </span>
    </button>
  );
};

/**
 * Part selector component with category tabs and product thumbnails from API
 */
export const PartSelector: FC<PartSelectorProps> = ({
  selectedFrameId,
  selectedCrownId,
  selectedDoorId,
  selectedCasingId,
  sashType,
  productType: formProductType,
  onFrameSelect,
  onCrownSelect,
  onDoorSelect,
  onCasingSelect,
  centered = false,
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState<TabCategory>("frames");

  // Filter tabs based on product type from form
  // Show only the matching door tab (ДО or ДГ), hide the other
  const visibleTabs = useMemo(() => {
    return CATEGORY_TABS.filter((tab) => {
      if (tab.key === "door-window") {
        return formProductType === "door-window";
      }
      if (tab.key === "door-deaf") {
        return formProductType === "door-deaf";
      }
      return true;
    });
  }, [formProductType]);

  // Map tab category to API category and product type for API call
  const apiCategory: PartCategory2D =
    activeCategory === "door-window" || activeCategory === "door-deaf"
      ? "doors"
      : activeCategory;
  const apiProductType =
    activeCategory === "door-window" || activeCategory === "door-deaf"
      ? activeCategory
      : undefined;

  // Fetch products from API
  const { data: products, isLoading } = useCategoryProducts(
    apiCategory,
    apiProductType,
  );

  // Filter products that have images matching sash type
  // Products only shown when sashType is selected (user must choose sash first)
  const productsWithImages = useMemo(() => {
    if (!products) return [];

    // Don't show products until sash type is selected
    if (!sashType) return [];

    // Filter all categories (including doors) by sash type
    return products.filter((p) => hasImageForSashType(p, sashType));
  }, [products, sashType]);

  // Get selected ID for current category
  const getSelectedId = (): number | null => {
    switch (activeCategory) {
      case "frames":
        return selectedFrameId;
      case "crowns":
        return selectedCrownId;
      case "door-window":
      case "door-deaf":
        return selectedDoorId;
      case "casings":
        return selectedCasingId;
      default:
        return null;
    }
  };

  // Handle product selection
  const handleSelect = (productId: number) => {
    switch (activeCategory) {
      case "frames":
        onFrameSelect(productId);
        break;
      case "crowns":
        onCrownSelect(productId);
        break;
      case "door-window":
      case "door-deaf":
        onDoorSelect(productId);
        break;
      case "casings":
        onCasingSelect(productId);
        break;
    }
  };

  return (
    <div className={cn("flex flex-col", centered && "items-center", className)}>
      {/* Category tabs */}
      <div
        className={cn(
          "mb-4 flex flex-wrap gap-1",
          centered && "justify-center",
        )}
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition-colors duration-200",
              activeCategory === tab.key
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product thumbnails */}
      {!sashType ? (
        <div className="py-4 text-center text-sm text-gray-400">
          Выберите тип створки слева
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-4">
          <Spin size="small" />
        </div>
      ) : productsWithImages.length > 0 ? (
        <div
          className={cn(
            "flex gap-3 overflow-x-auto pb-2",
            centered ? "justify-center" : "-mx-1 px-1",
          )}
        >
          {productsWithImages.map((product) => (
            <ProductThumbnail
              key={product.product_id}
              product={product}
              selected={getSelectedId() === product.product_id}
              onClick={() => handleSelect(product.product_id)}
              sashType={sashType}
            />
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-gray-400">
          Нет изображений
        </div>
      )}
    </div>
  );
};

export default PartSelector;
