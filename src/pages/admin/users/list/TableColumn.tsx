import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { Tag } from "antd";

import { CAuthorCard, Status } from "@/shared/ui";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { User } from "@/features/admin/users";
import { formatDate } from "@/shared/utils/timeFormat";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete: (data: User) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<User>[] => [
    {
      key: "name",
      title: t("common.labels.name"),
      dataIndex: "name",
      shouldCellUpdate: () => true,
      render: (_, record) => {
        return <CAuthorCard key={record?.user_id} title={`${record?.name}`} />;
      },
    },
    {
      key: "username",
      title: t("common.labels.username"),
      dataIndex: "username",
      render: (username) => username || "-",
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
      key: "is_admin",
      title: t("common.labels.admin"),
      dataIndex: "is_admin",
      render: (isAdmin) => {
        return isAdmin ? t("common.labels.yes") : t("common.labels.no");
      },
    },
    {
      key: "is_factory",
      title: t("common.labels.factory"),
      dataIndex: "is_factory",
      render: (isFactory) => {
        return isFactory ? t("common.labels.yes") : t("common.labels.no");
      },
    },
    {
      key: "telegram_user_id",
      title: t("common.labels.telegramUserId"),
      dataIndex: "telegram_user_id",
      render: (telegramId) => telegramId || "-",
    },
    {
      key: "created_at",
      title: t("common.labels.createdAt"),
      dataIndex: "created_at",
      render: (createdAt) => {
        return createdAt ? formatDate(new Date(createdAt * 1000)) : "-";
      },
    },
    ...(options.canDelete || options.canEdit
      ? [
        {
          title: null,
          dataIndex: "action",
          fixed: "right" as const,
          render: (_: unknown, record: User) => {
            return (
              <TableAction
                editLink={{
                  link: `/admin/users/edit/${record?.user_id}`,
                  state: { from: "/admin/users" },
                }}
                showDelete={options.canDelete}
                showEdit={options.canEdit}
                onDelete={() => options.onOpenDelete(record)}
              />
            );
          },
        },
      ]
      : []),
  ];
