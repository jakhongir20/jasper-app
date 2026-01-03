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
 * Door Boxes 2D Form component
 * Integrates the 2D door editor into the transaction drawer
 * Reads product IDs from form context to load matching SVG images
 */
export const DoorBoxes2DForm: FC<Props> = ({ className }) => {
  const form = Form.useFormInstance();

  // Get product IDs from transaction form
  const transactions = Form.useWatch("transactions", form);
  const transaction = transactions?.[0] || {};

  const productIds = {
    doorProductId: transaction.door_product_id as number | null | undefined,
    frameProductId: transaction.frame_product_id as number | null | undefined,
    crownProductId: transaction.crown_product_id as number | null | undefined,
  };

  return (
    <div className={cn("h-[calc(100vh-200px)] min-h-[500px]", className)}>
      <Door2DEditor className="h-full" productIds={productIds} />
    </div>
  );
};
