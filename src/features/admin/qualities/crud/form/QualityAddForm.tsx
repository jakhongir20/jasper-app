import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useCreateQuality } from "@/features/admin/qualities/model";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const QualityAddForm: FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useCreateQuality({
    onSuccess: () => {
      showGlobalToast(t("common.messages.qualityCreated"), "success");

      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      form.resetFields();
      onSuccess();
    },
    onError: (error: any) => {
      showGlobalToast(
        error?.response?.data?.message || t("common.messages.error"),
        "error",
      );
    },
  });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        name: values.name,
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("common.labels.addQuality")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isLoading}
      saveBtnText={t("common.button.save")}
      cancelText={t("common.button.cancel")}
      size="middle"
      form={form}
    >
      <Form.Item
        name="name"
        label={t("common.labels.name")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <Input placeholder={t("common.placeholder.qualityName")} />
      </Form.Item>
    </Modal>
  );
};
