import { Icon } from "@/shared/ui";
import { CSwitch } from "@/shared/ui/common/CSwitch";
import { Dropdown } from "antd";
import { ColumnType } from "antd/es/table"; // Import the correct type for columns
import { FC } from "react";

interface Props {
  className?: string;
  isColumnType: (column: any) => boolean;
  enhancedColumns: ColumnType<any>[]; // Update the type of enhancedColumns
  onSetHiddenColumns: (hiddenColumns: string[]) => void;
  unhideableColumns?: string[];
  hiddenColumns: string[];
}

export const TableDropdown: FC<Props> = ({
  className,
  isColumnType,
  enhancedColumns,
  onSetHiddenColumns,
  unhideableColumns = [],
  hiddenColumns,
}) => {
  const toggleColumnVisibility = (columnKey: string) => {
    const updatedHiddenColumns = hiddenColumns.includes(columnKey)
      ? hiddenColumns.filter((key) => key !== columnKey)
      : [...hiddenColumns, columnKey];
    onSetHiddenColumns(updatedHiddenColumns);
  };

  // @ts-ignore
  const columnMenuItems = enhancedColumns
    .filter(
      (column) =>
        isColumnType(column) &&
        column.dataIndex !== "key" &&
        column.dataIndex !== "action" &&
        column.dataIndex !== "__rowIndex" && // Exclude row index column
        !unhideableColumns.includes(column.dataIndex as string),
    )
    .map((column) => ({
      key: column.dataIndex as string,
      label: (
        <div
          onClick={(e) => {
            toggleColumnVisibility(column.dataIndex as string);
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`flex h-9 w-full flex-row items-center justify-between gap-4 px-3`}
        >
          <p className={"!select-none truncate text-sm font-medium"}>
            {column.title as React.ReactNode}
          </p>
          <CSwitch
            checked={!hiddenColumns.includes(column.dataIndex as string)}
          />
        </div>
      ),
    }));

  return (
    <Dropdown
      className={className}
      rootClassName={
        "[&_.ant-dropdown-menu]:p-0 [&_.ant-dropdown-menu-item]:rounded-none [&_.ant-dropdown-menu-item]:!p-0 [&_.ant-dropdown-menu-item]:!rounded-none [&_.ant-dropdown-menu-item]:!border-b [&_.ant-dropdown-menu-item]:!border-gray-800 [&_.ant-dropdown-menu-item:last-child]:!border-none"
      }
      getPopupContainer={(trigger) => trigger.parentNode}
      menu={{ items: columnMenuItems }}
      trigger={["click"]}
    >
      <div
        className={`group absolute bg-transparent right-4 z-10 mt-[1px] flex size-8 h-[33.5px] min-w-10 max-w-10 cursor-pointer select-none items-center justify-center transition-all duration-300`}
      >
        <Icon
          icon={"setting"}
          color={
            "text-black  group-hover:text-primary transition-all duration-300 m-0 p-0 block"
          }
        />
      </div>
    </Dropdown>
  );
};
