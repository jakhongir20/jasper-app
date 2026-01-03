import { FC, useState, useMemo } from "react";
import { cn } from "@/shared/helpers";
import { Spin } from "antd";
import { useStaticAssetsUrl } from "@/shared/hooks";
import {
  useCategoryProducts,
  getProductImageUrl,
  hasImageForSashType,
  PartCategory2D,
  CategoryProduct,
  SashType,
} from "../model/useCategoryProducts";

// Category tab configuration
const CATEGORY_TABS: { key: PartCategory2D; label: string }[] = [
  { key: "frames", label: "Рамки" },
  { key: "crowns", label: "Короны" },
  { key: "doors", label: "Двери" },
  { key: "locks", label: "Замок" },
];

interface PartSelectorProps {
  /** Currently selected frame ID */
  selectedFrameId: number | null;
  /** Currently selected crown ID */
  selectedCrownId: number | null;
  /** Currently selected door ID */
  selectedDoorId: number | null;
  /** Currently selected lock ID */
  selectedLockId: number | null;
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
  /** Lock selection handler */
  onLockSelect: (id: number | null) => void;
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
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-[80px]",
        selected
          ? "bg-primary/10 ring-2 ring-primary"
          : "bg-gray-50 hover:bg-gray-100",
      )}
    >
      <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded">
        {fullUrl ? (
          <img
            src={fullUrl}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            Нет фото
          </div>
        )}
      </div>
      <span className="text-xs text-center text-gray-600 line-clamp-2 max-w-[80px]">
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
  selectedLockId,
  fullHeight,
  sashType,
  onFrameSelect,
  onCrownSelect,
  onDoorSelect,
  onLockSelect,
  onFullHeightToggle,
  displayColor = "#D4A574",
  centered = false,
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState<PartCategory2D>("frames");

  // Fetch products from API
  const { data: products, isLoading } = useCategoryProducts(activeCategory);

  // Filter products that have images matching sash type
  // For doors category, show all products with images (no sash filter)
  // For other categories (frames, crowns), filter by sash type if set
  const productsWithImages = useMemo(() => {
    if (!products) return [];

    return products.filter((p) => {
      // For doors, show all products with any images
      if (activeCategory === "doors") {
        return getProductImageUrl(p) !== undefined;
      }

      // For other categories, filter by sash type if set
      if (sashType) {
        return hasImageForSashType(p, sashType);
      }

      // No sash type filter, show all with images
      return getProductImageUrl(p) !== undefined;
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
      case "locks":
        return selectedLockId;
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
      case "locks":
        onLockSelect(productId);
        break;
    }
  };

  return (
    <div className={cn("flex flex-col", centered && "items-center", className)}>
      {/* Category tabs */}
      <div className={cn("mb-4 flex flex-wrap gap-1", centered && "justify-center")}>
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
      {isLoading ? (
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
