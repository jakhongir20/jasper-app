import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { CustomerOutputEntity } from "@/shared/lib/api";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Tag } from "antd";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: CustomerOutputEntity) => void;
    onOpenEdit?: (data: CustomerOutputEntity) => void;
    canEdit?: boolean;
    canDelete?: boolean;
  },
): ColumnType<CustomerOutputEntity>[] => [
  {
    key: "customer_id",
    title: t("common.labels.id"),
    dataIndex: "customer_id",
    render: (id) => `#${id}`,
    width: 100,
  },
  {
    key: "name",
    title: t("common.labels.name"),
    dataIndex: "name",
    render: (name) => name || "-",
  },
  {
    key: "phone",
    title: t("common.labels.phone"),
    dataIndex: "phone_number",
    render: (phone) => phone || "-",
  },
  {
    key: "is_active",
    title: t("common.labels.status"),
    dataIndex: "is_active",
    render: (isActive: boolean) => (
      <Tag color={isActive ? "green" : "red"}>
        {isActive ? t("common.status.active") : t("common.status.inactive")}
      </Tag>
    ),
    width: 120,
  },
  {
    key: "is_deleted",
    title: "Статус у/д",
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
          width: 100,
          render: (_: unknown, record: CustomerOutputEntity) => {
            return (
              <TableAction
                showDelete={options.canDelete}
                showEdit={options.canEdit}
                onDelete={
                  options.onOpenDelete
                    ? () => options.onOpenDelete!(record)
                    : undefined
                }
                onEdit={
                  options.onOpenEdit
                    ? () => options.onOpenEdit(record)
                    : undefined
                }
              />
            );
          },
        },
      ]
    : []),
];
