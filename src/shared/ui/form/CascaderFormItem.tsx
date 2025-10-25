import { Form, FormItemProps } from "antd";
import { toPath } from "lodash";

interface Props extends FormItemProps {
  // You can crud custom props here if needed
}

export const CascaderFormItem = ({ children, ...props }: Props) => {
  const id =
    props.name && Array.isArray(props.name)
      ? toPath(props.name).join("-")
      : undefined;

  return (
    <Form.Item
      {...props}
      id={id}
      rules={[
        {
          validator: (_, value) => {
            if (
              !value ||
              !Array.isArray(value) ||
              value.length === 0 ||
              value[0] === undefined
            ) {
              return Promise.reject(new Error("Обязательное поле"));
            }
            return Promise.resolve();
          },
        },
      ]}
      normalize={(val) => {
        if (Array.isArray(val) && val.some((v) => v === undefined)) {
          return [];
        }
        return val;
      }}
    >
      {children}
    </Form.Item>
  );
};
