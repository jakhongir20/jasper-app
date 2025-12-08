import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { FactoryStatus } from "@/features/admin/factory-statuses";

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
