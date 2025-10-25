import { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  DatePicker as AntDDatePicker,
  DatePickerProps as AntDDatePickerProps,
} from "antd";
import { Icon } from "@/shared/ui";
import { cn } from "@/shared/helpers";
import { DATE_FETCH_FORMAT, DATE_FORMAT } from "@/shared/constants";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

interface Props extends AntDDatePickerProps {
  placeholder?: string;
  className?: string;
  valueName?: string;
}

export const DatePicker: FC<Props> = ({
  className,
  placeholder,
  valueName = "created_at", // MIGHT BE CHANGED
  ...rest
}) => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(valueName)
    ? dayjs(
        dayjs(searchParams.get(valueName)).format(DATE_FORMAT),
        DATE_FORMAT,
      ) || null
    : null;

  return (
    <AntDDatePicker
      format={{
        format: DATE_FORMAT,
        type: "mask",
      }}
      value={value}
      size={"large"}
      className={cn("h-10 w-full", className)}
      variant={"filled"}
      suffixIcon={<Icon icon={"calendar-full"} color="text-black" />}
      placeholder={placeholder || t("common.datepicker.placeholder")}
      onChange={(value) => {
        if (!value) {
          const params = new URLSearchParams(searchParams);
          params.delete(valueName);
          setSearchParams(params);
          return;
        }
        setSearchParams({
          ...Object.fromEntries(searchParams),
          [valueName]: dayjs(value).format(DATE_FETCH_FORMAT),
        });
      }}
      {...rest}
    />
  );
};
