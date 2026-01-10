import { memo, useCallback } from "react";
import { Form, InputNumber } from "antd";
import type { CellProps } from "../types";
import { COLUMN_WIDTHS } from "../types";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

export const NumberCell = memo<CellProps>(
  ({ rowIndex, fieldName, fieldConfig }) => {
    const form = Form.useFormInstance<ApplicationLocalForm>();
    const minVal = fieldConfig.minValue ?? 0;
    const step = fieldConfig.numberStep ?? 0.01;

    // Watch current value
    const currentValue = Form.useWatch(
      ["transactions", rowIndex, fieldName],
      form,
    );

    // Handle value change with aliases support
    const handleChange = useCallback(
      (value: number | null) => {
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
      <InputNumber
        size="middle"
        step={step}
        min={minVal}
        disabled={fieldConfig.disabled}
        placeholder={fieldConfig.placeholder}
        value={currentValue}
        onChange={handleChange}
        style={{ width: COLUMN_WIDTHS.number }}
        status={
          currentValue !== undefined &&
          currentValue !== null &&
          currentValue !== ""
            ? fieldConfig.integerOnly && !Number.isInteger(Number(currentValue))
              ? "error"
              : Number(currentValue) < minVal
                ? "error"
                : undefined
            : undefined
        }
      />
    );
  },
  (prev, next) =>
    prev.rowIndex === next.rowIndex && prev.fieldName === next.fieldName,
);

NumberCell.displayName = "NumberCell";
