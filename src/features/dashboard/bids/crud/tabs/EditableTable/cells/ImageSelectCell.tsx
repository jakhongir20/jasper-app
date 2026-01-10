import { memo, useMemo } from "react";
import { Form } from "antd";
import { ImageSelectPopover } from "@/shared/ui/popover/ImageSelectPopover";
import type { CellProps } from "../types";
import { COLUMN_WIDTHS } from "../types";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

export const ImageSelectCell = memo<CellProps>(
  ({ rowIndex, fieldName, fieldConfig, productType }) => {
    const form = Form.useFormInstance<ApplicationLocalForm>();

    // Get current transaction values for dynamic params
    const transactionValues =
      Form.useWatch(["transactions", rowIndex], form) ?? {};

    // Compute params (can be static or dynamic function)
    const params = useMemo(() => {
      if (typeof fieldConfig.params === "function") {
        return fieldConfig.params(transactionValues, productType);
      }
      return fieldConfig.params;
    }, [fieldConfig.params, transactionValues, productType]);

    // Handle selection and alias syncing
    const handleChange = (item: Record<string, unknown> | null) => {
      const extractedId = item?.[fieldConfig.valueKey ?? "framework_id"];
      form.setFieldValue(
        ["transactions", rowIndex, fieldName] as any,
        extractedId,
      );

      if (fieldConfig.aliases) {
        fieldConfig.aliases.forEach((alias) => {
          form.setFieldValue(
            ["transactions", rowIndex, alias] as any,
            extractedId,
          );
        });
      }
    };

    // Get current value
    const value = Form.useWatch(["transactions", rowIndex, fieldName], form);

    return (
      <div style={{ width: COLUMN_WIDTHS.image }}>
        <ImageSelectPopover
          placeholder={fieldConfig.placeholder}
          fetchUrl={fieldConfig.fetchUrl ?? ""}
          params={params}
          labelKey={(fieldConfig.labelKey ?? "name") as string}
          imageKey={fieldConfig.imageKey}
          valueKey={(fieldConfig.valueKey ?? "framework_id") as string}
          disabled={fieldConfig.disabled}
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  },
  (prev, next) =>
    prev.rowIndex === next.rowIndex &&
    prev.fieldName === next.fieldName &&
    prev.productType === next.productType,
);

ImageSelectCell.displayName = "ImageSelectCell";
