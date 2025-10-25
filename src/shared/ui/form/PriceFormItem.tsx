import { Form, FormItemProps } from "antd";
import { formatWithSpaces, stripNonDigits } from "@/shared/utils";

interface PriceFormItemProps extends FormItemProps {
  // You can crud custom props here if needed
}

/**
 * Reusable Form.Item for prices.
 * Automatically transforms the stored value to/from spaced format.
 */

export const PriceFormItem = ({ children, ...props }: PriceFormItemProps) => {
  return (
    <Form.Item
      {...props}
      getValueProps={(val) => {
        const raw = typeof val === "string" ? val : "";
        return { value: formatWithSpaces(raw) };
      }}
      getValueFromEvent={(e) => stripNonDigits(e.target?.value)}
    >
      {children}
    </Form.Item>
  );
};
