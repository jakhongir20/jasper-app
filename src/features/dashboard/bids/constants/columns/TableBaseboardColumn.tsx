import { TableAction } from "@/shared/ui";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationBaseboard } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationBaseboard) => void;
  onEdit: (record: ApplicationBaseboard) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationBaseboard>[] => [
  {
    title: t("name"),
    dataIndex: "baseboard_id",
    render: (baseboard, record) => {
      // In edit mode, the full object is in record.baseboard
      if (options.mode === "edit" && record.baseboard) {
        return `${record.baseboard.name} / ${record.baseboard.features}`;
      }
      // In add mode, baseboard is the full object
      return baseboard && `${baseboard?.name} / ${baseboard?.features}`;
    },
  },
  {
    title: t("height"),
    dataIndex: "length",
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
