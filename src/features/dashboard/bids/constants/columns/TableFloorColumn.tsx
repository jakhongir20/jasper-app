import { TableAction } from "@/shared/ui";
import React from "react";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationFloor } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationFloor) => void;
  onEdit: (record: ApplicationFloor) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationFloor>[] => [
  {
    title: t("name"),
    dataIndex: "floor_id",
    render: (floor, record) => {
      // In edit mode, the full object is in record.floor
      if (options.mode === "edit" && record.floor) {
        return `${record.floor.name} / ${record.floor.features}`;
      }
      // In add mode, floor is the full object
      return floor && `${floor?.name} / ${floor?.features}`;
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
