import { FC } from "react";
import { Radio, RadioChangeEvent } from "antd";
import { cn } from "@/shared/helpers";
import { useTranslation } from "react-i18next";
import { Icon } from "@/shared/ui";
import { IconType } from "@/shared/types";

interface Props {
  className?: string;
  value?: number;
  onChange?: (e: RadioChangeEvent) => void;
}

interface GenderOption {
  value: number;
  icon: string;
  labelKey: string;
}

export const CGenderSelector: FC<Props> = ({ className, value, onChange }) => {
  const { t } = useTranslation();

  const genderOptions: GenderOption[] = [
    {
      value: 1,
      icon: "g-male",
      labelKey: "common.input.genderMale",
    },
    {
      value: 2,
      icon: "g-female",
      labelKey: "common.input.genderFemale",
    },
  ];

  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      rootClassName={
        "[&_.ant-radio-button-wrapper-checked]:!bg-violet/5  [&_.ant-radio-button-wrapper>span]:!w-full [&_.ant-radio-button-wrapper]:before:!hidden [&_.ant-radio-button-wrapper]:border-none"
      }
      className={cn("flex w-fit gap-4", className)}
    >
      {genderOptions.map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          rootClassName={"[&_.ant-radio-inner]:border-gray-900"}
          className={
            "flex min-h-10 w-full !min-w-[274px] cursor-pointer flex-row items-center justify-between rounded-lg bg-gray-600 py-2 pl-3 pr-2 hover:bg-gray-700/50"
          }
        >
          <div className="flex w-full flex-row flex-nowrap items-center justify-between">
            <div className="flex w-fit items-center gap-1.5 !text-black">
              <Icon
                icon={option.icon as IconType}
                color="text-gray-200"
                height={20}
              />
              {t(option.labelKey)}
            </div>

            <span
              className={cn(
                "h-5 w-5 rounded-full border-2 border-gray-900 bg-white transition-all duration-300",
                value === option.value && "border-4 border-violet",
              )}
            />
          </div>
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
