import { TableAction } from "@/shared/ui";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { ApplicationService } from "@/features/dashboard/bids/model";

const t = i18n.t;

export const columns = (options: {
  onDelete: (record: ApplicationService) => void;
  onEdit: (record: ApplicationService) => void;
  mode?: "add" | "edit";
}): ColumnType<ApplicationService>[] => [
  {
    title: t("name"),
    dataIndex: "service_id",
    render: (service, record) => {
      // Case 1: In edit mode, the full object is in record.service
      if (options.mode === "edit" && record.service) {
        return record.service.name || "-";
      }
      // Case 2: In add mode, service is the full object
      if (service?.name) {
        return service.name;
      }
      // Case 3: Direct API response with name already included
      if (record.name) {
        return record.name;
      }
      // Fallback
      return "-";
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
