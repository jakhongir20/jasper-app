import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useDateFilter } from "@/shared/hooks/useDateFilter";
import { Icon, RangePicker } from "@/shared/ui";
import { useTranslation } from "react-i18next";

dayjs.extend(isBetween);

type FilterType =
  | "today"
  | "yesterday"
  | "week"
  | "month"
  | "quarter"
  | "custom";

const sameDay = (a: Dayjs, b: Dayjs) => a.isSame(b, "day");

const guessPreset = (startStr?: string, endStr?: string): FilterType => {
  if (!startStr || !endStr) return "custom";

  const start = dayjs(startStr);
  const end = dayjs(endStr);
  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");

  if (!start.isValid() || !end.isValid()) return "custom";

  if (sameDay(start, today) && sameDay(end, today)) return "today";
  if (sameDay(start, yesterday) && sameDay(end, yesterday)) return "yesterday";

  const weekStart = today.startOf("week");
  const weekEnd = today.endOf("week");
  if (sameDay(start, weekStart) && sameDay(end, weekEnd)) return "week";

  const monthStart = today.startOf("month");
  const monthEnd = today.endOf("month");
  if (sameDay(start, monthStart) && sameDay(end, monthEnd)) return "month";

  const quarterStart = today.startOf("quarter");
  const quarterEnd = today.endOf("quarter");
  if (sameDay(start, quarterStart) && sameDay(end, quarterEnd))
    return "quarter";

  return "custom";
};

interface Props {
  className?: string;
  start?: string;
  end?: string;
}

export const DateFilter: FC<Props> = ({
  className,
  start: propStart,
  end: propEnd,
}) => {
  const { t } = useTranslation();
  const { calculateDateRange, activeFilter, setFilter, setCustomDates } =
    useDateFilter();
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);

  const pushRangeToUrl = (start: Dayjs, end: Dayjs) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      propStart || "registrationDate_from",
      start.format("YYYY-MM-DD"),
    );
    newSearchParams.set(
      propEnd || "registrationDate_to",
      end.format("YYYY-MM-DD"),
    );
    setSearchParams(newSearchParams);
  };

  const clearDateFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Remove the date filter parameters
    if (propStart) newSearchParams.delete(propStart);
    if (propEnd) newSearchParams.delete(propEnd);

    // If no custom prop names provided, use defaults
    if (!propStart) newSearchParams.delete("registrationDate_from");
    if (!propEnd) newSearchParams.delete("registrationDate_to");

    setSearchParams(newSearchParams);

    // Reset local state
    setRange(null);
    setFilter("custom");
    setCustomDates({ startDate: null, endDate: null });
  };

  // Check if date filter is active (has values in URL)
  const isDateFilterActive = () => {
    const startParam = searchParams.get(propStart || "registrationDate_from");
    const endParam = searchParams.get(propEnd || "registrationDate_to");
    return !!(startParam && endParam);
  };

  useEffect(() => {
    // Get values from URL search params
    const startParam = searchParams.get(propStart || "registrationDate_from");
    const endParam = searchParams.get(propEnd || "registrationDate_to");

    if (startParam && endParam) {
      const preset = guessPreset(startParam, endParam);
      setFilter(preset);

      const start = dayjs(startParam);
      const end = dayjs(endParam);

      if (start.isValid() && end.isValid()) {
        if (preset === "custom") {
          setCustomDates({ startDate: start, endDate: end });
        }
        setRange([start, end]);
      }
    } else {
      // No values in URL, reset state
      setFilter("custom");
      setRange(null);
    }
  }, [searchParams, propStart, propEnd]);

  const handleRadioChange = (e: RadioChangeEvent) => {
    const preset = e.target.value as FilterType;
    setFilter(preset);

    if (preset === "custom") return;

    const { startDate, endDate } = calculateDateRange(preset);
    setRange([startDate, endDate]);
    pushRangeToUrl(startDate, endDate);
  };

  const handleRangeChange = (values: [Dayjs | null, Dayjs | null] | null) => {
    if (!values || !values[0] || !values[1]) return;

    const [start, end] = values;
    setRange([start, end]);
    setFilter("custom");
    setCustomDates({ startDate: start, endDate: end });
    pushRangeToUrl(start, end);
  };

  return (
    <div className="overflow-x-auto rounded-xl bg-gray-600 p-1">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Radio.Group
          value={activeFilter}
          onChange={handleRadioChange}
          className="flex items-center gap-1"
        >
          <Radio.Button value="today">{t("common.date.today")}</Radio.Button>
          <Radio.Button value="yesterday">
            {t("common.date.yesterday")}
          </Radio.Button>
          <Radio.Button value="week">{t("common.date.week")}</Radio.Button>
          <Radio.Button value="month">{t("common.date.month")}</Radio.Button>
          <Radio.Button value="quarter">
            {t("common.date.quarter")}
          </Radio.Button>
        </Radio.Group>

        <div className="w-[220px] flex-shrink-0 sm:w-[260px]">
          <RangePicker
            className="w-full rounded-md !bg-white text-sm"
            allowClear={false}
            value={range}
            format="D MMM YYYY"
            from={propStart}
            to={propEnd}
            onChange={handleRangeChange}
            placeholder={["Start Date", "End Date"]}
          />
        </div>

        {isDateFilterActive() && (
          <button
            onClick={clearDateFilter}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg transition-all duration-300"
            title={t("common.button.clearDateFilter", "Clear date filter")}
            aria-label="Clear date filter"
          >
            <Icon icon="close" width={12} className={"text-violet"} />
          </button>
        )}
      </div>
    </div>
  );
};
