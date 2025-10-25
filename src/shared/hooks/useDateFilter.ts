import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { useCallback, useState } from "react";

dayjs.extend(quarterOfYear);

export type DateFilterType =
  | "today"
  | "yesterday"
  | "week"
  | "month"
  | "quarter"
  | "custom";

export interface DateRange {
  startDate: Dayjs;
  endDate: Dayjs;
}

export function useDateFilter(initialFilter: DateFilterType = "month") {
  const [activeFilter, setActiveFilter] =
    useState<DateFilterType>(initialFilter);

  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const calculateDateRange = useCallback(
    (filterType: DateFilterType): DateRange => {
      const today = dayjs();

      switch (filterType) {
        case "today":
          return {
            startDate: today.startOf("day"),
            endDate: today.endOf("day"),
          };
        case "yesterday":
          const yesterday = today.subtract(1, "day");
          return {
            startDate: yesterday.startOf("day"),
            endDate: yesterday.endOf("day"),
          };
        case "week":
          return {
            startDate: today.startOf("week"),
            endDate: today.endOf("week"),
          };
        case "month":
          return {
            startDate: today.startOf("month"),
            endDate: today.endOf("month"),
          };
        case "quarter":
          return {
            startDate: today.startOf("quarter"),
            endDate: today.endOf("quarter"),
          };
        case "custom":
          if (customDateRange.startDate && customDateRange.endDate) {
            return {
              startDate: customDateRange.startDate,
              endDate: customDateRange.endDate,
            };
          }
          return {
            startDate: today.startOf("day"),
            endDate: today.endOf("day"),
          };
        default:
          return {
            startDate: today.startOf("day"),
            endDate: today.endOf("day"),
          };
      }
    },
    [customDateRange],
  );

  const currentDateRange = calculateDateRange(activeFilter);

  const setFilter = useCallback((filterType: DateFilterType) => {
    setActiveFilter(filterType);
  }, []);

  const setCustomDates = useCallback(
    (startDate: Dayjs | null, endDate: Dayjs | null) => {
      setCustomDateRange({
        startDate,
        endDate,
      });

      setActiveFilter("custom");
    },
    [],
  );

  return {
    activeFilter,
    setFilter,
    customDateRange,
    setCustomDates,
    currentDateRange,
    calculateDateRange,
  };
}
