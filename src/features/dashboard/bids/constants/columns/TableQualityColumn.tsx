import { TableAction } from "@/shared/ui";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationAdditionalQuality } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationAdditionalQuality) => void;
  onEdit: (record: ApplicationAdditionalQuality) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationAdditionalQuality>[] => [
  {
    title: t("name"),
    dataIndex: "quality_id",
    render: (quality, record) => {
      // In edit mode, the full object is in record.quality
      if (options.mode === "edit" && record.quality) {
        return record.quality.name;
      }
      // In add mode, quality is the full object
      return quality && quality.name;
    },
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
