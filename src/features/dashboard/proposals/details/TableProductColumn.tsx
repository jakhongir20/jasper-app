import { TFunction } from "i18next";
import { CDate, CTax } from "@/shared/ui";
import React from "react";
import type { ColumnType } from "antd/es/table";
import { formattedPrice } from "@/shared/helpers";
import { CellWithBg } from "@/shared/ui/cellWithBg/CellWithBg";
import { Taxes } from "@/shared/types";
import { PurchaseWithoutDeliveryList } from "@/features/purchase/no-ship/model/no-shipment.types";

export const columns = (
  t: TFunction<"translation", undefined>,
): ColumnType<PurchaseWithoutDeliveryList>[] => [
  {
    title: t("common.table.productName"),
    dataIndex: "product",
    fixed: "left",
    render: (data) => {
      return <span>{data?.title ?? "-"}</span>;
    },
  },
  {
    title: t("common.table.measurement"),
    dataIndex: "measurement_unit",
    render: (data) => {
      return <span>{data ?? "-"}</span>;
    },
  },
  {
    title: t("common.table.addedDate"),
    dataIndex: "registrationDate",
    render: (data) => {
      return <CDate oneline value={data} subValue={data} />;
    },
  },
  {
    title: t("common.table.quantity"),
    dataIndex: "quantity",
    render: (value: string) => <span>{formattedPrice(value)}</span>,
  },
  {
    title: t("common.table.pricePerPiece"),
    dataIndex: "unitPrice",
    render: (unitPrice, record) => (
      <CellWithBg>
        {formattedPrice(unitPrice)} {record?.currency?.code}
      </CellWithBg>
    ),
  },
  {
    title: t("common.table.taxRate"),
    dataIndex: "taxes",
    render: (taxes: Taxes[]) => {
      return (
        <>
          {taxes?.map((tax: Taxes) => (
            <CTax key={tax.id}>{Number(tax.percent).toFixed(0)}%</CTax>
          ))}
        </>
      );
    },
  },
  {
    title: t("common.table.taxPrice"),
    dataIndex: "",
    render: (_, record) => (
      <CellWithBg>
        {record?.taxAmount ? formattedPrice(record?.taxAmount) : ""}{" "}
        {record?.currency?.code}
      </CellWithBg>
    ),
  },
];
