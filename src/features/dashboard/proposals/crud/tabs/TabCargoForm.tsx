import { FC, useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/helpers";
import { type CollapseProps, Divider, Form, FormInstance } from "antd";
import {
  Checkbox,
  Collapse,
  CollapseDeleteBtn,
  Icon,
  Input,
  NumberInput,
  SelectInfinitive,
  TextAreaInput,
} from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { PartnerAdd } from "@/features/crm/partners/model";
import { useTabCollapseErrorHandler } from "@/shared/hooks";
import { Logistics } from "@/features/purchase/purchases/model";
import { PurchaseOrderLogistic } from "@/features/purchase/order";
import { CreateCargoStageAction } from "@/features/purchase/no-ship/ui";
import { useToggle } from "@/shared/hooks/useToggle";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";

interface Props {
  className?: string;
  form: FormInstance;
  createdItems: string[];
  onSetCreatedItems: (items: string[]) => void;
  formFinishErrors: ValidateErrorEntity["errorFields"];
  mode: "add" | "edit";
  logistics?: Logistics[];
  addButtonClickedRef?: boolean;
}

export const TabCargoForm: FC<Props> = ({
  className,
  form,
  mode,
  createdItems,
  onSetCreatedItems,
  formFinishErrors,
  logistics = [],
  addButtonClickedRef = false,
}) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string[]>(["1"]);
  const [deletedCargoIDs, setDeletedCargoIDs] = useState<number[]>([]);
  const { isOpen: isAddStageOpen, toggle: toggleAddStageModal } = useToggle();

  useEffect(() => {
    useTabCollapseErrorHandler(
      "cargo",
      formFinishErrors,
      createdItems,
      setActiveKey,
    );
  }, [formFinishErrors, createdItems, setActiveKey]);

  useEffect(() => {
    if (addButtonClickedRef) {
      setActiveKey((prev) => [...prev, createdItems[createdItems.length - 1]]);
    } else {
      setActiveKey((prev) => [...prev, createdItems[0]]);
    }
  }, [createdItems, addButtonClickedRef]);

  useEffect(() => {
    (
      logistics as Array<{ shippingAddress: string; deliveryAddress: string }>
    )?.forEach((_, index: number) => {
      form.setFields([
        {
          name: ["cargo", index, "shippingAddress"],
          // @ts-expect-error gotta fix this
          rules: [{ required: logistics?.length! > 1, whitespace: true }],
        },
        {
          name: ["cargo", index, "deliveryAddress"],
          // @ts-expect-error gotta fix this
          rules: [{ required: logistics?.length! > 1, whitespace: true }],
        },
      ]);
    });
  }, [logistics?.length]);

  const handleDeleteItems = (deletedItem: PurchaseOrderLogistic) => {
    if (!deletedItem) return;

    if (deletedItem?.id) {
      setDeletedCargoIDs((prev) => [...prev, deletedItem?.id]);
    }

    const updatedIndexes = createdItems.filter(
      (key) => key !== deletedItem?._uid,
    );

    form.setFieldsValue({
      cargo: form
        .getFieldValue("cargo")
        ?.filter((item: any) => item?._uid !== deletedItem?._uid),
    });
    onSetCreatedItems(updatedIndexes);
  };

  useEffect(() => {
    if (mode === "edit") {
      form.setFieldsValue({ deleteLogistics: deletedCargoIDs });
    }
  }, [deletedCargoIDs, mode]);

  const ITEMS: CollapseProps["items"] = useMemo(() => {
    return createdItems.map((key, index) => ({
      key,
      label: `${t("purchaseModule.add.cargo")} ${index + 1}`,
      extra:
        createdItems?.length > 1 ? (
          <CollapseDeleteBtn
            text={t("purchaseModule.add.deleteCargo")}
            onClick={() =>
              handleDeleteItems(
                form.getFieldValue("cargo")?.find((item: any) => {
                  return item?._uid === key;
                }),
              )
            }
          />
        ) : null,
      children: (
        <div key={key} className="flex flex-col gap-3">
          <div className={cn("grid grid-cols-2 gap-4")}>
            {mode === "edit" && (
              <>
                <Form.Item hidden name={["cargo", index, "id"]}>
                  <input type="hidden" />
                </Form.Item>
                <Form.Item hidden name={["cargo", index, "_uid"]}>
                  <input type="hidden" />
                </Form.Item>
                <Form.Item hidden name={"deleteLogistics"}>
                  <input type="hidden" />
                </Form.Item>
              </>
            )}
            <Form.Item hidden name="products">
              <input type="hidden" />
            </Form.Item>

            <Form.Item
              name={["cargo", index, "shippingType"]}
              label={t("common.input.shippingType")}
            >
              <SelectInfinitive
                className="w-full"
                size="middle"
                fetchUrl={"/shipping-type/"}
                queryKey={"shippingType"}
                labelKey={"title"}
                valueKey={"id"}
                placeholder={t("common.input.placeholder.deliveryType")}
              />
            </Form.Item>

            <div className="relative">
              <div
                onClick={toggleAddStageModal}
                className="absolute right-0 z-50 flex cursor-pointer items-center gap-1 text-sm font-medium text-violet"
              >
                {t("common.button.add")}
                <Icon icon={"plus"} color={"text-violet"} />
              </div>
              <Form.Item
                name={["cargo", index, "stage"]}
                label={t("common.input.stage")}
                rules={[{ required: false }]}
              >
                <SelectInfinitive
                  className="w-full"
                  size="middle"
                  fetchUrl={"logistic-stage"}
                  queryKey={"logistic-stage"}
                  labelKey={"title"}
                  valueKey={"id"}
                  placeholder={t("common.input.placeholder.stage")}
                />
              </Form.Item>
            </div>
          </div>

          <Divider className="bg-gray-800" />

          <div className={cn("grid grid-cols-2 gap-4")}>
            <Form.Item
              name={["cargo", index, "shippingAddress"]}
              label={t("common.input.shipping")}
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder={t("common.input.placeholder.shipping")} />
            </Form.Item>
            <Form.Item
              name={["cargo", index, "deliveryAddress"]}
              label={t("common.input.deliveryAddress")}
              rules={[{ required: true, whitespace: true }]}
            >
              <Input
                placeholder={t("common.input.placeholder.deliveryAddress")}
              />
            </Form.Item>

            <Form.Item
              name={["cargo", index, "amount"]}
              label={t("common.input.summa")}
            >
              <NumberInput placeholder={t("common.input.placeholder.summa")} />
            </Form.Item>

            <Form.Item
              name={["cargo", index, "currency"]}
              label={t("common.input.currency")}
            >
              <SelectInfinitive
                className="w-full"
                size="middle"
                fetchUrl={"/currency/"}
                queryKey={"currency"}
                labelKey={"name"}
                valueKey={"id"}
                placeholder={t("common.input.placeholder.currency")}
                value={form.getFieldValue(["cargo", index, "currency"])}
                onSelect={(currency) =>
                  form.setFieldsValue({
                    cargo: form
                      .getFieldValue("cargo")
                      .map((item: PartnerAdd) =>
                        item?._uid === key ? { ...item, currency } : item,
                      ),
                  })
                }
              />
            </Form.Item>
            <Form.Item
              name={["cargo", index, "sender"]}
              label={t("common.input.sender")}
            >
              <Input placeholder={t("common.input.placeholder.sender")} />
            </Form.Item>
            <Form.Item
              name={["cargo", index, "recipient"]}
              label={t("common.input.recipient")}
            >
              <Input placeholder={t("common.input.placeholder.recipient")} />
            </Form.Item>
          </div>

          <Form.Item
            name={["cargo", index, "note"]}
            label={t("common.input.note")}
            rules={[{ required: false, whitespace: true }]}
          >
            <TextAreaInput placeholder={t("common.input.placeholder.note")} />
          </Form.Item>

          <Divider className="bg-gray-800" />

          <Form.Item
            name={["cargo", index, "isOverallSumActivate"]}
            valuePropName="checked"
            rules={[{ required: false }]}
          >
            <Checkbox
              onChange={({ target: { checked: isOverallSumActivate } }) =>
                form.setFieldsValue({
                  cargo: form
                    .getFieldValue("cargo")
                    .map((item: PartnerAdd) =>
                      item?._uid === key
                        ? { ...item, isOverallSumActivate }
                        : item,
                    ),
                })
              }
              label={t("common.input.addToGroup")}
            />
          </Form.Item>
          <Form.Item
            name={["cargo", index, "isInvoiceCreate"]}
            valuePropName="checked"
            rules={[{ required: false }]}
          >
            <Checkbox
              onChange={({ target: { checked: isInvoiceCreate } }) =>
                form.setFieldsValue({
                  cargo: form
                    .getFieldValue("cargo")
                    .map((item: PartnerAdd) =>
                      item?._uid === key ? { ...item, isInvoiceCreate } : item,
                    ),
                })
              }
              label={t("common.input.invoicePayment")}
            />
          </Form.Item>
        </div>
      ),
    }));
  }, [createdItems, logistics]);

  return (
    <>
      <Collapse
        items={ITEMS}
        className={className}
        defaultActiveKey={createdItems}
        activeKey={activeKey}
        onChange={(keys) => {
          setActiveKey(keys as string[]);
        }}
      />

      <CreateCargoStageAction
        open={isAddStageOpen}
        closeModal={toggleAddStageModal}
      />
    </>
  );
};
