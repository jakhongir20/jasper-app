import { memo } from "react";
import { Checkbox } from "antd";
import type { EditableColumnConfig } from "./types";

interface TableHeaderProps {
  columns: EditableColumnConfig[];
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: () => void;
}

export const TableHeader = memo<TableHeaderProps>(
  ({ columns, allSelected, someSelected, onSelectAll }) => {
    // Header styles
    const headerBg = "#F8F9FA";
    const headerTextColor = "#A4AAB0";
    const borderColor = "#f0f0f0";

    // Fixed left positions: checkbox=0, index=40, location=90
    const FIXED_LEFT_POSITIONS: Record<string, number> = {
      checkbox: 0,
      index: 40,
      location: 90,
    };

    return (
      <tr
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        {columns.map((column) => {
          // Render checkbox header
          if (column.key === "checkbox") {
            return (
              <th
                key={column.key}
                className="sticky z-10 px-2 py-3 text-center"
                style={{
                  left: 0,
                  width: column.width,
                  minWidth: column.width,
                  backgroundColor: headerBg,
                }}
              >
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={onSelectAll}
                />
              </th>
            );
          }

          // Render index header
          if (column.key === "index") {
            return (
              <th
                key={column.key}
                className="sticky z-10 px-2 py-3 text-center text-xs font-medium"
                style={{
                  left: FIXED_LEFT_POSITIONS.index,
                  width: column.width,
                  minWidth: column.width,
                  backgroundColor: headerBg,
                  color: headerTextColor,
                }}
              >
                {column.title}
              </th>
            );
          }

          // Render actions header (empty)
          if (column.key === "actions") {
            return (
              <th
                key={column.key}
                className="sticky right-0 z-10 px-2 py-3"
                style={{
                  width: column.width,
                  minWidth: column.width,
                  backgroundColor: headerBg,
                }}
              />
            );
          }

          // Handle fixed left columns (like location)
          const isFixedLeft = column.fixed === "left";
          const leftPosition = isFixedLeft ? FIXED_LEFT_POSITIONS[column.key] : undefined;

          // Regular column header
          return (
            <th
              key={column.key}
              className={`whitespace-nowrap px-3 py-3 text-left text-xs font-medium ${isFixedLeft ? "sticky z-10" : ""}`}
              style={{
                width: column.width,
                minWidth: column.width,
                color: headerTextColor,
                backgroundColor: isFixedLeft ? headerBg : undefined,
                left: leftPosition,
              }}
            >
              {column.title}
            </th>
          );
        })}
      </tr>
    );
  },
);

TableHeader.displayName = "TableHeader";
