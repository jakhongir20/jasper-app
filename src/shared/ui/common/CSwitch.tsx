import { FC } from "react";
import { Switch as AntDSwitch, SwitchProps } from "antd";

interface Props extends SwitchProps {}

export const CSwitch: FC<Props> = ({ ...restProps }) => {
  return <AntDSwitch size={"small"} className={"bg-gray-900"} {...restProps} />;
};
