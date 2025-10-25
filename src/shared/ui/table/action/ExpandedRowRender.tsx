import { Table as AntDTable, TableProps } from "antd";
import React from "react";

import { isColumnType } from "@/shared/ui/table/action/columnTypeFn";
import { TableExpandIcon } from "@/shared/ui/table/expands/TableExpandIcon";

export const ExpandedRowRender = (
  columns: TableProps<any>["columns"],
  record: any,
  level: number,
  hiddenColumns: string[],
) => {
  const nestedRecords = record?.nestedData || record?.data;

  if (nestedRecords && nestedRecords.length > 0) {
    const hasFurtherNesting = nestedRecords.some(
      (nestedRecord: any) => nestedRecord?.nestedData?.length > 0,
    );

    const nestedFilteredColumns = columns?.filter(
      (column) =>
        isColumnType(column) &&
        (column.dataIndex === "key" ||
          !hiddenColumns.includes(column.dataIndex as string)),
    );

    return (
      <AntDTable
        rootClassName={
          "[&_.ant-spin-container]:!py-1 [&_.ant-table-cell:last-child]:!pr-0 [&_.ant-table-cell:first-child]:border-l [&_.ant-table-cell:last-child]:!border-r [&_.ant-table.ant-table-bordered]:!ml-[32px]"
        }
        key={`nested-${level}-${record.key}`}
        dataSource={nestedRecords}
        pagination={false}
        showHeader={false}
        columns={nestedFilteredColumns || []}
        bordered
        {...(hasFurtherNesting && {
          expandable: {
            expandedRowRender: (nestedRecord: any) =>
              ExpandedRowRender(
                nestedFilteredColumns,
                nestedRecord,
                level + 1,
                hiddenColumns,
              ),
            expandIcon: (props) => TableExpandIcon({ ...props }),
            indentSize: 40,
          },
        })}
      />
    );
  }
  return null;
};
