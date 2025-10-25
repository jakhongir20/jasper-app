import { type FC, useEffect, useState } from "react";
import { cn, getRandomId, isTrulyEmpty } from "@/shared/helpers";
import { Form } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTabErrorHandler, useToast } from "@/shared/hooks";
import { CAddHeader } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { ProductAdd } from "@/features/product-service/products/model";
import type {
  PurchaseWithoutDelivery,
  PWDForm,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { ArrivalsTab } from "@/features/purchase/no-ship/crud";
import {
  usePWDDetail,
  usePWDProducts,
} from "@/features/purchase/no-ship/model/no-shipment.queries";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useUpdate } from "@/features/purchase/no-ship/model/no-shipment.mutations";
import { calculateProductTotals, getTotalAmount } from "@/shared/utils/calc";
import dayjs from "dayjs";
import { CalculatorLayout } from "@/shared/layout/Calculator";
import { DATE_FORMAT } from "@/shared/constants";

interface Props {
  className?: string;
}

export const tabConfigs = [
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

export const EditForm: FC<Props> = ({ className }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { guid } = useParams<{ guid: string }>();
  const { formFinishFailed } = useTabErrorHandler(tabConfigs);

  const [formFinishErrors] = useState<ValidateErrorEntity["errorFields"]>([]);
  const location = useLocation();

  const { mutate, isPending: isLoading } = useUpdate({
    onSuccess: () => {
      navigate(location.state?.from ?? `/purchase/no-ship`, { replace: true });

      toast(t("common.toast.successUpdate"), "success");
    },
  });

  const { data: purchaseWithoutDelivery, isPending: isLoadingDetail } =
    usePWDDetail(guid as string);
  // const { data: pwdLogistics, isPending: isLoadingLogistics } = usePWDLogistics(
  //   purchaseWithoutDelivery?.id as number,
  // );
  const { data: pwdProducts, isPending: isLoadingProducts } = usePWDProducts(
    purchaseWithoutDelivery?.id as number,
  );

  useEffect(() => {
    if (pwdProducts?.results.length && !isLoadingProducts) {
      const convertedList = pwdProducts?.results.map((item) => ({
        ...item,
        _uid: item?._uid || getRandomId(),
        title: item.product?.title,
        product: item.product?.id,
        discount: item.discount?.map((disc) => disc.id),
        taxes: item.taxes?.map((tax) => tax.id),
        discountOriginal: item?.discount,
        taxesOriginal: item?.taxes,
        totalAmount: item?.totalAmount,
        location: [item?.location?.id],
        seria: item?.seria?.id,
        uom: item?.uom?.id,
        expiredDate: item?.expiredDate ? dayjs(item?.expiredDate) : undefined,
      }));

      form.setFieldsValue({
        products: convertedList,
      });
    }
  }, [pwdProducts, isLoadingProducts]);

  // useEffect(() => {
  //   if (!isLoadingLogistics && pwdLogistics) {
  //     const transformedData = pwdLogistics.results.map((item) => ({
  //       ...item,
  //       shippingType: item?.shippingType?.id,
  //       stage: item?.stage?.id,
  //       currency: item?.currency?.id,
  //     }));
  //
  //     form.setFieldValue(["cargo"], transformedData);
  //   }
  // }, [pwdLogistics, isLoadingLogistics]);

  useEffect(() => {
    if (!isLoadingDetail && purchaseWithoutDelivery) {
      const transformedData: PurchaseWithoutDelivery = {
        ...purchaseWithoutDelivery,
        code: purchaseWithoutDelivery?.code,
        currency: purchaseWithoutDelivery?.currency?.id,
        organization: purchaseWithoutDelivery?.organization?.id,
        partner: purchaseWithoutDelivery?.partner?.id,
        recorder: purchaseWithoutDelivery?.recorder?.id,
        warehouse: purchaseWithoutDelivery?.warehouse?.id,
      };

      form.setFieldsValue({
        general: transformedData,
        warehouseGuid: purchaseWithoutDelivery?.warehouse?.guid,
        warehouse: purchaseWithoutDelivery?.warehouse?.title,
        currencyCode: purchaseWithoutDelivery?.currency?.code,
      });
    }
  }, [purchaseWithoutDelivery, isLoadingDetail]);

  const handleSave = () => {
    form
      .validateFields()
      .then(({ general, products, cargo, deleteLogistics, deleteProducts }) => {
        const filteredCargo = cargo
          ?.filter((item: any) => !isTrulyEmpty(item)) // remove empty items
          .map((item: any) => ({
            ...item,
            shippingType:
              item?.shippingType?.id ??
              item?.shippingType?.value ??
              item?.shippingType,
            stage: item?.stage?.id ?? item?.stage?.value ?? item?.stage,
            currency:
              item?.currency?.id ?? item?.currency?.value ?? item?.currency,
          }));

        const rawData: PurchaseWithoutDelivery = {
          ...general,
          warehouse:
            general?.warehouse?.id ??
            general?.warehouse?.value ??
            general?.warehouse,

          ...(filteredCargo?.length ? { logistics: filteredCargo } : {}),

          products: products?.map(
            ({
              discountOriginal,
              taxesOriginal,
              ...product
            }: {
              id?: string;
              [key: string]: any;
            }) => {
              if (product?.id === product?.product) {
                delete product?.id;
              }
              return {
                ...product,
                ...(product?.id === product?.product
                  ? {}
                  : { id: product?.id }),
                product: product?.product,
                discount: product.discount?.map((disc: any) =>
                  typeof disc === "number" ? disc : disc.value,
                ),
                taxes: product.taxes?.map((tax: any) =>
                  typeof tax === "number" ? tax : tax.value,
                ),
                uom: product.uom?.value ?? product.uom?.id ?? product.uom,
                seria:
                  product?.seria?.id ?? product?.seria?.value ?? product?.seria,
                location: product.location?.[product?.location?.length - 1],
                batch: general.batch ?? product?.batch,
                warehouse:
                  general?.warehouse?.id ??
                  general?.warehouse?.value ??
                  general?.warehouse,
                expiredDate: dayjs(product?.expiredDate).format(DATE_FORMAT),
                registrationDate: dayjs(product?.registrationDate).format(
                  DATE_FORMAT,
                ),
              };
            },
          ),

          discountAmount:
            products?.reduce(
              (acc: any, product: any) =>
                Number(acc) + Number(product.discountAmount),
              0,
            ) || 0,
          taxAmount:
            products?.reduce(
              (acc: any, product: any) =>
                Number(acc) + Number(product.taxAmount),
              0,
            ) || 0,
          totalAmount: getTotalAmount(products, filteredCargo),

          deleteLogistics,
          deleteProducts,
        };

        mutate({
          guid: guid as string,
          formData: rawData,
        });
      });
  };

  const handleValuesChange = (_: ProductAdd, data: PWDForm) => {
    const products = data.products;
    if (!products) return;

    const updated = calculateProductTotals(products);

    form.setFieldsValue({ products: updated });
  };

  return (
    <CalculatorLayout form={form}>
      <Form
        form={form}
        layout="vertical"
        onFinishFailed={formFinishFailed}
        onValuesChange={handleValuesChange}
        className={cn(className)}
      >
        <CAddHeader
          code={purchaseWithoutDelivery?.code}
          mode="edit"
          title={t("common.button.edit")}
          loading={isLoading}
          addText={t("common.button.save")}
          onSave={handleSave}
        ></CAddHeader>

        {/*<AmountDetails form={form} />*/}

        <ArrivalsTab
          form={form}
          mode="edit"
          isLoadingDetail={isLoadingDetail || isLoadingProducts}
          formFinishErrors={formFinishErrors}
          id={purchaseWithoutDelivery?.id as number}
        />
      </Form>
    </CalculatorLayout>
  );
};
