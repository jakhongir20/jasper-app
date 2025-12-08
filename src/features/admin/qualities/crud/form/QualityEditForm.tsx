import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useQualityDetail,
  useUpdateQuality,
} from "@/features/admin/qualities/model";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  qualityId: number;
}

export const QualityEditForm: FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  qualityId,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: quality, isLoading: isLoadingQuality } = useQualityDetail(qualityId);

  const { mutate, isPending: isUpdating } = useUpdateQuality({
    onSuccess: () => {
      showGlobalToast(t("common.messages.qualityUpdated"), "success");

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

  useEffect(() => {
    if (quality) {
      form.setFieldsValue({
        name: quality.name,
      });
    }
  }, [quality, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        quality_id: qualityId,
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
      title={t("common.labels.editQuality")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isUpdating || isLoadingQuality}
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
