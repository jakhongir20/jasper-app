import { useMemo } from "react";
import type { EditableColumnConfig } from "./types";
import { COLUMN_WIDTHS } from "./types";
import {
  MEASUREMENT_FIELDS,
  ALL_SECTIONS,
  type FieldConfig,
} from "../TransactionForm";

/**
 * Transform FieldConfig to EditableColumnConfig
 */
const fieldToColumn = (
  field: FieldConfig,
  allowedProductTypes?: string[],
): EditableColumnConfig => ({
  key: field.name,
  dataIndex: field.name,
  title: field.label,
  width: COLUMN_WIDTHS[field.type] ?? 100,
  cellType: field.type,
  fieldConfig: field,
  allowedProductTypes,
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
 * Index column config (fixed left)
 */
export const INDEX_COLUMN: EditableColumnConfig = {
  key: "index",
  dataIndex: "index",
  title: "№",
  width: COLUMN_WIDTHS.index,
  cellType: "text", // Not used, just placeholder
  fieldConfig: {
    name: "index",
    label: "№",
    type: "text",
  },
  fixed: "left",
};

/**
 * Hook to get ALL table columns
 * Shows columns from ALL product types - each row handles its own visibility
 * Columns are computed from:
 * 1. MEASUREMENT_FIELDS (all fields)
 * 2. ALL_SECTIONS (all sections with allowedProductTypes for filtering)
 */
export const useTableColumns = (): EditableColumnConfig[] => {
  return useMemo(() => {
    // All measurement columns - location is fixed left
    const measurementCols = MEASUREMENT_FIELDS.map((field) => {
      const col = fieldToColumn(field);
      if (field.name === "location") {
        col.fixed = "left";
      }
      return col;
    });

    // All section columns with their allowedProductTypes
    const seenFields = new Set<string>();
    const sectionCols: EditableColumnConfig[] = [];

    ALL_SECTIONS.forEach((section) => {
      section.fields.forEach((field) => {
        if (!seenFields.has(field.name)) {
          seenFields.add(field.name);
          sectionCols.push(fieldToColumn(field, section.allowedProductTypes));
        }
      });
    });

    // Combine: checkbox + index + measurement + sections + actions
    return [CHECKBOX_COLUMN, INDEX_COLUMN, ...measurementCols, ...sectionCols, ACTION_COLUMN];
  }, []);
};
