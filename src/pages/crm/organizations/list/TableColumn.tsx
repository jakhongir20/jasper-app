import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { Organization } from "@/features/crm/organizations/model/organization.types";
import { TableAction } from "@/shared/ui/table/action/TableAction";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: Organization) => void;
    onOpenEdit?: (data: Organization) => void;
    canEdit?: boolean;
    canDelete?: boolean;
  },
): ColumnType<Organization>[] => [
  {
    key: "code",
    title: t("common.labels.code"),
    dataIndex: "code",
    render: (code) => code || "-",
  },
  {
    key: "title",
    title: t("common.labels.title"),
    dataIndex: "title",
    render: (title) => title || "-",
  },
  {
    key: "status",
    title: t("common.labels.status"),
    dataIndex: "status",
    render: (status) => status || "-",
  },
  ...(options.canDelete || options.canEdit
    ? [
        {
          title: null,
          dataIndex: "action",
          fixed: "right" as const,
          width: 100,
          render: (_: unknown, record: Organization) => {
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

