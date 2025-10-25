import { Table as AntDTable, TableProps } from "antd";
import { type ColumnType } from "antd/es/table";
import type { Key, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Pagination } from "@/shared/ui/pagination/Pagination";
import { isColumnType } from "@/shared/ui/table/action/columnTypeFn";
import { TableDropdown } from "@/shared/ui/table/action/TableDropdown";
import { TableExpandIcon } from "@/shared/ui/table/expands/TableExpandIcon";
import { useTableStyle } from "@/shared/ui/table/style/TableStyle";
import ShimmerLoader from "@/shared/ui/table/TableShimmerLoader";

import { ExpandedRowRender } from "./action/ExpandedRowRender";
import { getRandomId } from "@/shared/utils";

type PaginationType = {
  total: number;
  page: number;
  limit: number;
};

export interface ReusableTableProps<T> extends TableProps<T> {
  data: T[];
  columns: ColumnType<T>[];
  initialPageSize?: number;
  initialCurrentPage?: number;
  pagination: PaginationType | false;
  children?: ReactNode;
  showDropdown?: boolean;
  unhideableColumns?: string[];
  clickableColumns?: string[]; // Add this prop
  filters?: (string | string[])[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  loaderRows?: number;
  loaderColumns?: number;
  showFilter?: boolean;
  highlightSelectedRow?: boolean;
  defaultSelectedRecordId?: React.Key; // Add this prop
  effectedRow?: (row: T) => boolean; // Add this prop
  expandedRowClassName?: string;
  showRowIndex?: boolean;
}

export interface RecordType {
  [key: string]: string | number | object | RecordType | unknown;
}

export const Table = <T extends object>({
  data,
  columns,
  initialPageSize = 10,
  pagination,
  children,
  loading,
  showDropdown = true,
  unhideableColumns = [],
  loaderColumns = columns?.length || 6,
  clickableColumns = [], // Provide a default value
  filters = [], // Provide a default value
  onRowClick,
  showRowIndex = true, // Prop to show or hide row indices
  showFilter = false,
  defaultSelectedRecordId,
  highlightSelectedRow = false,
  effectedRow, // Add this prop
  expandedRowClassName,
  ...rest
}: ReusableTableProps<T>) => {
  const { styles } = useTableStyle();

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("query") || undefined;
  const [selectedRowKey, setSelectedRowKey] = useState<Key | null>(null); // State to manage selected row key

  // Ensure data is always an array with additional safety checks
  const safeData = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    return [];
  }, [data]);

  // Add error boundary for unexpected data types
  if (!Array.isArray(data) && data !== undefined && data !== null) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error: Invalid data format received</p>
        <p className="text-sm">Expected array, got: {typeof data}</p>
      </div>
    );
  }

  useEffect(() => {
    if (defaultSelectedRecordId !== undefined) {
      setSelectedRowKey(defaultSelectedRecordId);
    }
  }, [defaultSelectedRecordId]);

  const hasFurtherNesting = safeData.some(
    (record: any) => record?.nestedData?.length > 0,
  );

  const enhancedColumns: ColumnType<T>[] = showRowIndex
    ? [
        {
          title: "№",
          dataIndex: "__rowIndex",
          key: "__rowIndex",
          align: "center",
          width: 50,
          render: (_: any, __: any, index: number) =>
            pagination
              ? (pagination?.page - 1) * pagination?.limit + index + 1 || 0
              : index + 1,
        },
        ...(columns || []),
      ]
    : columns;

  const filteredColumns = enhancedColumns?.filter(
    (column) =>
      isColumnType(column) &&
      (column.dataIndex === "key" ||
        !hiddenColumns.includes(column.dataIndex as string)),
  );

  const hasEffectedRow = effectedRow ? safeData.some(effectedRow) : false;

  function getDataIndexKey(dataIndex: string | string[]): string {
    if (Array.isArray(dataIndex)) {
      return dataIndex.join("."); // or use any delimiter you prefer
    }
    return dataIndex;
  }

  const limitParam = searchParams.get("limit");
  const pageParam = searchParams.get("page");

  const pageSize = useMemo(
    () => (limitParam ? parseInt(limitParam, 10) : initialPageSize),
    [limitParam, initialPageSize],
  );

  const currentPage = useMemo(
    () => (pageParam ? parseInt(pageParam, 10) : 1),
    [pageParam],
  );

  const fallbackRender = (value: any) => {
    return value === null || value === undefined || value === "" ? "—" : value;
  };

  return (
    <>
      {children &&
        (safeData.length > 0 ||
          search ||
          filters?.some((filter) => searchParams.get(filter?.toString()))) && (
          <div className="flex items-start justify-between !py-3">
            {children}
          </div>
        )}

      {loading ? (
        <ShimmerLoader rows={pageSize} columns={loaderColumns} />
      ) : (
        !loading &&
        safeData.length > 0 && (
          <>
            {showDropdown && (
              <TableDropdown
                isColumnType={isColumnType}
                enhancedColumns={enhancedColumns}
                unhideableColumns={unhideableColumns}
                hiddenColumns={hiddenColumns}
                onSetHiddenColumns={setHiddenColumns}
              />
            )}

            <AntDTable<T>
              bordered
              rowClassName={(record) => {
                if (effectedRow && effectedRow(record)) {
                  return "[&>*]:!bg-[#FFE8EA]";
                }

                return selectedRowKey === record.key && highlightSelectedRow
                  ? "[&>*]:bg-violet/10"
                  : hasEffectedRow
                    ? "[&>*]:opacity-50"
                    : "";
              }}
              scroll={{ x: "max-content" }}
              className={`${styles.customTable} overflow-hidden rounded-md border border-neutral-200`}
              dataSource={safeData.map((item) => ({
                ...item,
                key: item?.id || item?._uid || getRandomId(),
              }))}
              columns={filteredColumns?.map((col) => {
                if (col.dataIndex === "action")
                  return {
                    ...col,
                    width: 40,
                  };

                const dataIndexKey = getDataIndexKey(col.dataIndex as string);

                return {
                  ...col,
                  render: col.render || fallbackRender,
                  key: dataIndexKey as string,
                  onCell: (record) => ({
                    onClick: (e) => {
                      if (record?.key || record?.key === 0) {
                        setSelectedRowKey(record?.key);
                      }

                      // Check if the clicked element is in the actions column
                      const isActionColumn = dataIndexKey === "action";

                      // If it's not the action column and onRowClick is provided, call it
                      if (!isActionColumn && onRowClick) {
                        onRowClick({
                          ...record,
                          col: dataIndexKey,
                        });
                      }
                    },
                  }),

                  className:
                    dataIndexKey === "action"
                      ? `${col?.className} hover:!bg-violet-300 hover:!text-primary [&_.base-icon]:hover:!text-violet`
                      : onRowClick
                        ? `${col?.className} cursor-pointer hover:!bg-gray-100`
                        : col?.className,
                };
              })}
              pagination={false}
              {...(hasFurtherNesting && {
                expandable: {
                  expandedRowClassName,
                  expandedRowRender: (record) =>
                    ExpandedRowRender(
                      filteredColumns,
                      record,
                      1,
                      hiddenColumns,
                    ),
                  defaultExpandedRowKeys: ["0"],
                  expandIcon: (props) => TableExpandIcon({ ...props }),
                },
              })}
              {...rest}
            />

            {hasEffectedRow || !pagination ? null : (
              <Pagination
                currentPage={currentPage}
                limit={pageSize}
                total={pagination.total}
              />
            )}
          </>
        )
      )}
    </>
  );
};
