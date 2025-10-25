import { TableAction } from "@/shared/ui";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationWindowsill } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationWindowsill) => void;
  onEdit: (record: ApplicationWindowsill) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationWindowsill>[] => [
  {
    title: t("name"),
    dataIndex: "windowsill_id",
    render: (windowsill, record) => {
      // In edit mode, the full object is in record.windowsill
      if (options.mode === "edit" && record.windowsill) {
        return `${record.windowsill.name} (${record.windowsill.features})`;
      }
      // In add mode, windowsill is the full object
      return windowsill && `${windowsill.name} (${windowsill.features})`;
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
