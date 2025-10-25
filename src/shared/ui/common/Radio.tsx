import { Radio as AntDRadio, RadioProps as AntDRadioProps } from "antd";
import type { FC, ReactNode } from "react";

interface Props extends AntDRadioProps {
  label?: string | ReactNode;
}

export const Radio: FC<Props> = ({ label, ...restProps }) => {
  return (
    <AntDRadio
      rootClassName={"[&_.ant-radio-inner]:border-gray-900"}
      className={"flex-y-center w-fit"}
      {...restProps}
    >
      {label}
    </AntDRadio>
  );
};
