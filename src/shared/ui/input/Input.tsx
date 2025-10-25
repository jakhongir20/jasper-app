import { Input as AntDInput, InputProps as AntDInputProps } from "antd";
import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/helpers";

interface Props extends AntDInputProps {
  className?: string;
  suffix?: ReactNode;
  prefix?: ReactNode;
  addonAfter?: ReactNode;
  addonClassName?: string;
}

export const Input: FC<Props> = ({
  className,
  placeholder,
  suffix,
  prefix,
  addonAfter,
  size = "middle",
  addonClassName = "",
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <AntDInput
      variant={"filled"}
      className={cn(
        "pr-1.5 [&_.ant-input-group-addon]:bg-gray-800",
        size === "small"
          ? `min-h-8 ${!(prefix || suffix) ? "[&_.ant-input]:min-h-8" : ""}`
          : `min-h-10 ${!(prefix || suffix) ? "[&_.ant-input]:min-h-10" : ""}`,
        prefix ? "pl-2" : "pl-3",
        suffix ? "pr-2" : "pr-3",
        addonAfter ? "!pl-0 [&_.ant-input]:pl-3" : "",
        className,
      )}
      placeholder={placeholder || t("common.input.placeholder")}
      addonAfter={
        addonAfter && (
          <div className={cn("flex-center h-6 w-6", addonClassName)}>
            {addonAfter}
          </div>
        )
      }
      prefix={prefix}
      suffix={
        suffix && (
          <div className="flex h-[30px] w-8 cursor-pointer items-center rounded-md bg-gray-800 p-1.5">
            {suffix}
          </div>
        )
      }
      {...rest}
    />
  );
};
