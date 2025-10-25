import { FC } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Form, FormItemProps } from "antd";

interface Props extends FormItemProps {}

export const DateFormItem: FC<Props> = ({ children, ...props }) => {
  return (
    <Form.Item
      {...props}
      getValueProps={(value) => ({
        value: value ? dayjs(value) : null,
      })}
      getValueFromEvent={(value: Dayjs | null) =>
        value ? value.toISOString() : null
      }
    >
      {children}
    </Form.Item>
  );
};
