import { FC, ReactNode } from "react";

import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  children: ReactNode;
}

export const AnalyticCard: FC<Props> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "flex w-full rounded-xl border border-gray-800 bg-white p-5",
        className,
      )}
    >
      {children}
    </div>
  );
};
