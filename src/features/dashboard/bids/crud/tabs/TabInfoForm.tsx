import { Divider, Form } from "antd";
import React, { type FC } from "react";
import { useTranslation } from "react-i18next";
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
  const user = JSON.parse(localStorage.getItem("__user") || "{}");
  const [openCustomerModal, setOpenCustomerModal] = React.useState(false);
  const [search, setSearch] = React.useState("");

  return (
    <div className={cn("flex flex-col gap-4 py-1", className)}>
      <CustomerCreate
        open={openCustomerModal}
        onCloseModal={() => setOpenCustomerModal(false)}
      />
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-4">
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
      <Divider />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Form.Item
          name={["general", "default_hinge_id"]}
          label={"Продукт петли дверей"}
        >
          <SelectInfinitive
            placeholder={"Выберите продукт петли дверей"}
            queryKey="default_hinge_id"
            fetchUrl={`/product/by/category?category_id=${CATEGORY_HINCH_ID}`}
            labelKey="name"
            valueKey={"category_id"}
            useValueAsLabel
          />
        </Form.Item>
        <Form.Item
          name={["general", "default_door_lock_id"]}
          label={"Продукт замка дверей"}
        >
          <SelectInfinitive
            placeholder={"Выберите продукт замка дверей"}
            queryKey="default_door_lock_id"
            fetchUrl={`/product/by/category?category_id=${CATEGORY_DOORLOCK_ID}`}
            labelKey="name"
            valueKey="category_id"
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
