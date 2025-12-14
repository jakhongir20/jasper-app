import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import React from "react";

import { Product } from "@/features/admin/products";
import { CAuthorCard } from "@/shared/ui";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { formatMoneyDecimal } from "@/shared/utils/utils";
import { PRODUCT_TYPES } from "@/features/dashboard/bids/crud/tabs/TransactionForm";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete: (data: Product) => void;
    canEdit?: boolean;
    canDelete?: boolean;
  },
): ColumnType<Product>[] => [
  {
    key: "product_id",
    title: t("common.table.id"),
    dataIndex: "product_id",
  },
  {
    key: "name",
    title: t("common.table.name"),
    dataIndex: "name",
    shouldCellUpdate: () => true,
    render: (_, record) => {
      return (
        <CAuthorCard
          key={record?.product_id}
          title={`${record?.name}`}
          imgUrl=""
        />
      );
    },
  },
  {
    key: "product_type",
    title: t("common.table.type"),
    dataIndex: "product_type",
    render: (data) =>
      PRODUCT_TYPES.find((type) => type.value === data)?.label || "-",
  },
  {
    key: "price_uzs",
    title: t("common.table.priceUZS"),
    dataIndex: "price_uzs",
    render: (data) => `${formatMoneyDecimal(data, 0, "UZS")} UZS`,
  },
  {
    key: "price_usd",
    title: t("common.table.priceUSD"),
    dataIndex: "price_usd",
    render: (data) => `${formatMoneyDecimal(data, 0, "USD")} USD`,
  },
  {
    key: "measure",
    title: t("common.table.measure"),
    dataIndex: "measurement_unit",
  },
  {
    key: "category",
    title: t("common.table.category"),
    dataIndex: "category",
    render: (data) => data?.name || "-",
  },
  ...(options.canDelete || options.canEdit
    ? [
        {
          title: null,
          dataIndex: "action",
          width: 40,
          fixed: "right" as const,
          render: (_: unknown, record: Product) => {
            return (
              <TableAction
                editLink={{
                  link: `/admin/products/edit/${record?.product_id}`,
                  state: { from: "/admin/products" },
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
