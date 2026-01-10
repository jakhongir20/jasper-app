import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Branch } from "@/features/admin/branches";
import dayjs from "dayjs";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: Branch) => void;
    onOpenEdit: (data: Branch) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<Branch>[] => [
  {
    key: "name",
    title: t("common.labels.name"),
    dataIndex: "name",
    render: (name) => name || "-",
  },
  {
    key: "branch_phone_number",
    title: t("common.labels.phone"),
    dataIndex: "branch_phone_number",
    width: 180,
    render: (phone) => phone || "-",
  },
  {
    key: "company",
    title: t("common.labels.company"),
    dataIndex: "company",
    width: 200,
    render: (company) => company?.name || "-",
  },
  {
    key: "created_at",
    title: t("common.input.createdAt"),
    dataIndex: "created_at",
    width: 150,
    render: (timestamp) =>
      timestamp ? dayjs.unix(timestamp).format("DD.MM.YYYY") : "-",
  },
  ...(options.canDelete || options.canEdit
    ? [
        {
          title: null,
          dataIndex: "action",
          fixed: "right" as const,
          render: (_: unknown, record: Branch) => {
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
