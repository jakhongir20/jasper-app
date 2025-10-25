import type { TFunction } from "i18next";
import {
  CAuthorCard,
  CPaidRemainder,
  CPrice,
  Radio,
  Status,
} from "@/shared/ui";
import type { ColumnType } from "antd/es/table";
import type {
  Product,
  PurchaseWithoutDeliveryList,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { formatDate } from "@/shared/utils";
import type { RadioChangeEvent } from "antd";

export const PWDTableColumns = (
  t: TFunction<"translation", undefined>,
  selectedId: number | null,
  handleSelectedValue: (e: RadioChangeEvent) => void,
): ColumnType<PurchaseWithoutDeliveryList>[] => [
  {
    title: "-/-",
    dataIndex: "",
    width: 60,
    className: "text-center",
    render: (record: Product) => (
      <div className="flex-center gap-2">
        <Radio
          className="ml-1"
          name="pwd"
          value={record.id}
          checked={selectedId == record.id}
          onChange={handleSelectedValue}
        />
      </div>
    ),
  },
  {
    title: t("common.table.codePurchaseDate"),
    dataIndex: "code",
    fixed: "left",
  },
  {
    title: t("common.table.batch"),
    dataIndex: "batch",
  },
  {
    title: t("common.table.organization"),
    dataIndex: "organization",
    render: (_, record) => {
      return (
        <div>
          <CAuthorCard
            key={record.organization?.photo}
            title={record.organization?.title}
            imgUrl={record.organization?.photo}
          />
        </div>
      );
    },
  },
  {
    title: t("common.table.partner"),
    dataIndex: "partner",
    render: (_, record) => {
      return (
        <div>
          <CAuthorCard
            key={record.partner?.photo}
            title={record.partner?.title}
            imgUrl={record.partner?.photo}
          />
        </div>
      );
    },
  },
  {
    title: t("common.table.status"),
    dataIndex: "status",
    render: (status: number) => {
      return <Status value={status} />;
    },
  },
  {
    title: t("common.table.total"),
    dataIndex: "",
    render: (data) => {
      let subValue = 0;
      if (Number(data?.discountAmont) > 0) {
        subValue = Number(data?.totalAmount) + Number(data?.discountAmont);
      }
      return <CPrice value={data?.totalAmount} subValue={subValue} />;
    },
  },
  {
    title: t("common.table.closedRemaining"),
    dataIndex: "",
    render: (data) => {
      return (
        <CPaidRemainder
          startValue={data?.openAmount}
          endValue={data?.closedAmount}
        />
      );
    },
    className: "!py-0 overflow-hidden",
  },
  {
    title: t("common.table.creator"),
    dataIndex: "recorder",
    fixed: "right",
    render: (data) => {
      return (
        <>
          {data ? (
            <CAuthorCard
              title={`${data?.first_name} ${data?.last_name}`}
              imgUrl={data?.photo}
            />
          ) : (
            "-"
          )}
        </>
      );
    },
  },
  {
    key: "registrationDate",
    dataIndex: "registrationDate",
    title: t("common.table.dateAdded"),
    width: 150,
    render: (date) => (date ? formatDate(date, "DD.MM.YYYY (hh:mm)") : "-"),
  },
];
