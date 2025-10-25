import React, { FC } from "react";
import { Form } from "antd";
import { Input, InputPhone, Modal } from "@/shared/ui";
import { showGlobalToast } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCreateCustomer } from "@/features/admin/customers/model/customers.mutations";

interface Props {
  className?: string;
  open: boolean;
  onCloseModal: () => void;
}

export const CustomerCreate: FC<Props> = ({ open, onCloseModal }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate, isPending: isLoading } = useCreateCustomer({
    onSuccess: () => {
      showGlobalToast("Клиент успешно создан", "success");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      form.resetFields();
      onCloseModal();
    },
    onError: (error: any) => {
      showGlobalToast(
        error?.response?.data || t("common.messages.error"),
        "error",
      );
    },
  });

  const handleSaveCustomer = () => {
    form.validateFields().then((values) => {
      const model = {
        ...values,
      };
      mutate(model);
    });
  };

  return (
    <Modal
      title={"Создать новый клиент"}
      form={form}
      open={open}
      saveBtnText={"Подтвердить"}
      onCancel={onCloseModal}
      width={600}
      onSave={handleSaveCustomer}
      loading={isLoading}
    >
      <Form.Item
        name={"name"}
        label={"Имя клиента"}
        rules={[{ required: true, message: "Пожалуйста введите имя клиента" }]}
      >
        <Input placeholder={"Введите имя клиента"} />
      </Form.Item>
      <br />
      <Form.Item
        name={"phone_number"}
        label={"Телефон клиента"}
        rules={[
          { required: true, message: "Пожалуйста введите телефон клиента" },
        ]}
      >
        <InputPhone placeholder={"Введите телефон клиента"} />
      </Form.Item>
    </Modal>
  );
};
