import { TableAction } from "@/shared/ui";
import React from "react";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationLatting } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationLatting) => void;
  onEdit: (record: ApplicationLatting) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationLatting>[] => [
  {
    title: t("name"),
    dataIndex: "latting_id",
    render: (latting, record) => {
      // In edit mode, the full object is in record.latting
      if (options.mode === "edit" && record.latting) {
        return `${record.latting.name} / ${record.latting.features}`;
      }
      // In add mode, latting is the full object
      return latting && `${latting?.name} / ${latting?.features}`;
    },
  },
  {
    title: t("height"),
    dataIndex: "height",
  },
  {
    title: t("width"),
    dataIndex: "width",
  },
  {
    title: t("quantity"),
    dataIndex: "quantity",
  },
  {
    title: t("style"),
    dataIndex: "style",
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
