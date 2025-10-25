import {
  Checkbox as AntDCheckbox,
  CheckboxProps as AntDCheckboxProps,
} from "antd";
import { FC } from "react";

interface Props extends AntDCheckboxProps {
  label?: string;
}

export const Checkbox: FC<Props> = ({ label, ...restProps }) => {
  return (
    <AntDCheckbox
      className={"w-fit !border-red [&_.ant-checkbox-inner]:!border-gray-700"}
      {...restProps}
    >
      {label}
    </AntDCheckbox>
  );
};
