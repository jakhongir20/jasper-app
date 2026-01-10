import type { FieldConfig, FieldType } from "../TransactionForm";

export interface EditableColumnConfig {
  key: string;
  dataIndex: string;
  title: string;
  width: number;
  cellType: FieldType;
  fieldConfig: FieldConfig;
  fixed?: "left" | "right";
  allowedProductTypes?: string[]; // Section's allowed product types
}

export interface CellProps {
  rowIndex: number;
  fieldName: string;
  fieldConfig: FieldConfig;
  productType: string;
}

export interface RowProps {
  rowIndex: number;
  fieldKey: number;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDoubleClick: () => void;
}

// Column width constants by field type
export const COLUMN_WIDTHS: Record<FieldType | "checkbox" | "actions", number> =
  {
    text: 150,
    number: 100,
    select: 160,
    selectInfinitive: 180,
    image: 160,
    checkbox: 40,
    actions: 100,
  };
