import { FC } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  label?: string;
  value: string;
}

export const CNotation: FC<Props> = ({ className, label, value }) => {
  return (
    <div className={cn("", className)}>
      <div className="mb-1 text-sm font-normal leading-[18px] text-black-100">
        {label}
      </div>
      <div className="max-w-[80%] text-sm font-medium text-black">{value}</div>
    </div>
  );
};
