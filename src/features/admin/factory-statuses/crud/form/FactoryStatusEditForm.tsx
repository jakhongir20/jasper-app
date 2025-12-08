import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useFactoryStatusDetail,
  useUpdateFactoryStatus,
} from "@/features/admin/factory-statuses/model";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  factoryStatusId: number;
}

export const FactoryStatusEditForm: FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  factoryStatusId,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: factoryStatus, isLoading: isLoadingFactoryStatus } = useFactoryStatusDetail(factoryStatusId);

  const { mutate, isPending: isUpdating } = useUpdateFactoryStatus({
    onSuccess: () => {
      showGlobalToast(t("common.messages.factoryStatusUpdated"), "success");

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
    if (factoryStatus) {
      form.setFieldsValue({
        name: factoryStatus.name,
      });
    }
  }, [factoryStatus, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        factory_status_id: factoryStatusId,
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
      title={t("common.labels.editFactoryStatus")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isUpdating || isLoadingFactoryStatus}
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
        <Input placeholder={t("common.placeholder.factoryStatusName")} />
      </Form.Item>
    </Modal>
  );
};
