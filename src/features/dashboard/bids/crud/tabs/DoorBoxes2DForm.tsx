import { FC } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  mode: "add" | "edit";
  drawerOpen?: boolean;
}

export const DoorBoxes2DForm: FC<Props> = ({ className, mode, drawerOpen }) => {
  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-center py-12 text-gray-500">
        Форма для дверных коробок (2D) в разработке
      </div>
    </div>
  );
};
