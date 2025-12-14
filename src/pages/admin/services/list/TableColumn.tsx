import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Service } from "@/features/admin/services";
import { formatPrice } from "@/shared/helpers";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: Service) => void;
    onOpenEdit: (data: Service) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<Service>[] => [
  {
    key: "name",
    title: t("common.labels.name"),
    dataIndex: "name",
    render: (name) => name || "-",
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
    key: "is_deleted",
    title: "Статус",
    dataIndex: "is_deleted",
    width: 150,
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
          render: (_: unknown, record: Service) => {
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
