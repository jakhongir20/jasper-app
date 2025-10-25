import { Input } from "antd";
import { TextAreaProps } from "antd/es/input";
import { FC } from "react";

const { TextArea } = Input;

interface Props extends TextAreaProps {
  placeholder?: string;
}

export const TextAreaInput: FC<Props> = ({ placeholder, ...rest }) => {
  return (
    <TextArea
      rootClassName={"[&_textarea]:!p-3"}
      className={"!text-sm placeholder:!text-red"}
      variant={"filled"}
      showCount
      maxLength={5000}
      placeholder={placeholder}
      style={{ height: 120, resize: "none" }}
      {...rest}
    />
  );
};
