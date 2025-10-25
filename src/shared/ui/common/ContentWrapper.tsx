import { cn } from "@/shared/helpers";
import { FC, ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

export const ContentWrapper: FC<Props> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200 flex items-center !overflow-auto border-b border-gray-800",
        className,
      )}
    >
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};
