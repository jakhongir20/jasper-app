import { FC } from "react";
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
 */
export const DoorBoxes2DForm: FC<Props> = ({ className }) => {
  return (
    <div className={cn("h-[calc(100vh-200px)] min-h-[500px]", className)}>
      <Door2DEditor className="h-full" />
    </div>
  );
};
