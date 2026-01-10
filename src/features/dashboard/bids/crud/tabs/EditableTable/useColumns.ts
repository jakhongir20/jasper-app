import { useMemo } from "react";
import { Form } from "antd";
import type { EditableColumnConfig } from "./types";
import { COLUMN_WIDTHS } from "./types";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";
import {
  MEASUREMENT_FIELDS,
  getSectionsForProductType,
  type FieldConfig,
} from "../TransactionForm";

/**
 * Transform FieldConfig to EditableColumnConfig
 */
const fieldToColumn = (field: FieldConfig): EditableColumnConfig => ({
  key: field.name,
  dataIndex: field.name,
  title: field.label,
  width: COLUMN_WIDTHS[field.type] ?? 100,
  cellType: field.type,
  fieldConfig: field,
});

/**
 * Action column config (fixed right)
 */
export const ACTION_COLUMN: EditableColumnConfig = {
  key: "actions",
  dataIndex: "actions",
  title: "",
  width: COLUMN_WIDTHS.actions,
  cellType: "text", // Not used, just placeholder
  fieldConfig: {
    name: "actions",
    label: "",
    type: "text",
  },
  fixed: "right",
};

/**
 * Checkbox column config (fixed left)
 */
export const CHECKBOX_COLUMN: EditableColumnConfig = {
  key: "checkbox",
  dataIndex: "checkbox",
  title: "",
  width: COLUMN_WIDTHS.checkbox,
  cellType: "text", // Not used, just placeholder
  fieldConfig: {
    name: "checkbox",
    label: "",
    type: "text",
  },
  fixed: "left",
};

/**
 * Hook to get table columns based on first row's product_type
 * Columns are computed from:
 * 1. MEASUREMENT_FIELDS (filtered by visibility based on product_type)
 * 2. Sections filtered by product_type
 */
export const useTableColumns = (): EditableColumnConfig[] => {
  const form = Form.useFormInstance<ApplicationLocalForm>();

  // Watch first row's product_type to determine columns
  const firstRowProductType = Form.useWatch(
    ["transactions", 0, "product_type"],
    form,
  ) as string | undefined;

  // Normalize product type - treat undefined/null as empty string
  const productType = firstRowProductType || "";

  return useMemo(() => {
    // Measurement columns (filter by visibility based on product_type)
    const measurementCols = MEASUREMENT_FIELDS.filter((field) => {
      // Fields without visible function are always shown
      if (typeof field.visible !== "function") {
        return true;
      }
      // Check visibility with current product type
      try {
        return field.visible({}, productType);
      } catch {
        // If visibility check fails, hide the field
        return false;
      }
    }).map(fieldToColumn);

    // Section columns based on product_type
    const sectionCols = productType
      ? getSectionsForProductType(productType).flatMap((section) =>
          section.fields
            .filter((field) => {
              if (typeof field.visible !== "function") {
                return true;
              }
              try {
                return field.visible({}, productType);
              } catch {
                return false;
              }
            })
            .map(fieldToColumn),
        )
      : [];

    // Combine: checkbox + measurement + sections + actions
    return [CHECKBOX_COLUMN, ...measurementCols, ...sectionCols, ACTION_COLUMN];
  }, [productType]);
};

/**
 * Get columns for a specific product type (utility function)
 */
export const getColumnsForProductType = (
  productType: string | null,
): EditableColumnConfig[] => {
  const normalizedType = productType || "";

  const measurementCols = MEASUREMENT_FIELDS.filter((field) => {
    if (typeof field.visible !== "function") {
      return true;
    }
    try {
      return field.visible({}, normalizedType);
    } catch {
      return false;
    }
  }).map(fieldToColumn);

  const sectionCols = normalizedType
    ? getSectionsForProductType(normalizedType).flatMap((section) =>
        section.fields
          .filter((field) => {
            if (typeof field.visible !== "function") {
              return true;
            }
            try {
              return field.visible({}, normalizedType);
            } catch {
              return false;
            }
          })
          .map(fieldToColumn),
      )
    : [];

  return [CHECKBOX_COLUMN, ...measurementCols, ...sectionCols, ACTION_COLUMN];
};
