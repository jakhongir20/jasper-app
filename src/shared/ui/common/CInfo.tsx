import { FC, ReactNode } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  subValue?: ReactNode;
  extraIcon?: ReactNode;
  value: ReactNode;
  reversed?: boolean;
}

export const CInfo: FC<Props> = ({
  className,
  value,
  subValue,
  extraIcon,
  reversed = false,
}) => {
  return (
    <div className={cn("", className)}>
      {!reversed ? (
        <div>
          <div className="mb-1 text-sm font-normal leading-[18px] text-black-100">
            {value}
          </div>
          <div className="flex gap-[6px]">
            <div className="text-base font-semibold leading-5 text-black">
              {subValue ?? "-"}
            </div>
            {extraIcon && (
              <div className="flex h-[22px] w-6 items-center justify-center rounded-md bg-gray-800">
                {extraIcon}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-1 text-base font-semibold leading-5 text-black">
            {value ?? "-"}
          </div>
          <div className="flex gap-[6px]">
            <div className="mb-1 text-sm font-normal leading-[18px] text-black-100">
              {subValue ?? "-"}
            </div>
            {extraIcon && (
              <div className="flex h-[22px] w-6 items-center justify-center rounded-md bg-gray-800">
                {extraIcon}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
