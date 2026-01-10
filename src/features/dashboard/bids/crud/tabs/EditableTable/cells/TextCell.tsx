import { memo, useCallback, type ChangeEvent } from "react";
import { Form } from "antd";
import { Input } from "@/shared/ui";
import type { CellProps } from "../types";
import { COLUMN_WIDTHS } from "../types";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

export const TextCell = memo<CellProps>(
  ({ rowIndex, fieldName, fieldConfig }) => {
    const form = Form.useFormInstance<ApplicationLocalForm>();

    // Watch current value
    const currentValue = Form.useWatch(
      ["transactions", rowIndex, fieldName],
      form,
    );

    // Handle value change with aliases support
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Update the main field
        form.setFieldValue(
          ["transactions", rowIndex, fieldName] as any,
          value,
        );
        // Update aliases if any
        if (fieldConfig.aliases) {
          fieldConfig.aliases.forEach((alias) => {
            form.setFieldValue(
              ["transactions", rowIndex, alias] as any,
              value,
            );
          });
        }
      },
      [form, rowIndex, fieldName, fieldConfig.aliases],
    );

    return (
      <Input
        size="middle"
        placeholder={fieldConfig.placeholder}
        disabled={fieldConfig.disabled}
        value={currentValue ?? ""}
        onChange={handleChange}
        style={{ width: COLUMN_WIDTHS.text }}
      />
    );
  },
  (prev, next) =>
    prev.rowIndex === next.rowIndex && prev.fieldName === next.fieldName,
);

TextCell.displayName = "TextCell";
