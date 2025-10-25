import {
  DatePicker as AntDDatePicker,
  DatePickerProps as AntDDatePickerProps,
} from "antd";
import dayjs from "dayjs";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { cn } from "@/shared/helpers";
import { Icon } from "@/shared/ui";

interface Props extends AntDDatePickerProps {
  placeholder?: string;
  className?: string;
  valueName?: string;
}

export const YearPicker: FC<Props> = ({
  className,
  placeholder,
  valueName = "created_at",
  ...rest
}) => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(valueName)
    ? dayjs(
        dayjs(searchParams.get(valueName)).format("YYYY"), // Set format to year
        "YYYY",
      ) || null
    : null;

  return (
    <AntDDatePicker
      picker="year" // Set picker to "year" for year picker functionality
      format="YYYY" // Year format
      value={value}
      size={"large"}
      className={cn("h-10 w-full", className)}
      variant={"filled"}
      suffixIcon={<Icon icon={"calendar-full"} color="text-black" />}
      placeholder={placeholder || t("common.datepicker.yearPlaceholder")}
      onChange={(value) => {
        if (!value) {
          const params = new URLSearchParams(searchParams);
          params.delete(valueName);
          setSearchParams(params);
          return;
        }
        setSearchParams({
          ...Object.fromEntries(searchParams),
          [valueName]: dayjs(value).format("YYYY"),
        });
      }}
      {...rest}
    />
  );
};
