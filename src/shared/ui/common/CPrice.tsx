import { FC, ReactNode } from "react";

import { cn } from "@/shared/helpers";
import { formatMoneyDecimal } from "@/shared/utils";

interface Props {
  className?: string;
  affix?: string;
  subValue?: ReactNode;
  value: string | number;
}

export const CPrice: FC<Props> = ({ className, subValue, value, affix }) => {
  return (
    <div className={cn("", className)}>
      <div className="text-sm font-medium leading-[18px] text-black">
        {formatMoneyDecimal(Number(value), 3)}
        {affix && <span className="pl-1 font-normal">{affix}</span>}
      </div>
      {Boolean(subValue) && (
        <div className="relative w-fit text-xs font-normal text-red">
          <span className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 transform bg-red" />
          {formatMoneyDecimal(Number(subValue), 2)}
        </div>
      )}
    </div>
  );
};
