import { TableAction } from "@/shared/ui";
import React from "react";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationFramework } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationFramework) => void;
  onEdit: (record: ApplicationFramework) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationFramework>[] => [
  {
    title: t("name"),
    dataIndex: "framework_id",
    render: (framework, record) => {
      // In edit mode, the full object is in record.framework
      if (options.mode === "edit" && record.framework) {
        return `${record.framework.name} / ${record.framework.features}`;
      }
      // In add mode, framework is the full object
      return framework && `${framework?.name} / ${framework?.features}`;
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
