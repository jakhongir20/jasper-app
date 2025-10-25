import { Divider, Form, FormInstance } from "antd";
import { debounce } from "lodash";
import { type FC, type MouseEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Product } from "@/features/purchase/no-ship/model/no-shipment.types";
import { useGenerateCode } from "@/features/purchase/purchases/model";
import { cn } from "@/shared/helpers";
import { Icon, Input, SelectInfinitive, TextAreaInput } from "@/shared/ui";

interface Props {
  className?: string;
  form: FormInstance;
  groupTitle?: string;
  mode: "add" | "edit";
  codeType?: string;
}

export const TabInfoForm: FC<Props> = ({
  className,
  form,
  mode,
  codeType = "purchase_without_delivery",
}) => {
  const { t } = useTranslation();

  const {
    data,
    isFetching: isLoadingGenerateCode,
    refetch,
  } = useGenerateCode(codeType, mode);

  const handleReGenerateCode = debounce(refetch, 400);

  useEffect(() => {
    if (!isLoadingGenerateCode && mode !== "edit") {
      form.setFieldsValue({ general: { code: data?.code } });
    }
  }, [!isLoadingGenerateCode, data]);

  return (
    <div className={cn("py-1", className)}>
      <div className={cn("grid grid-cols-4 gap-4")}>
        <Form.Item
          name={["general", "code"]}
          label={t("common.input.code")}
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t("common.input.placeholder.code")}
            suffix={
              <Icon
                icon={"refresh"}
                color={`text-violet ${isLoadingGenerateCode ? "animate-spin" : ""}`}
                height={20}
                onClick={(e: MouseEvent<SVGElement>) => {
                  e.stopPropagation();
                  form.setFieldsValue({ general: { code: "" } });
                  handleReGenerateCode();
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item
          name={["general", "organization"]}
          label={t("common.input.organization")}
          rules={[{ required: true }]}
        >
          <SelectInfinitive
            className="w-full"
            size="middle"
            fetchUrl={"/organization/"}
            queryKey={"organization"}
            labelKey={"title"}
            valueKey={"id"}
            placeholder={t("common.input.placeholder.organization")}
            onSelect={(organization) =>
              form.setFieldValue(
                ["general", "organization"],
                Number(organization),
              )
            }
          />
        </Form.Item>

        <Form.Item
          name={["general", "partner"]}
          label={t("common.table.partner")}
          rules={[{ required: true }]}
        >
          <SelectInfinitive
            className="w-full"
            size="middle"
            fetchUrl={"/partner/"}
            queryKey={"partner"}
            labelKey={"title"}
            valueKey={"id"}
            placeholder={t("common.input.placeholder.partner")}
            onSelect={(value) =>
              form.setFieldsValue({ general: { partner: Number(value) } })
            }
          />
        </Form.Item>

        <Form.Item
          name={["general", "currency"]}
          label={t("common.input.currency")}
          rules={[{ required: false }]}
        >
          <SelectInfinitive
            className="w-full"
            size="middle"
            fetchUrl={"/currency/"}
            queryKey={"currency"}
            labelKey={"name"}
            valueKey={"id"}
            placeholder={t("common.input.placeholder.currency")}
            onSelect={(currency, option) => {
              form.setFieldValue(["general", "currency"], currency);
              form.setFieldValue(
                "currencyCode",
                (option as unknown as Product["currency"]).code,
              );
            }}
          />
        </Form.Item>
        <Form.Item name="currencyCode" noStyle>
          <input type="hidden" value={form.getFieldValue("currencyCode")} />
        </Form.Item>
      </div>

      <Divider className="bg-gray-800" />

      <div className={cn("grid grid-cols-4 gap-4", className)}>
        <Form.Item
          name={["general", "recorder"]}
          label={t("common.input.responsiblePerson")}
          rules={[{ required: false }]}
        >
          <SelectInfinitive
            className="w-full"
            size="middle"
            fetchUrl={"/staff/"}
            queryKey={"staff"}
            labelKey={"first_name"}
            valueKey={"id"}
            placeholder={t("common.input.placeholder.responsiblePerson")}
            onSelect={(recorder) =>
              form.setFieldValue(["general", "recorder"], Number(recorder))
            }
          />
        </Form.Item>

        <Form.Item
          name={["general", "batch"]}
          label={t("common.table.batch")}
          rules={[{ required: true }]}
        >
          <Input placeholder={t("common.input.placeholder.batch")} />
        </Form.Item>

        <Form.Item
          name={["general", "warehouse"]}
          label={t("common.input.warehouse")}
          rules={[{ required: true }]}
        >
          <SelectInfinitive
            className="w-full"
            size="middle"
            fetchUrl={"/warehouse/"}
            queryKey={"warehouse"}
            labelKey={"title"}
            valueKey={"id"}
            placeholder={t("common.input.placeholder.warehouse")}
            onSelect={(warehouse) =>
              form.setFieldValue(["general", "warehouse"], Number(warehouse))
            }
          />
        </Form.Item>
      </div>

      <Divider className="bg-gray-800" />

      <Form.Item
        name={["general", "note"]}
        label={t("common.input.note")}
        rules={[{ required: false, whitespace: true }]}
      >
        <TextAreaInput placeholder={t("common.input.placeholder.note")} />
      </Form.Item>
    </div>
  );
};
