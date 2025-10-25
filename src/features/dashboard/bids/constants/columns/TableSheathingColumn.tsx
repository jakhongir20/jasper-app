import { TableAction } from "@/shared/ui";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationSheathing as Sheathing } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: Sheathing) => void;
  onEdit: (record: Sheathing) => void;
  mode?: "add" | "edit";
}): ColumnType<Sheathing>[] => [
  {
    title: t("name"),
    dataIndex: "sheathing_id",
    render: (sheathing, record) => {
      // In edit mode, the full object is in record.sheathing
      if (options.mode === "edit" && record.sheathing) {
        return `${record.sheathing.name} / ${record.sheathing.measure}`;
      }
      // In add mode, sheathing is the full object
      return sheathing && `${sheathing?.name} / ${sheathing?.measure}`;
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
