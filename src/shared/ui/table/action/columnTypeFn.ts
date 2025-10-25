import type { ColumnGroupType, ColumnType } from "antd/es/table";

export const isColumnType = <T>(
  column: ColumnGroupType<T> | ColumnType<T>,
): column is ColumnType<T> => {
  return (column as ColumnType<T>).dataIndex !== undefined;
};
