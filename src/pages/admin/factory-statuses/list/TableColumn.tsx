import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { FactoryStatus } from "@/features/admin/factory-statuses";
import { Tag } from "antd";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: FactoryStatus) => void;
    onOpenEdit: (data: FactoryStatus) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<FactoryStatus>[] => [
  {
    key: "name",
    title: t("common.labels.name"),
    dataIndex: "name",
    render: (name) => name || "-",
  },
  {
    key: "status_index",
    title: t("common.labels.statusIndex"),
    dataIndex: "status_index",
    width: 120,
    render: (value) => value ?? "-",
  },
  {
    key: "status_order",
    title: t("common.labels.statusOrder"),
    dataIndex: "status_order",
    width: 120,
    render: (value) => value ?? "-",
  },
  {
    key: "is_initial_status",
    title: t("common.labels.isInitialStatus"),
    dataIndex: "is_initial_status",
    width: 150,
    render: (value) => (
      <Tag color={value ? "green" : "default"}>
        {value ? t("common.labels.yes") : t("common.labels.no")}
      </Tag>
    ),
  },
  {
    key: "is_final_status",
    title: t("common.labels.isFinalStatus"),
    dataIndex: "is_final_status",
    width: 150,
    render: (value) => (
      <Tag color={value ? "blue" : "default"}>
        {value ? t("common.labels.yes") : t("common.labels.no")}
      </Tag>
    ),
  },
  {
    key: "is_deleted",
    title: "Статус",
    dataIndex: "is_deleted",
    width: 100,
    render: (value) =>
      value ? (
        <span className={"text-red-200"}>Удалено</span>
      ) : (
        <span className={"text-green-400"}>Актив</span>
      ),
  },

  ...(options.canDelete || options.canEdit
    ? [
        {
          title: null,
          dataIndex: "action",
          fixed: "right" as const,
          render: (_: unknown, record: FactoryStatus) => {
            return (
              <TableAction
                showDelete={options.canDelete}
                showEdit={options.canEdit}
                onDelete={
                  options.onOpenDelete
                    ? () => options.onOpenDelete!(record)
                    : undefined
                }
                onEdit={() => options.onOpenEdit(record)}
              />
            );
          },
        },
      ]
    : []),
];
