import { Form, FormItemProps } from "antd";

interface Props extends FormItemProps {
  maxLength: number;
  // You can crud custom props here if needed
}

/**
 * Reusable Form.Item for prices.
 * Automatically transforms the stored value to/from spaced format.
 */

export const CodeFormItem = ({
  children,
  maxLength = 17,
  required = false,
  ...props
}: Props) => {
  const pattern = new RegExp(`^\\d{${maxLength}}$`);
  return (
    <Form.Item
      {...props}
      rules={[{ required, whitespace: true }, { pattern }]}
      getValueProps={(value) => {
        const digitsOnly = String(value || "")
          .replace(/\D/g, "")
          .slice(0, maxLength);
        return { value: digitsOnly };
      }}
    >
      {children}
    </Form.Item>
  );
};
