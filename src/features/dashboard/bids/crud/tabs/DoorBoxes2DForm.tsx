import { FC } from "react";
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

  // Get product IDs from transaction form
  const transactions = Form.useWatch("transactions", form);
  const transaction = transactions?.[0] || {};

  // Extract actual product IDs (form values may be objects with product_id field)
  const productIds = {
    doorProductId: extractProductId(transaction.door_product_id),
    frameProductId: extractProductId(transaction.frame_product_id),
    crownProductId: extractProductId(transaction.crown_product_id),
  };

  return (
    <div className={cn("h-[calc(100vh-200px)] min-h-[500px]", className)}>
      <Door2DEditor className="h-full" productIds={productIds} />
    </div>
  );
};
