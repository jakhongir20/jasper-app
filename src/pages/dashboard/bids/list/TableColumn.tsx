import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { CDate, TableAction } from "@/shared/ui";
import { BaseRecord } from "@/shared/types";
import { ApplicationListItem } from "@/features/dashboard/bids";
import { formatMoneyDecimal } from "@/shared/utils";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete: (data: ApplicationListItem) => void;
    canEdit: boolean;
    canDelete: boolean;
  },
): ColumnType<ApplicationListItem>[] => [
    {
      key: "number",
      title: t("common.table.number"),
      dataIndex: "number",
    },

    {
      key: "customer_name",
      title: t("common.table.customer"),
      dataIndex: "customer_name",
      render: (data: string) => data || "-",
    },
    {
      key: "customer_phone",
      title: t("common.table.customer_number"),
      dataIndex: "customer_phone",
      render: (data: string) => data || "-",
    },
    {
      key: "dealer",
      title: t("common.table.dealer"),
      dataIndex: ["author", "name"],
    },
    {
      key: "forecast_sum",
      title: t("common.table.forecastSum"),
      dataIndex: "forecast_sum",
      render: (data: number) => {
        return formatMoneyDecimal(data, 0);
      },
    },
    {
      key: "created_at",
      title: t("common.table.date"),
      dataIndex: "created_at",
      render: (data: string) => {
        // Convert Unix timestamp to proper date format
        const timestamp = parseInt(data);
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        return <CDate value={date} subValue={date} />;
      },
    },
    {
      title: null,
      dataIndex: "action",
      fixed: "right" as const,
      render: (_, record) => {
        return (
          <TableAction
            editLink={{
              link: `edit/${record?.application_id}`,
              state: { from: "/dashboard/bids" },
            }}
            showDelete={options.canDelete}
            showEdit={options.canEdit}
            onDelete={() => options.onOpenDelete(record)}
          />
        );
      },
    },
  ];
