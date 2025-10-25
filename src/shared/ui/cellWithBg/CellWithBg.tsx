import { FC, ReactNode } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  children?: ReactNode;
  className?: string;
}

export const CellWithBg: FC<Props> = ({ children, className }) => {
  return (
    <span
      className={cn(
        className,
        "flex w-full items-center rounded-lg bg-gray-600 px-4 py-2.5 text-sm text-gray-500",
      )}
    >
      {children}
    </span>
  );
};
