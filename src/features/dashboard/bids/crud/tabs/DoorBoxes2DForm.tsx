import { FC, useCallback } from "react";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { Door2DEditor } from "./Door2D";

interface Props {
  className?: string;
  mode: "add" | "edit";
  drawerOpen?: boolean;
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

  // Extract actual product IDs (form values may be objects with product_id field)
  const productIds = {
    doorProductId: extractProductId(transaction.door_product_id),
    frameProductId: extractProductId(transaction.frame_product_id),
    crownProductId: extractProductId(transaction.crown_product_id),
  };

  // Get sash value from form
  const sashValue = transaction.sash as string | null | undefined;

  // Handle product selection from 2D editor - update form fields
  const handleProductSelect = useCallback(
    (type: "door" | "frame" | "crown", productId: number) => {
      const fieldMap = {
        door: "door_product_id",
        frame: "frame_product_id",
        crown: "crown_product_id",
      };

      const fieldName = fieldMap[type];
      const currentTransactions = form.getFieldValue("transactions") || [{}];

      // Update the first transaction's product field
      const updatedTransactions = [...currentTransactions];
      updatedTransactions[0] = {
        ...updatedTransactions[0],
        [fieldName]: productId,
      };

      form.setFieldsValue({ transactions: updatedTransactions });
    },
    [form],
  );

  // Handle sash change from 2D editor - update form field
  const handleSashChange = useCallback(
    (value: string) => {
      const currentTransactions = form.getFieldValue("transactions") || [{}];
      const updatedTransactions = [...currentTransactions];
      updatedTransactions[0] = {
        ...updatedTransactions[0],
        sash: value,
      };
      form.setFieldsValue({ transactions: updatedTransactions });
    },
    [form],
  );

  return (
    <div className={cn("h-[calc(100vh-200px)] min-h-[500px]", className)}>
      <Door2DEditor
        className="h-full"
        productIds={productIds}
        onProductSelect={handleProductSelect}
        sashValue={sashValue}
        onSashChange={handleSashChange}
      />
    </div>
  );
};
