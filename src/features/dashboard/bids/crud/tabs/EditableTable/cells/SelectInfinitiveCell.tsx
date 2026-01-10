import { memo, useMemo, useCallback } from "react";
import { Form } from "antd";
import { SelectInfinitive } from "@/shared/ui";
import type { CellProps } from "../types";
import { COLUMN_WIDTHS } from "../types";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

export const SelectInfinitiveCell = memo<CellProps>(
  ({ rowIndex, fieldName, fieldConfig, productType }) => {
    const form = Form.useFormInstance<ApplicationLocalForm>();

    // Get current transaction values for dynamic params
    const transactionValues =
      Form.useWatch(["transactions", rowIndex], form) ?? {};

    // Watch the current field value
    const currentValue = Form.useWatch(
      ["transactions", rowIndex, fieldName],
      form,
    );

    // Compute params (can be static or dynamic function)
    const params = useMemo(() => {
      if (typeof fieldConfig.params === "function") {
        return fieldConfig.params(transactionValues, productType);
      }
      return fieldConfig.params;
    }, [fieldConfig.params, transactionValues, productType]);

    const valueKey = (fieldConfig.valueKey ?? "product_id") as string;

    // Handle selection - extract ID and store it
    const handleSelect = useCallback(
      (value: string, selectedOption?: unknown) => {
        // Extract the ID from selectedOption
        const idValue = selectedOption
          ? (selectedOption as Record<string, unknown>)[valueKey]
          : value;

        // Store just the ID in the form
        form.setFieldValue(
          ["transactions", rowIndex, fieldName] as any,
          idValue,
        );

        // Handle aliases
        if (fieldConfig.aliases) {
          fieldConfig.aliases.forEach((alias) => {
            form.setFieldValue(
              ["transactions", rowIndex, alias] as any,
              idValue,
            );
          });
        }
      },
      [form, rowIndex, fieldName, fieldConfig.aliases, valueKey],
    );

    // Handle clear
    const handleClear = useCallback(() => {
      form.setFieldValue(["transactions", rowIndex, fieldName] as any, null);
      if (fieldConfig.aliases) {
        fieldConfig.aliases.forEach((alias) => {
          form.setFieldValue(["transactions", rowIndex, alias] as any, null);
        });
      }
    }, [form, rowIndex, fieldName, fieldConfig.aliases]);

    return (
      <SelectInfinitive
        size="medium"
        placeholder={fieldConfig.placeholder}
        queryKey={fieldConfig.queryKey}
        fetchUrl={fieldConfig.fetchUrl}
        params={params}
        labelKey={fieldConfig.labelKey ?? "name"}
        valueKey={valueKey}
        useValueAsLabel={fieldConfig.useValueAsLabel}
        allowClear={fieldConfig.allowClear}
        disabled={fieldConfig.disabled}
        value={currentValue}
        onSelect={handleSelect}
        onClear={handleClear}
        style={{ width: COLUMN_WIDTHS.selectInfinitive }}
      />
    );
  },
  (prev, next) =>
    prev.rowIndex === next.rowIndex &&
    prev.fieldName === next.fieldName &&
    prev.productType === next.productType,
);

SelectInfinitiveCell.displayName = "SelectInfinitiveCell";
