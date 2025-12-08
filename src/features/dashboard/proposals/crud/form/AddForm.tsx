import { Form } from "antd";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ArrivalsTab } from "@/features/purchase/no-ship/crud";
import { useCreate } from "@/features/purchase/no-ship/model/no-shipment.mutations";
import {
  PurchaseWithoutDelivery,
  PWDForm,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { AmountDetails } from "@/features/purchase/no-ship/ui";
import { cn, isTrulyEmpty } from "@/shared/helpers";
import { useTabErrorHandler, useToast } from "@/shared/hooks";
import { Option } from "@/shared/types";
import { CAddHeader } from "@/shared/ui";
import { formatDate } from "@/shared/utils";
import { calculateProductTotals, getTotalAmount } from "@/shared/utils/calc";

interface Props {
  className?: string;
}

const tabConfigs = [
  {
    tabKey: "1",
    fields: ["general"],
  },
  {
    tabKey: "2",
    fields: ["products"],
  },
  {
    tabKey: "3",
    fields: ["cargo"],
  },
];

export const AddForm: FC<Props> = ({ className }) => {
  const [form] = Form.useForm<PWDForm>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { formFinishFailed } = useTabErrorHandler(tabConfigs);
  const [, setParams] = useSearchParams();

  const [formFinishErrors] = useState<ValidateErrorEntity["errorFields"]>([]);

  const { mutate, isPending: isLoading } = useCreate({
    onSuccess: () => {
      navigate(`/purchase/no-ship`);
      toast(t("common.toast.successCreate"), "success");
    },
  });

  const handleSave = () => {
    form.validateFields().then(({ general, products, cargo }) => {
      if (!products) {
        setParams({ tab: "2" });
        toast(t("common.toast.form.products"), "error");

        return;
      }

      const filteredCargo = cargo
        ?.filter((l) => !isTrulyEmpty(l))
        .map((l) => ({
          ...l,
          shippingType: (l.shippingType as Option)?.value ?? l.shippingType,
          stage: (l.stage as Option)?.value ?? l.stage,
          currency: (l.currency as Option)?.value ?? l.currency,
        }));

      const rawData: PurchaseWithoutDelivery = {
        ...general,

        ...(filteredCargo?.length ? { logistics: filteredCargo } : {}),

        // TODO: FIX THIS TYPE
        // @ts-expect-error gotta fix this
        products: products?.map(({ id, _uid, ...product }) => {
          return {
            ...product,
            taxAmount: Number(product.taxAmount).toFixed(6),
            discount: product.discount?.map(
              (disc) => (disc as Option)?.value ?? disc,
            ),
            taxes: product.taxes?.map(
              (disc) => (disc as Option)?.value ?? disc,
            ),
            uom: (product.uom as Option)?.value ?? product.uom,
            location:
              (product.location?.[product.location?.length - 1] as Option)
                ?.value ?? product.location?.[product.location?.length - 1],
            seria: (product.seria as Option).value ?? product.seria,
            warehouse: general?.warehouse?.value ?? general?.warehouse,
            expiredDate:
              product.expiredDate &&
              formatDate(product.expiredDate, "DD.MM.YYYY"),
          };
        }),

        discountAmount:
          products?.reduce(
            (acc, product) => Number(acc) + Number(product.discountAmount),
            0,
          ) || 0,
        taxAmount:
          products?.reduce(
            (acc, product) => Number(acc) + Number(product.taxAmount),
            0,
          ) || 0,
        totalAmount: getTotalAmount(products, cargo),
        status: general?.status ? +general?.status : 1,
      };

      mutate(rawData);
    });
  };

  const handleValuesChange = (data: PWDForm) => {
    const products = data.products;
    if (!products) return;

    const updated = calculateProductTotals(products);
    form.setFieldValue("products", updated);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, all) => handleValuesChange(all)}
      className={cn(className)}
      onFinishFailed={formFinishFailed}
      scrollToFirstError
    >
      <CAddHeader
        mode="add"
        title={t("purchaseModule.navigation.newArrivals")}
        loading={isLoading}
        onSave={handleSave}
      ></CAddHeader>

      <AmountDetails form={form} />

      <ArrivalsTab form={form} mode="add" formFinishErrors={formFinishErrors} />
    </Form>
  );
};
