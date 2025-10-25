import { type FC, useMemo } from "react";
import { Form, FormInstance } from "antd";
import { CInfoBadge } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type {
  Product,
  PurchaseDocument,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { formatMoneyDecimal } from "@/shared/utils";

type Props = {
  form: FormInstance;
};

export const AmountDetails: FC<Props> = ({ form }) => {
  const { t } = useTranslation();

  const products = Form.useWatch("products", form);
  const cargo = Form.useWatch("cargo", form);

  const getTotalAmount = (
    products: Product[],
    filteredCargo: PurchaseDocument[],
  ) => {
    let total = products?.reduce(
      (acc: any, product: any) => Number(acc) + Number(product.totalAmount),
      0,
    );
    let cargoTotalAmount = filteredCargo?.reduce((acc: any, item: any) => {
      if (item?.isOverallSumActivate) {
        return Number(acc) + Number(item.amount);
      }
      return acc;
    }, 0);
    if (cargoTotalAmount) {
      total += cargoTotalAmount;
    }
    return total;
  };

  const calculatedAmounts = useMemo(() => {
    const discountAmount = products?.reduce(
      (acc: any, product: any) => Number(acc) + Number(product.discountAmount),
      0,
    );

    const taxAmount = products?.reduce(
      (acc: any, product: any) => Number(acc) + Number(product.taxAmount),
      0,
    );
    const productsTotalAmount = products?.reduce(
      (acc: any, product: any) => Number(acc) + Number(product.totalAmount),
      0,
    );

    const totalAmount = getTotalAmount(products, cargo);

    return {
      totalAmount,
      discountAmount,
      taxAmount,
      productsTotalAmount,
    };
  }, [products, cargo]);

  return (
    <div className="my-5 flex gap-4 p-4">
      <CInfoBadge reversed subValue={t("common.table.totalAmount")}>
        <span>
          {calculatedAmounts?.totalAmount
            ? formatMoneyDecimal(calculatedAmounts?.totalAmount, 3)
            : "0"}
        </span>
      </CInfoBadge>

      <CInfoBadge
        reversed
        subValue={t("productServiceModule.navigation.products") + ": "}
      >
        <span>
          {calculatedAmounts?.productsTotalAmount
            ? formatMoneyDecimal(calculatedAmounts?.productsTotalAmount, 3)
            : "0"}
        </span>
      </CInfoBadge>

      <CInfoBadge reversed subValue={t("common.table.discountAmount") + ": "}>
        <span className="text-green">
          {calculatedAmounts?.discountAmount
            ? formatMoneyDecimal(calculatedAmounts?.discountAmount, 3)
            : "0"}
        </span>
      </CInfoBadge>

      <CInfoBadge reversed subValue={t("common.table.tax") + ": "}>
        <span className="text-orange">
          {calculatedAmounts?.taxAmount
            ? formatMoneyDecimal(calculatedAmounts?.taxAmount, 3)
            : "0"}
        </span>
      </CInfoBadge>
    </div>
  );
};
