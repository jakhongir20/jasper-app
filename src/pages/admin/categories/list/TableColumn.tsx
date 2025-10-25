import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { Category } from "@/features/admin/categories";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Tag } from "antd";
import { formatDate } from "@/shared/utils/timeFormat";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete?: (data: Category) => void;
    onOpenEdit?: (data: Category) => void;
    canEdit?: boolean;
    canDelete?: boolean;
  },
): ColumnType<Category>[] => [
    {
      key: "name",
      title: t("common.labels.name"),
      dataIndex: "name",
      render: (name) => name || "-",
    },
    {
      key: "section",
      title: t("common.labels.section"),
      dataIndex: "section",
      render: (section) => `#${section}`,
      width: 150,
    },
    {
      key: "created_at",
      title: t("common.labels.createdAt"),
      dataIndex: "created_at",
      render: (createdAt) => {
        return createdAt ? formatDate(new Date(createdAt * 1000)) : "-";
      },
      width: 150,
    },
    ...(options.canDelete || options.canEdit
      ? [
        {
          title: null,
          dataIndex: "action",
          fixed: "right" as const,
          width: 100,
          render: (_: unknown, record: Category) => {
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