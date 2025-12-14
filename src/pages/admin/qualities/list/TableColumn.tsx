import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Quality } from "@/features/admin/qualities";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: Quality) => void;
    onOpenEdit: (data: Quality) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<Quality>[] => [
  {
    key: "name",
    title: t("common.labels.name"),
    dataIndex: "name",
    render: (name) => name || "-",
  },
  {
    key: "price_multiplier",
    title: t("common.labels.priceMultiplier"),
    dataIndex: "price_multiplier",
    render: (value) => value ?? "-",
  },
  // {
  //   key: "company_display_name",
  //   title: t("common.labels.companyDisplayName"),
  //   dataIndex: ["company", "display_name"],
  //   render: (value) => value || "-",
  // },
  // {
  //   key: "company_legal_name",
  //   title: t("common.labels.companyLegalName"),
  //   dataIndex: ["company", "legal_name"],
  //   render: (value) => value || "-",
  // },
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
          render: (_: unknown, record: Quality) => {
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
