import { FC } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  base?: number;
  percentage: number;
}

export const ProgressDivider: FC<Props> = ({
  className,
  base = 100,
  percentage = 10,
}) => {
  const clampedPercentage = Math.max(0, Math.min(percentage, base));
  const widthPercentage = (clampedPercentage / base) * 100;

  return (
    <div className={cn("relative h-1 w-full bg-gray-600", className)}>
      <span
        className={cn(
          "absolute left-0 top-0 h-full bg-gradient-to-r from-violet-600 to-violet-700 transition-all duration-300",
          className,
        )}
        style={{ width: `${widthPercentage}%` }}
      />
    </div>
  );
};
