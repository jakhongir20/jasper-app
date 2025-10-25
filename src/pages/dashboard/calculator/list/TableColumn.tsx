import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import React from "react";

import { Organization } from "@/features/crm/organizations/model/organization.types";
import { CAuthorCard, CDate, Status } from "@/shared/ui";
import { TableAction } from "@/shared/ui/table/action/TableAction";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete: (data: Organization) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<Organization>[] => [
  {
    key: 2,
    title: t("common.table.code"),
    dataIndex: "code",
  },
  {
    key: 3,
    title: t("common.table.title"),
    dataIndex: "title",
    shouldCellUpdate: () => true,
    render: (_, record) => {
      return (
        <CAuthorCard
          key={record?.photo}
          title={`${record?.title}`}
          imgUrl={record?.photo || ""}
        />
      );
    },
  },
  {
    key: 5,
    title: t("common.table.group"),
    dataIndex: "group",
    render: (data) => data?.title || "-",
  },
  {
    key: 7,
    title: t("common.table.status"),
    dataIndex: "status",
    render: (data) => {
      return <Status value={data} />;
    },
  },
  {
    key: 8,
    title: t("common.table.creator"),
    dataIndex: "recorder",
    render: (data) => {
      return (
        <CAuthorCard
          link={`/crm/staff/${data?.guid}`}
          title={`${data?.first_name} ${data?.last_name}`}
          imgUrl={data?.photo}
        />
      );
    },
  },
  {
    key: "registrationDate",
    dataIndex: "registrationDate",
    title: t("common.table.created"),
    render: (data) => {
      return <CDate value={data} subValue={data} />;
    },
    className: "!py-0",
  },
  ...(options.canDelete || options.canEdit
    ? [
        {
          title: null,
          dataIndex: "action",
          width: 40,
          fixed: "right" as const,
          render: (_: unknown, record: Organization) => {
            return (
              <TableAction
                editLink={{
                  link: `/crm/organizations/edit/${record?.guid}`,
                  state: { from: "/crm/organizations" },
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
