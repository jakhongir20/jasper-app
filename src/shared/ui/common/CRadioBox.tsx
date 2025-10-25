import { FC } from "react";
import { Radio as AntDRadio, RadioProps as AntDRadioProps } from "antd";
import { cn } from "@/shared/helpers";
import { IconType } from "@/shared/types";
import { Icon } from "@/shared/ui";

interface Props extends AntDRadioProps {
  className?: string;
  label: string;
  icon: IconType;
}

export const CRadioBox: FC<Props> = ({
  className,
  label,
  icon,
  ...restProps
}) => {
  return (
    <label
      htmlFor={"idx"}
      className={cn(
        "flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg bg-gray-600 py-2 pl-3 pr-2 hover:bg-gray-700/50",
        className,
      )}
    >
      <div className="flex gap-1.5">
        {icon && <Icon icon={icon} color="text-gray-200" height={20} />}
        <span>{label}</span>
      </div>
      <AntDRadio.Button
        name={"idx"}
        rootClassName={"[&_.ant-radio-inner]:border-gray-900"}
        className={"w-fit"}
        {...restProps}
      ></AntDRadio.Button>
    </label>
  );
};
// <Radio.Group
//     block
//     options={options}
//     defaultValue="Apple"
//     optionType="button"
//     buttonStyle="solid"
// />
