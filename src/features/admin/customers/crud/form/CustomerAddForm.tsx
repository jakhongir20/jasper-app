import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useCustomerCreateAdminCustomerPost } from "@/shared/lib/api";
import { showGlobalToast } from "@/shared/hooks";
import { CSwitch, Input, InputPhone, Modal } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";
import { validatePhone } from "@/shared/utils/validations";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CustomerAddForm: FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useCustomerCreateAdminCustomerPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tableData"],
        });
        showGlobalToast(t("common.messages.customerCreated"), "success");
        form.resetFields();
        onSuccess();
      },
      onError: (error: any) => {
        showGlobalToast(
          error?.response?.data?.message || t("common.messages.error"),
          "error",
        );
      },
    },
  });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        data: {
          name: values.name,
          phone_number: values.phone || null,
          is_active: values.is_active ?? false,
        },
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("common.labels.addCustomer")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isLoading}
      saveBtnText={t("common.button.save")}
      cancelText={t("common.button.cancel")}
      size="middle"
      form={form}
    >
      <div className="flex flex-col gap-4">
        <Form.Item
          name="name"
          label={t("common.labels.name")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.customerName")} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t("common.labels.phone")}
          rules={[{ validator: validatePhone }]}
          validateTrigger={["onBlur", "onSubmit"]}
        >
          <InputPhone placeholder={t("common.placeholder.phone")} />
        </Form.Item>

        <Form.Item
          name="is_active"
          label={t("common.labels.status")}
          valuePropName="checked"
        >
          <CSwitch
            checkedChildren={t("common.status.active")}
            unCheckedChildren={t("common.status.inactive")}
          />
        </Form.Item>
      </div>
    </Modal>
  );
};
