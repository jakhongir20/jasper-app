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

// Category tab configuration
const CATEGORY_TABS: { key: PartCategory2D; label: string }[] = [
  { key: "frames", label: "Рамки" },
  { key: "crowns", label: "Короны" },
  { key: "doors", label: "Двери" },
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
  /** Full height mode */
  fullHeight: boolean;
  /** Current sash type filter (from selected door) */
  sashType?: SashType | null;
  /** Frame selection handler */
  onFrameSelect: (id: number) => void;
  /** Crown selection handler */
  onCrownSelect: (id: number | null) => void;
  /** Door selection handler */
  onDoorSelect: (id: number) => void;
  /** Casing selection handler */
  onCasingSelect: (id: number | null) => void;
  /** Full height toggle handler */
  onFullHeightToggle: (enabled: boolean) => void;
  /** Display color for thumbnails */
  displayColor?: string;
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
      <span className="line-clamp-2 max-w-[80px] text-center text-xs text-gray-600">
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
  fullHeight,
  sashType,
  onFrameSelect,
  onCrownSelect,
  onDoorSelect,
  onCasingSelect,
  onFullHeightToggle,
  displayColor = "#D4A574",
  centered = false,
  className,
}) => {
  const [activeCategory, setActiveCategory] =
    useState<PartCategory2D>("frames");

  // Fetch products from API
  const { data: products, isLoading } = useCategoryProducts(activeCategory);

  // Filter products that have images matching sash type
  // Products only shown when sashType is selected (user must choose sash first)
  const productsWithImages = useMemo(() => {
    if (!products) return [];

    // Don't show products until sash type is selected
    if (!sashType) return [];

    return products.filter((p) => {
      // For doors, show all products with any images
      if (activeCategory === "doors") {
        return getProductImageUrl(p) !== undefined;
      }

      // For other categories (frames, crowns), filter by sash type
      return hasImageForSashType(p, sashType);
    });
  }, [products, activeCategory, sashType]);

  // Get selected ID for current category
  const getSelectedId = (): number | null => {
    switch (activeCategory) {
      case "frames":
        return selectedFrameId;
      case "crowns":
        return selectedCrownId;
      case "doors":
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
      case "doors":
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
        {CATEGORY_TABS.map((tab) => (
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
              sashType={activeCategory !== "doors" ? sashType : undefined}
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
