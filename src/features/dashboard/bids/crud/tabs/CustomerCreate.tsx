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
      // Extract error message from various possible response formats
      let errorMessage = t("common.messages.error");

      try {
        const responseData = error?.response?.data;

        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.detail) {
          // FastAPI validation error format
          if (typeof responseData.detail === "string") {
            errorMessage = responseData.detail;
          } else if (Array.isArray(responseData.detail)) {
            // Validation errors array
            errorMessage = responseData.detail
              .map((err: any) => err?.msg || err?.message || JSON.stringify(err))
              .join(", ");
          }
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        }

        // Check for duplicate/conflict error (409 or specific message)
        const statusCode = error?.response?.status;
        if (statusCode === 409 || errorMessage.toLowerCase().includes("exist") || errorMessage.toLowerCase().includes("duplicate")) {
          errorMessage = "Клиент с таким телефоном уже существует";
        }
      } catch (e) {
        // Fallback to default error message
        console.error("Error parsing error response:", e);
      }

      showGlobalToast(errorMessage, "error");
    },
  });

  const handleSaveCustomer = () => {
    form
      .validateFields()
      .then((values) => {
        const model = {
          ...values,
        };
        mutate(model);
      })
      .catch((validationError) => {
        // Form validation failed - fields will show errors automatically
        console.log("Form validation failed:", validationError);
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
