import { Divider, Form } from "antd";
import React, { type FC } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { cn } from "@/shared/helpers";
import {
  Button,
  DatePicker,
  Icon,
  Input,
  InputPhone,
  SelectInfinitive,
  TextAreaInput,
} from "@/shared/ui";
import { validatePhone } from "@/shared/utils/validations";
import { CustomerCreate } from "@/features/dashboard/bids/crud/tabs/CustomerCreate";

interface Props {
  className?: string;
}

export const CATEGORY_HINCH_ID = 22;
export const CATEGORY_DOORLOCK_ID = 21;

export const TabInfoForm: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const [openCustomerModal, setOpenCustomerModal] = React.useState(false);
  const [search, setSearch] = React.useState("");

  return (
    <div className={cn("flex flex-col gap-4 py-1", className)}>
      <CustomerCreate
        open={openCustomerModal}
        onCloseModal={() => setOpenCustomerModal(false)}
      />
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-3">
        <Form.Item
          name={["general", "customer_id"]}
          label={t("common.labels.customerName")}
          rules={[{ required: true }]}
        >
          <SelectInfinitive
            placeholder={"Выберите клиента"}
            queryKey="customer_all"
            fetchUrl={`/customer/all`}
            labelKey="name"
            valueKey="customer_id"
            useValueAsLabel
            params={{ query: search }}
            onSearch={(search: string) => {
              setSearch(search);
            }}
            onSelect={(value: string, selectedOption?: any) => {
              if (selectedOption?.phone_number) {
                form.setFieldValue(
                  ["general", "phone_number"],
                  selectedOption.phone_number,
                );
              }
            }}
            emptyRender={
              <div className={"flex items-center gap-3"}>
                <p>Клиент не найден</p>
                <Button
                  icon={<Icon icon={"plus"} />}
                  onClick={() => {
                    setOpenCustomerModal(true);
                  }}
                >
                  Создать новый
                </Button>
              </div>
            }
          />
        </Form.Item>

        <Form.Item
          name={["general", "phone_number"]}
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
        <Form.Item
          name={["general", "application_date"]}
          label={"Дата заявки"}
          rules={[
            {
              required: true,
              message: t("common.validation.required"),
            },
          ]}
        >
          <DatePicker
            size="small"
            className="flex-y-center !h-10 rounded-lg border border-gray-50 bg-gray-100 px-3"
            valueName="date"
            placeholder={t("common.table.date")}
            disabledDate={(current: Dayjs) => {
              // Disable dates before today (start of day)
              return current && current.isBefore(dayjs().startOf("day"));
            }}
          />
        </Form.Item>
        <Form.Item name={["general", "delivery_date"]} label={"Дата доставки"}>
          <DatePicker
            size="small"
            className="flex-y-center !h-10 rounded-lg border border-gray-50 bg-gray-100 px-3"
            valueName="date"
            placeholder={"Выберите дату доставки"}
            disabledDate={(current: Dayjs) => {
              // Disable dates before today (start of day)
              return current && current.isBefore(dayjs().startOf("day"));
            }}
          />
        </Form.Item>

        <Form.Item name={["general", "box_width"]} label={"Ширина коробки"}>
          <Input
            type="number"
            step={0.01}
            placeholder={"Введите ширина коробки"}
          />
        </Form.Item>

        <Form.Item
          name={["general", "default_hinge"]}
          label={"Петля по умолчанию"}
        >
          <SelectInfinitive
            placeholder={"Выберите петлю"}
            queryKey="default_hinge"
            fetchUrl={`/product/by/category?category_id=${CATEGORY_HINCH_ID}`}
            labelKey="name"
            valueKey="product_id"
            useValueAsLabel
          />
        </Form.Item>
        <Form.Item
          name={["general", "default_door_lock"]}
          label={"Замок по умолчанию"}
        >
          <SelectInfinitive
            placeholder={"Выберите замок"}
            queryKey="default_door_lock"
            fetchUrl={`/product/by/category?category_id=${CATEGORY_DOORLOCK_ID}`}
            labelKey="name"
            valueKey="product_id"
            useValueAsLabel
          />
        </Form.Item>
      </div>
      <Divider />
      <Form.Item
        name={["general", "remark"]}
        label={t("common.labels.additionalInfo")}
      >
        <TextAreaInput placeholder={t("common.placeholder.remark")} />
      </Form.Item>
    </div>
  );
};
