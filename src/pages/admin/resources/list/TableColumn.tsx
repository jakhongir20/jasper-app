import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Resource, RESOURCE_TYPES } from "@/features/admin/resources";
import { formatPrice } from "@/shared/helpers";
import dayjs from "dayjs";

const getResourceTypeLabel = (type: string | undefined) => {
  const found = RESOURCE_TYPES.find((t) => t.value === type);
  return found?.label || type || "-";
};

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: Resource) => void;
    onOpenEdit: (data: Resource) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<Resource>[] => [
  {
    key: "name",
    title: t("common.labels.name"),
    dataIndex: "name",
    render: (name) => name || "-",
  },
  {
    key: "resource_type",
    title: t("common.labels.resourceType"),
    dataIndex: "resource_type",
    width: 150,
    render: (type) => getResourceTypeLabel(type),
  },
  {
    key: "measurement_unit",
    title: t("common.labels.measurementUnit"),
    dataIndex: "measurement_unit",
    width: 120,
    render: (unit) => unit || "-",
  },
  {
    key: "price_usd",
    title: t("common.input.priceUSD"),
    dataIndex: "price_usd",
    width: 150,
    render: (price) => (price != null ? `$${formatPrice(price)}` : "-"),
  },
  {
    key: "price_uzs",
    title: t("common.input.priceUZS"),
    dataIndex: "price_uzs",
    width: 150,
    render: (price) => (price != null ? `${formatPrice(price)} сум` : "-"),
  },
  {
    key: "created_at",
    title: t("common.input.createdAt"),
    dataIndex: "created_at",
    width: 150,
    render: (timestamp) =>
      timestamp ? dayjs.unix(timestamp).format("DD.MM.YYYY") : "-",
  },
  {
    key: "is_deleted",
    title: t("common.labels.status"),
    dataIndex: "is_deleted",
    width: 120,
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
          render: (_: unknown, record: Resource) => {
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
