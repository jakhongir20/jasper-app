import { memo } from "react";
import { Checkbox, Form } from "antd";
import type { EditableColumnConfig, RowProps } from "./types";
import {
  TextCell,
  NumberCell,
  SelectCell,
  SelectInfinitiveCell,
  ImageSelectCell,
  ActionCell,
} from "./cells";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

interface EditableRowProps extends RowProps {
  columns: EditableColumnConfig[];
  onSave: (rowIndex: number) => Promise<void>;
  isSaving: boolean;
}

export const EditableRow = memo<EditableRowProps>(
  ({
    rowIndex,
    selected,
    onSelect,
    onRemove,
    onDoubleClick,
    columns,
    onSave,
    isSaving,
  }) => {
    const form = Form.useFormInstance<ApplicationLocalForm>();

    // Watch product_type for this row to determine field visibility
    const productType =
      (Form.useWatch(
        ["transactions", rowIndex, "product_type"],
        form,
      ) as string) ?? "";

    // Row border color
    const borderColor = "#f0f0f0";

    const renderCell = (column: EditableColumnConfig) => {
      const { fieldConfig, cellType, key } = column;

      // Checkbox cell
      if (key === "checkbox") {
        return (
          <td
            key={key}
            className="sticky left-0 z-10 bg-white px-2 py-2 text-center"
            style={{ width: column.width, minWidth: column.width }}
          >
            <Checkbox checked={selected} onChange={onSelect} />
          </td>
        );
      }

      // Actions cell
      if (key === "actions") {
        return (
          <td
            key={key}
            className="sticky right-0 z-10 bg-white px-2 py-2"
            style={{ width: column.width, minWidth: column.width }}
          >
            <ActionCell
              rowIndex={rowIndex}
              onSave={onSave}
              onDelete={onRemove}
              isSaving={isSaving}
            />
          </td>
        );
      }

      // Check field visibility based on current product_type
      if (fieldConfig.visible) {
        const transactionValues =
          form.getFieldValue(["transactions", rowIndex]) ?? {};
        try {
          if (!fieldConfig.visible(transactionValues, productType)) {
            return (
              <td
                key={key}
                className="px-2 py-2"
                style={{ width: column.width, minWidth: column.width }}
              >
                <span className="text-gray-300">—</span>
              </td>
            );
          }
        } catch {
          // If visibility check fails, show cell anyway
        }
      }

      // Render appropriate cell type
      const cellProps = {
        rowIndex,
        fieldName: fieldConfig.name,
        fieldConfig,
        productType,
      };

      let cellContent: React.ReactNode;

      switch (cellType) {
        case "text":
          cellContent = <TextCell {...cellProps} />;
          break;
        case "number":
          cellContent = <NumberCell {...cellProps} />;
          break;
        case "select":
          cellContent = <SelectCell {...cellProps} />;
          break;
        case "selectInfinitive":
          cellContent = <SelectInfinitiveCell {...cellProps} />;
          break;
        case "image":
          cellContent = <ImageSelectCell {...cellProps} />;
          break;
        default:
          cellContent = null;
      }

      return (
        <td
          key={key}
          className="px-2 py-2"
          style={{ width: column.width, minWidth: column.width }}
        >
          {cellContent}
        </td>
      );
    };

    return (
      <tr
        className={`transition-colors hover:bg-gray-50 ${selected ? "bg-blue-50 hover:bg-blue-50" : ""}`}
        style={{ borderBottom: `1px solid ${borderColor}` }}
        onDoubleClick={onDoubleClick}
      >
        {columns.map(renderCell)}
      </tr>
    );
  },
  (prev, next) => {
    // Check basic props
    if (
      prev.rowIndex !== next.rowIndex ||
      prev.selected !== next.selected ||
      prev.isSaving !== next.isSaving
    ) {
      return false;
    }

    // Check columns by length and keys
    if (prev.columns.length !== next.columns.length) {
      return false;
    }

    // Check if column keys are the same (columns changed based on product_type)
    for (let i = 0; i < prev.columns.length; i++) {
      if (prev.columns[i].key !== next.columns[i].key) {
        return false;
      }
    }

    return true;
  },
);

EditableRow.displayName = "EditableRow";
