import { Divider, Form } from "antd";
import React, { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import {
  DatePicker,
  Input,
  InputPhone,
  Select,
  SelectInfinitive,
  TextAreaInput,
} from "@/shared/ui";
import { canopyOptions, doorLockOptions } from "@/features/dashboard/bids";
import { validatePhone } from "@/shared/utils/validations";

interface Props {
  className?: string;
}

export const TabInfoForm: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("__user") || "{}");

  return (
    <div className={cn("flex flex-col gap-4 py-1", className)}>
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-4">
        <Form.Item
          name={["general", "customer_name"]}
          label={t("common.labels.customerName")}
          rules={[{ required: true }]}
        >
          <SelectInfinitive
            placeholder={t("common.placeholder.selectStatus")}
            queryKey="customer_all"
            fetchUrl="/customer/all"
            labelKey="name"
            valueKey="customer_id"
            useValueAsLabel
          />
        </Form.Item>

        <Form.Item
          name={["general", "customer_phone"]}
          label={t("common.labels.customerPhone")}
          rules={[{ required: true, validator: validatePhone }]}
          validateTrigger={["onBlur", "onSubmit"]}
        >
          <InputPhone placeholder={t("common.placeholder.customerPhone")} />
        </Form.Item>

        <Form.Item
          name={["general", "address"]}
          label={t("common.labels.address")}
          rules={[{ required: true }]}
        >
          <Input placeholder={t("common.placeholder.address")} />
        </Form.Item>

        {/* <Form.Item
          name={["general", "datetime"]}
          label={t("common.labels.productionDate")}
          rules={[{ required: false }]}
        >
          <DatePicker placeholder={t("common.placeholder.productionDate")} />
        </Form.Item>
 */}
        {/* <Form.Item
          name={["general", "production_date"]}
          label={t("common.input.productionDate")}
        >
          <DatePicker placeholder={t("common.placeholder.productionDate")} />
        </Form.Item> */}

        <Form.Item
          name={["general", "number"]}
          label={t("common.labels.measurementNumber")}
        >
          <Input placeholder={t("common.placeholder.measurementNumber")} />
        </Form.Item>

        <Form.Item name={["general", "color"]} label={t("common.labels.color")}>
          <SelectInfinitive
            placeholder={t("common.placeholder.color")}
            queryKey="color"
            fetchUrl="/color/all"
            labelKey="name"
            valueKey="color_id"
            useValueAsLabel
          />
        </Form.Item>
        <Form.Item
          name={["general", "transom_height_front"]}
          label={t("common.input.transom_height_front")}
        >
          <Input placeholder={t("common.placeholder.transom_height_front")} />
        </Form.Item>

        <Form.Item
          name={["general", "transom_height_back"]}
          label={t("common.input.transom_height_back")}
        >
          <Input placeholder={t("common.placeholder.transom_height_back")} />
        </Form.Item>

        <Form.Item
          name={["general", "author_id"]}
          label={t("common.labels.applicationAuthor")}
          initialValue={user?.user?.user_id}
        >
          <div className="flex-y-center h-10 rounded-lg border border-gray-50 bg-gray-100 px-3">
            {user?.user?.name}
          </div>
        </Form.Item>
        <Form.Item
          name={["general", "application_date"]}
          label={"Дата заявки"}
        >
          <DatePicker
            size="small"
            className="flex-y-center !h-10 rounded-lg border border-gray-50 bg-gray-100 px-3"
            valueName="date"
            placeholder={t("common.table.date")}
          />
        </Form.Item>

        <Form.Item
          className="col-span-2"
          name={["general", "sizes"]}
          label={t("common.labels.dimensions")}
        >
          <Input placeholder={t("common.placeholder.sizes")} />
        </Form.Item>
      </div>

      <Form.Item
        name={["general", "remark"]}
        label={t("common.labels.additionalInfo")}
      >
        <TextAreaInput placeholder={t("common.placeholder.remark")} />
      </Form.Item>
      <Divider/>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Form.Item
          name={["general", "door_lock"]}
          label={t("common.labels.doorLock")}
        >
          <Select
            placeholder={t("common.placeholder.doorLock")}
            options={doorLockOptions}
          />
        </Form.Item>

        <Form.Item
          name={["general", "canopy"]}
          label={t("common.labels.canopy")}
        >
          <Select
            placeholder={t("common.placeholder.canopy")}
            options={canopyOptions}
          />
        </Form.Item>
      </div>
    </div>
  );
};
