import { FC, useCallback, useMemo } from "react";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { Door2DEditor } from "./Door2D";

/**
 * Section index to form field mapping
 * Maps category_section_index to transaction form field name
 */
const SECTION_FIELD_MAP: Record<number, string> = {
  1: "transom_product_id",           // Фрамуга
  2: "door_product_id",              // ДО Дверь
  3: "door_product_id",              // ДГ Дверь
  4: "sheathing_product_id",         // Обшивка
  5: "frame_product_id",             // Наличник
  6: "filler_product_id",            // Нашельник
  7: "crown_product_id",             // Корона
  8: "up_frame_product_id",          // Надналичник
  9: "under_frame_product_id",       // Подналичник
  10: "trim_product_id",             // Обклад
  11: "molding_product_id",          // Молдинг
  12: "covering_primary_product_id", // Покрытие I
  13: "covering_secondary_product_id", // Покрытие II
  14: "color_product_id",            // Цвет
  15: "floor_skirting_product_id",   // Плинтус
  16: "heated_floor_product_id",     // Тёплый пол
  17: "latting_product_id",          // Обрешётка
  18: "window_product_id",           // Окно
  19: "windowsill_product_id",       // Подоконник
  20: "glass_product_id",            // Стекло
  21: "door_lock_product_id",        // Замок двери
  22: "hinge_product_id",            // Петля
  23: "door_bolt_product_id",        // Затвор
  24: "door_stopper_product_id",     // Стоппер
  25: "anti_threshold_product_id",   // Антипорог
  // 26: box_width - not a product field
  27: "extra_option_product_id",     // Доп. опции
};

interface Props {
  className?: string;
  mode: "add" | "edit";
  drawerOpen?: boolean;
  /** Whether door section is expanded in TransactionForm */
  doorSectionExpanded?: boolean;
}

/**
 * Extract product ID from form value
 * The value can be a number, string, or object with product_id field
 */
function extractProductId(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }
  if (typeof value === "object" && "product_id" in value) {
    return (value as { product_id: number }).product_id;
  }
  return null;
}

/**
 * Door Boxes 2D Form component
 * Integrates the 2D door editor into the transaction drawer
 * Reads product IDs from form context to load matching SVG images
 */
export const DoorBoxes2DForm: FC<Props> = ({ className }) => {
  const form = Form.useFormInstance();

  // Get transaction data from form (same approach as TransactionForm)
  const transaction =
    (Form.useWatch(["transactions", 0], form) as Record<string, unknown>) ??
    (form.getFieldValue(["transactions", 0]) as Record<string, unknown>) ??
    {};

  // Get sash value from form
  const sashValue = transaction.sash as string | null | undefined;

  // Get product type from form (door-window, door-deaf)
  const productType = transaction.product_type as string | null | undefined;

  // Build selected products map from form values
  const selectedProducts = useMemo(() => {
    const products: Record<number, number | null> = {};

    // Map all form fields to section indexes
    products[1] = extractProductId(transaction.transom_product_id);
    products[4] = extractProductId(transaction.sheathing_product_id);
    products[5] = extractProductId(transaction.frame_product_id);
    products[6] = extractProductId(transaction.filler_product_id);
    products[7] = extractProductId(transaction.crown_product_id);
    products[8] = extractProductId(transaction.up_frame_product_id);
    products[9] = extractProductId(transaction.under_frame_product_id);
    products[10] = extractProductId(transaction.trim_product_id);
    products[11] = extractProductId(transaction.molding_product_id);
    products[12] = extractProductId(transaction.covering_primary_product_id);
    products[13] = extractProductId(transaction.covering_secondary_product_id);
    products[14] = extractProductId(transaction.color_product_id);
    products[15] = extractProductId(transaction.floor_skirting_product_id);
    products[16] = extractProductId(transaction.heated_floor_product_id);
    products[17] = extractProductId(transaction.latting_product_id);
    products[18] = extractProductId(transaction.window_product_id);
    products[19] = extractProductId(transaction.windowsill_product_id);
    products[20] = extractProductId(transaction.glass_product_id);
    products[21] = extractProductId(transaction.door_lock_product_id);
    products[22] = extractProductId(transaction.hinge_product_id);
    products[23] = extractProductId(transaction.door_bolt_product_id);
    products[24] = extractProductId(transaction.door_stopper_product_id);
    products[25] = extractProductId(transaction.anti_threshold_product_id);
    products[27] = extractProductId(transaction.extra_option_product_id);

    // Door type depends on product_type
    if (productType === "door-window") {
      products[2] = extractProductId(transaction.door_product_id);
    } else if (productType === "door-deaf") {
      products[3] = extractProductId(transaction.door_product_id);
    }

    return products;
  }, [transaction, productType]);

  // Handle product selection from 2D editor - update form fields by section index
  const handleSectionProductSelect = useCallback(
    (sectionIndex: number, productId: number | null) => {
      const fieldName = SECTION_FIELD_MAP[sectionIndex];
      if (fieldName) {
        form.setFieldValue(["transactions", 0, fieldName], productId);
      }
    },
    [form],
  );

  // Handle sash change from 2D editor - update form field
  const handleSashChange = useCallback(
    (value: string) => {
      form.setFieldValue(["transactions", 0, "sash"], value);
    },
    [form],
  );

  return (
    <div className={cn("h-[calc(100vh-200px)] min-h-[500px]", className)}>
      <Door2DEditor
        className="h-full"
        selectedProducts={selectedProducts}
        onSectionProductSelect={handleSectionProductSelect}
        sashValue={sashValue}
        onSashChange={handleSashChange}
        productType={productType}
      />
    </div>
  );
};
