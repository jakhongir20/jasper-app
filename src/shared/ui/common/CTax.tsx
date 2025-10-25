import { FC, ReactNode } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  children?: ReactNode;
}

export const CTax: FC<Props> = ({ className, children }) => {
  return (
    <span
      className={cn(
        "mx-1 rounded-md bg-gray-700 px-1 py-2px text-xs text-black",
        className,
      )}
    >
      {children}
    </span>
  );
};
