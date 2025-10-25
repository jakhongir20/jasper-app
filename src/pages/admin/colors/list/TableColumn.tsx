import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Color } from "@/features/admin/colors";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: Color) => void;
    onOpenEdit: (data: Color) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<Color>[] => [
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
          render: (_: unknown, record: Color) => {
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
