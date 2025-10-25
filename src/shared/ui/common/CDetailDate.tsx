import { FC } from "react";
import { cn } from "@/shared/helpers";
import dayjs from "dayjs";

interface Props {
  className?: string;
  subValue?: Date | string;
  value: Date | string;
  layout?: "vertical" | "horizontal";
}

export const CDetailDate: FC<Props> = ({
  className,
  value,
  subValue,
  layout = "vertical",
}) => {
  return (
    <div
      className={cn(
        "flex",
        layout === "horizontal" ? "flex-row items-center gap-1" : "flex-col",
        className,
      )}
    >
      <div className="text-sm font-semibold leading-18 text-black">
        {dayjs(value).format("DD.MM.YYYY")}
      </div>
      {subValue && (
        <div className="text-xs font-normal text-gray-500">
          {dayjs(subValue).format("HH:mm")}
        </div>
      )}
    </div>
  );
};
