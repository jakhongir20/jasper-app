import { FC, useMemo, useState } from "react";
import { cn } from "@/shared/helpers";
import { Spin, Tabs } from "antd";
import { useStaticAssetsUrl } from "@/shared/hooks";
import {
  CategoryProduct,
  getProductImageUrl,
  hasImageForSashType,
  SashType,
  useCategoryProductsByIndex,
} from "../model/useCategoryProducts";

/**
 * Category section configuration
 * Maps section index to display info and allowed product types
 * Mirrors ALL_SECTIONS from TransactionForm.tsx
 */
interface SectionConfig {
  name_ru: string;
  name_en: string;
  allowedProductTypes?: string[];
}

const CATEGORY_SECTIONS: Record<number, SectionConfig> = {
  1: { name_en: "Transom", name_ru: "Фрамуга", allowedProductTypes: ["door-window", "door-deaf"] },
  2: { name_en: "Door Window", name_ru: "ДО Дверь", allowedProductTypes: ["door-window"] },
  3: { name_en: "Door Deaf", name_ru: "ДГ Дверь", allowedProductTypes: ["door-deaf"] },
  4: { name_en: "Sheathing", name_ru: "Обшивка", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  5: { name_en: "Frame", name_ru: "Наличник", allowedProductTypes: ["door-window", "door-deaf"] },
  6: { name_en: "Filler", name_ru: "Нашельник", allowedProductTypes: ["door-window", "door-deaf"] },
  7: { name_en: "Crown", name_ru: "Корона", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  8: { name_en: "UpFrame", name_ru: "Надналичник", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  9: { name_en: "UnderFrame", name_ru: "Подналичник", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  10: { name_en: "Trim", name_ru: "Обклад", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  11: { name_en: "Molding", name_ru: "Молдинг", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  12: { name_en: "Covering Primary", name_ru: "Покрытие I", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  13: { name_en: "Covering Secondary", name_ru: "Покрытие II", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  14: { name_en: "Color", name_ru: "Цвет", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
  15: { name_en: "Floor Skirting", name_ru: "Плинтус", allowedProductTypes: ["door-window", "door-deaf"] },
  16: { name_en: "Heated Floor", name_ru: "Тёплый пол", allowedProductTypes: ["heated-floor"] },
  17: { name_en: "Latting", name_ru: "Обрешётка", allowedProductTypes: ["latting"] },
  18: { name_en: "Window", name_ru: "Окно", allowedProductTypes: ["window"] },
  19: { name_en: "Windowsill", name_ru: "Подоконник", allowedProductTypes: ["windowsill"] },
  20: { name_en: "Glass", name_ru: "Стекло", allowedProductTypes: ["door-window", "glass"] },
  21: { name_en: "Door Lock", name_ru: "Замок двери", allowedProductTypes: ["door-window", "door-deaf", "door_lock"] },
  22: { name_en: "Hinge", name_ru: "Петля", allowedProductTypes: ["door-window", "door-deaf", "hinge"] },
  23: { name_en: "Door Bolt", name_ru: "Затвор", allowedProductTypes: ["door-window", "door-deaf", "door_bolt"] },
  24: { name_en: "Door Stopper", name_ru: "Стоппер", allowedProductTypes: ["door-window", "door-deaf"] },
  25: { name_en: "Anti-Threshold", name_ru: "Антипорог", allowedProductTypes: ["door-window", "door-deaf"] },
  26: { name_en: "Box Width", name_ru: "Ширина коробки", allowedProductTypes: ["door-window", "door-deaf"] },
  27: { name_en: "Extra Options", name_ru: "Доп. опции", allowedProductTypes: ["door-window", "door-deaf", "doorway"] },
};

/** All section indexes in display order */
const ALL_SECTION_INDEXES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

/** Sections that require sash type filtering for images */
const SASH_FILTERED_SECTIONS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Фрамуга, Двери, Обшивка, Наличник, Нашельник, Корона, Надналичник, Подналичник

/**
 * Filter sections based on product type
 * If productType is null/undefined, return all sections
 * Otherwise, return only sections that include productType in allowedProductTypes
 */
function filterSectionsByProductType(
  sections: number[],
  productType: string | null | undefined,
): number[] {
  // If no product type selected, show all sections
  if (!productType) {
    return sections;
  }

  return sections.filter((sectionIndex) => {
    const sectionInfo = CATEGORY_SECTIONS[sectionIndex];
    if (!sectionInfo) return false;

    // If section has no allowedProductTypes, show it
    if (!sectionInfo.allowedProductTypes || sectionInfo.allowedProductTypes.length === 0) {
      return true;
    }

    // Check if productType is in allowedProductTypes
    return sectionInfo.allowedProductTypes.includes(productType);
  });
}

interface PartSelectorProps {
  /** Category section indexes to show as tabs */
  visibleSections?: number[];
  /** Currently selected product IDs by section index */
  selectedProducts?: Record<number, number | null>;
  /** Current sash type filter */
  sashType?: SashType | null;
  /** Product type from form (door-window, door-deaf) - controls which door tab is visible */
  productType?: string | null;
  /** Product selection handler */
  onProductSelect?: (sectionIndex: number, productId: number | null) => void;
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
 * Tab content component - shows products for a specific section
 */
const TabContent: FC<{
  sectionIndex: number;
  sashType?: SashType | null;
  selectedProductId: number | null;
  onSelect: (productId: number | null) => void;
  centered?: boolean;
}> = ({ sectionIndex, sashType, selectedProductId, onSelect, centered }) => {
  const { data: products, isLoading } = useCategoryProductsByIndex(sectionIndex);

  // Check if this section requires sash type filtering
  const requiresSashFilter = SASH_FILTERED_SECTIONS.has(sectionIndex);

  // Filter products based on section type
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    if (requiresSashFilter) {
      // For door/frame sections - require sash type and filter by it
      if (!sashType) return [];
      return products.filter((p) => hasImageForSashType(p, sashType));
    } else {
      // For other sections (locks, hinges, etc.) - show all products with any images
      return products.filter((p) => p.product_images && p.product_images.length > 0);
    }
  }, [products, sashType, requiresSashFilter]);

  // Handle product selection (toggle)
  const handleSelect = (productId: number) => {
    const newValue = selectedProductId === productId ? null : productId;
    onSelect(newValue);
  };

  // Only show "select sash" message for sash-filtered sections
  if (requiresSashFilter && !sashType) {
    return (
      <div className="py-4 text-center text-sm text-gray-400">
        Выберите тип створки слева
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spin size="small" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-gray-400">
        Нет изображений
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-2",
        centered ? "justify-center" : "-mx-1 px-1",
      )}
    >
      {filteredProducts.map((product) => (
        <ProductThumbnail
          key={product.product_id}
          product={product}
          selected={selectedProductId === product.product_id}
          onClick={() => handleSelect(product.product_id)}
          sashType={requiresSashFilter ? sashType : null}
        />
      ))}
    </div>
  );
};

/**
 * Part selector component with dynamic category tabs from section indexes
 * Uses Ant Design Tabs for horizontal scrolling
 */
export const PartSelector: FC<PartSelectorProps> = ({
  visibleSections,
  selectedProducts = {},
  sashType,
  productType,
  onProductSelect,
  centered = false,
  className,
}) => {
  // Filter sections based on product type
  // If visibleSections provided, use those; otherwise use all sections
  // Then filter by productType (if selected, show only allowed; if not selected, show all)
  const filteredSections = useMemo(() => {
    const baseSections = visibleSections ?? ALL_SECTION_INDEXES;
    return filterSectionsByProductType(baseSections, productType);
  }, [visibleSections, productType]);

  // Build tab items
  const tabItems = useMemo(() => {
    return filteredSections.map((sectionIndex) => {
      const sectionInfo = CATEGORY_SECTIONS[sectionIndex];
      const label = sectionInfo?.name_ru || `Секция ${sectionIndex}`;

      return {
        key: String(sectionIndex),
        label,
        children: (
          <TabContent
            sectionIndex={sectionIndex}
            sashType={sashType}
            selectedProductId={selectedProducts[sectionIndex] ?? null}
            onSelect={(productId) => onProductSelect?.(sectionIndex, productId)}
            centered={centered}
          />
        ),
      };
    });
  }, [filteredSections, sashType, selectedProducts, onProductSelect, centered]);

  // Default to first tab
  const [activeKey, setActiveKey] = useState<string>(
    String(filteredSections[0] || ""),
  );

  return (
    <div className={cn("flex flex-col", className)}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={tabItems}
        centered={centered}
        size="small"
        tabBarStyle={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default PartSelector;
