import { FC } from "react";
import { Radio, RadioChangeEvent } from "antd";
import { cn } from "@/shared/helpers";
import { useTranslation } from "react-i18next";

export interface CSelectorOption {
  value: number | string;
  label: string;
  description: string;
}

interface Props {
  className?: string;
  value?: number;
  options: CSelectorOption[];
  onChange?: (e: RadioChangeEvent) => void;
}

export const CSelector: FC<Props> = ({
  className,
  value,
  onChange,
  options,
}) => {
  const { t } = useTranslation();

  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      rootClassName={
        "group [&_.ant-radio-button-wrapper-checked]:!border-violet-500 [&_.ant-radio-button-wrapper-checked]:hover:!border-violet-500 [&_.ant-radio-button-wrapper-checked_.ant-radio-button-wrapper]:!border-violet-500 [&_.ant-radio-button-wrapper>span]:!w-full [&_.ant-radio-button-wrapper]:!border [&_.ant-radio-button-wrapper]:before:!hidden [&_.ant-radio-button-wrapper]:!rounded-6 [&_.ant-radio-button-wrapper]:after:!hidden [&_.ant-radio-button-wrapper]:!bg-transparent [&_.ant-radio-button-wrapper]:!border-800"
      }
      className={cn("group flex h-auto w-full flex-col gap-2.5", className)}
    >
      {options.map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          checked={true}
          rootClassName={"group [&_.ant-radio-inner]:border-gray-900"}
          className={
            "flex min-h-[52px] w-full !min-w-[274px] cursor-pointer flex-row items-center justify-between rounded-lg bg-gray-600 py-2 pl-3 pr-2"
          }
        >
          <div className="flex w-full flex-row flex-nowrap items-center justify-between">
            <div className="">
              <div className="mb-0 text-sm font-medium group-hover:!text-black">
                {t(option.label)}
              </div>
              <div className="text-xs font-normal text-gray-500">
                {t(option.description)}
              </div>
            </div>

            <span
              className={cn(
                "transition-ease-in h-5 w-5 rounded-full border-2 border-gray-900 bg-white duration-100",
                value == option.value && "border-[5px] border-violet",
              )}
            />
          </div>
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
