import { FC } from "react";
import { useTranslation } from "react-i18next";
import { DatePicker as AntDDatePicker } from "antd";
import { Icon } from "@/shared/ui";
import { cn } from "@/shared/helpers";
import { DATE_FETCH_FORMAT, DATE_FORMAT } from "@/shared/constants";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

interface Props {
  placeholder?: string;
  className?: string;
  from?: string;
  to?: string;
}

export const RangePicker: FC<Props> = ({
  className,
  placeholder,
  from = "created_at_from",
  to = "created_at_to",
  ...rest
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <AntDDatePicker.RangePicker
      format={DATE_FORMAT}
      size={"small"}
      className={cn("!h-8 w-full !bg-gray-800", className)}
      variant={"filled"}
      suffixIcon={<Icon icon={"calendar-full"} color="text-black" />}
      value={[
        searchParams.get(from)
          ? dayjs(searchParams.get(from), DATE_FETCH_FORMAT)
          : null,
        searchParams.get(to)
          ? dayjs(searchParams.get(to), DATE_FETCH_FORMAT)
          : null,
      ]}
      placeholder={[
        t("common.datepicker.startDate"),
        t("common.datepicker.endDate"),
      ]}
      onCalendarChange={(value) => {
        const params = new URLSearchParams(searchParams);

        if (!value || (value[0] === null && value[1] === null)) {
          // Clear both parameters when no dates are selected
          params.delete(from);
          params.delete(to);
        } else {
          // Handle "from" date
          if (value[0]) {
            params.set(from, dayjs(value[0]).format(DATE_FETCH_FORMAT));
          } else {
            params.delete(from);
          }

          // Handle "to" date
          if (value[1]) {
            params.set(to, dayjs(value[1]).format(DATE_FETCH_FORMAT));
          } else {
            params.delete(to);
          }
        }

        setSearchParams(params);
      }}
      {...rest}
    />
  );
};
