import { TableAction } from "@/shared/ui";
import React from "react";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationDecoration } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationDecoration) => void;
  onEdit: (record: ApplicationDecoration) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationDecoration>[] => [
  {
    title: t("name"),
    dataIndex: "decoration_id",
    render: (decoration, record) => {
      // In edit mode, the full object is in record.decoration
      if (options.mode === "edit" && record.decoration) {
        return record.decoration.name;
      }
      // In add mode, decoration is the full object
      return decoration && decoration?.name;
    },
  },
  {
    title: t("quantity"),
    dataIndex: "quantity",
  },
  {
    title: null,
    dataIndex: "action",
    fixed: "right",
    render: (_, record) => {
      return (
        <TableAction
          showDelete
          onDelete={() => options.onDelete(record)}
          onEdit={() => options.onEdit(record)}
        />
      );
    },
  },
];
