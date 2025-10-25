import "dayjs/locale/ru"; // Russian locale for month names

import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import React, { FC } from "react";

import { cn } from "@/shared/helpers"; // Custom styles
import { Icon } from "@/shared/ui";

dayjs.extend(localeData);

interface Props {
  className?: string;
  value: Dayjs | undefined;
  onSelect: (date: Dayjs) => void;
}

export const CCustomCalendar: FC<Props> = ({
  className,
  value = dayjs(),
  onSelect,
}) => {
  return (
    <div
      className={cn("overflow-hidden rounded-xl bg-gray-600 p-2.5", className)}
    >
      <Calendar
        fullscreen={false}
        value={value}
        onSelect={(date: Dayjs) => {
          onSelect(date);
        }}
        disabledDate={(date: Dayjs) => date.isAfter(dayjs())}
        style={{ backgroundColor: "#F8F9FA" }}
        rootClassName={
          "[&_.ant-picker-panel]:!bg-gray-600 [&_.ant-picker-calendar]:!bg-gray-600"
        }
        headerRender={({ value, onChange }) => {
          return (
            <div className="mx-auto flex w-[90%] justify-between text-lg font-bold">
              <button
                className="cursor-pointer border-none bg-none text-lg"
                onClick={() => onChange(value.subtract(1, "month"))}
              >
                <Icon
                  width={26}
                  icon={"chevron-down"}
                  className={"rotate-90 text-black"}
                />
              </button>
              <span className="month-year">{value.format("MMMM YYYY")}</span>
              <button onClick={() => onChange(value.add(1, "month"))}>
                <Icon
                  width={26}
                  icon={"chevron-down"}
                  className={"-rotate-90 text-black"}
                />
              </button>
            </div>
          );
        }}
        fullCellRender={(date) => {
          const isSelected = value && date.isSame(value, "day");
          const isWeekend = date.day() === 6 || date.day() === 0; // Saturday or Sunday
          return (
            <div
              className={cn(
                "mx-auto flex h-8 w-11 items-center justify-center rounded-lg text-center text-sm font-medium transition-all duration-300 hover:bg-[rgba(158,57,255,0.12)] hover:text-[#8e44ad]",
                {
                  "bg-[#8e44ad] font-bold text-white hover:bg-[#8e44ad] hover:text-white":
                    isSelected ?? false,
                  "text-red": isWeekend,
                },
              )}
            >
              {date.date()}
            </div>
          );
        }}
      />
    </div>
  );
};
