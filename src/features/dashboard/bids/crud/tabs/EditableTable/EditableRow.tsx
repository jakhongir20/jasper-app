import { memo } from "react";
import { Checkbox, Form } from "antd";
import type { EditableColumnConfig, RowProps } from "./types";
import {
  ActionCell,
  ImageSelectCell,
  NumberCell,
  SelectCell,
  SelectInfinitiveCell,
  TextCell,
} from "./cells";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

interface EditableRowProps extends RowProps {
  columns: EditableColumnConfig[];
  onSave: (rowIndex: number) => Promise<void>;
  onView: (rowIndex: number) => void;
  isSaving: boolean;
  productType: string;
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
    onView,
    isSaving,
    productType,
  }) => {
    const form = Form.useFormInstance<ApplicationLocalForm>();

    // Row border color
    const borderColor = "#f0f0f0";

    // Fixed left positions: checkbox=0, index=40, location=90
    const FIXED_LEFT_POSITIONS: Record<string, number> = {
      checkbox: 0,
      index: 40,
      location: 90,
    };

    const renderCell = (column: EditableColumnConfig) => {
      const { fieldConfig, cellType, key } = column;

      // Checkbox cell
      if (key === "checkbox") {
        return (
          <td
            key={key}
            className="sticky z-10 bg-white px-2 py-2 text-center"
            style={{ left: 0, width: column.width, minWidth: column.width }}
          >
            <Checkbox checked={selected} onChange={onSelect} />
          </td>
        );
      }

      // Index cell
      if (key === "index") {
        return (
          <td
            key={key}
            className="sticky z-10 bg-white px-2 py-2 text-center text-sm text-gray-500"
            style={{ left: FIXED_LEFT_POSITIONS.index, width: column.width, minWidth: column.width }}
          >
            {rowIndex + 1}
          </td>
        );
      }

      // Actions cell
      if (key === "actions") {
        return (
          <td
            key={key}
            className="sticky right-0 z-10 bg-white px-2 py-2 drop-shadow-md"
            style={{ width: column.width, minWidth: column.width }}
          >
            <ActionCell
              rowIndex={rowIndex}
              onSave={onSave}
              onDelete={onRemove}
              onView={onView}
              isSaving={isSaving}
            />
          </td>
        );
      }

      // Check if this column's section allows current product_type
      if (
        column.allowedProductTypes &&
        column.allowedProductTypes.length > 0 &&
        productType &&
        !column.allowedProductTypes.includes(productType)
      ) {
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

      // Handle fixed left columns (like location)
      const isFixedLeft = column.fixed === "left";
      const leftPosition = isFixedLeft ? FIXED_LEFT_POSITIONS[key] : undefined;

      return (
        <td
          key={key}
          className={`px-2 py-2 ${isFixedLeft ? "sticky z-10 bg-white" : ""}`}
          style={{
            width: column.width,
            minWidth: column.width,
            left: leftPosition,
          }}
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
);

EditableRow.displayName = "EditableRow";
