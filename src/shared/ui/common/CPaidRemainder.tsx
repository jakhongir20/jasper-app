import { FC } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  startValue: string | number;
  endValue: string | number;
}

export const CPaidRemainder: FC<Props> = ({
  className,
  startValue,
  endValue,
}) => {
  return (
    <div
      className={cn(
        "flex h-10 justify-between gap-8 before:absolute before:left-1/2 before:top-1/2 before:h-1px before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-[10deg] before:bg-gray-800 before:content-['']",
        className,
      )}
    >
      <div className="px-1.5 py-1 text-xs font-medium text-green">
        {endValue}
      </div>
      <div className="content-end px-1.5 py-1 text-xs font-medium text-red">
        {startValue}
      </div>
    </div>
  );
};
