import dayjs from "dayjs";
import { FC } from "react";

import { DATE_FORMAT, TIME_FORMAT } from "@/shared/constants";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  subValue?: Date | string;
  value: Date | string;
  oneline?: boolean;
  noBracket?: boolean;
  defaultTimeTextColor?: boolean;
  textSize?: "small" | "base";
}

export const CDate: FC<Props> = ({
  className,
  value,
  subValue,
  oneline = false,
  noBracket = false,
  defaultTimeTextColor = false,
  textSize = "small",
}) => {
  return (
    <div>
      {noBracket ? (
        <div>
          <p className={className}>
            <span
              className={cn(textSize === "small" ? "text-sm" : "text-base")}
            >
              {value ? dayjs(value).format(DATE_FORMAT) : "0"}
            </span>
            <span
              className={cn(
                "ml-1 font-normal",
                defaultTimeTextColor
                  ? "text-sm font-medium text-black"
                  : "text-xs text-gray-500",
                textSize === "small" ? "text-xs" : "text-base font-semibold",
              )}
            >
              {subValue ? dayjs(subValue).format(TIME_FORMAT) : "0"}
            </span>
          </p>
        </div>
      ) : (
        <div>
          <div
            className={cn(
              "",
              className,
              oneline ? "flex items-center gap-1" : "",
            )}
          >
            <div className="text-sm font-medium leading-18 text-black">
              {value != null ? dayjs(value).format("DD.MM.YYYY") : "-"}
            </div>
            {subValue && !oneline && (
              <div className="text-xs font-normal text-gray-500">
                {dayjs(subValue).format("HH:mm")}
              </div>
            )}
            {subValue && oneline && (
              <div className="text-sm font-medium leading-18 text-black">
                ({dayjs(subValue).format("HH:mm")})
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
