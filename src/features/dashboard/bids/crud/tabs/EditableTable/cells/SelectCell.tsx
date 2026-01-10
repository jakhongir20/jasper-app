import { memo, useCallback } from "react";
import { Form } from "antd";
import { Select } from "@/shared/ui";
import type { CellProps } from "../types";
import { COLUMN_WIDTHS } from "../types";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

export const SelectCell = memo<CellProps>(
  ({ rowIndex, fieldName, fieldConfig }) => {
    const form = Form.useFormInstance<ApplicationLocalForm>();
    const hasImages = fieldConfig.options?.some((opt) => opt.image);

    // Handle value change with aliases support
    const handleChange = useCallback(
      (value: unknown) => {
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

    // Watch current value
    const currentValue = Form.useWatch(
      ["transactions", rowIndex, fieldName],
      form,
    );

    return (
      <Select
        size="medium"
        placeholder={fieldConfig.placeholder}
        options={fieldConfig.options}
        allowClear={fieldConfig.allowClear}
        disabled={fieldConfig.disabled}
        value={currentValue}
        onChange={handleChange}
        style={{ width: COLUMN_WIDTHS.select }}
          optionRender={
            hasImages
              ? (option) => {
                  const opt = fieldConfig.options?.find(
                    (o) => o.value === option.value,
                  );
                  return (
                    <div className="flex items-center gap-2">
                      {opt?.image && (
                        <img
                          src={opt.image}
                          alt={opt.label}
                          className="h-5 w-5 object-contain"
                        />
                      )}
                      <span>{opt?.label}</span>
                    </div>
                  );
                }
              : undefined
          }
          labelRender={
            hasImages
              ? (props) => {
                  const opt = fieldConfig.options?.find(
                    (o) => o.value === props.value,
                  );
                  return (
                    <div className="flex items-center gap-1">
                      {opt?.image && (
                        <img
                          src={opt.image}
                          alt={opt.label}
                          className="h-4 w-4 object-contain"
                        />
                      )}
                      <span className="truncate">{opt?.label}</span>
                    </div>
                  );
                }
              : undefined
          }
      />
    );
  },
  (prev, next) =>
    prev.rowIndex === next.rowIndex && prev.fieldName === next.fieldName,
);

SelectCell.displayName = "SelectCell";
