import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useServiceDetail,
  useUpdateService,
} from "@/features/admin/services/model";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal, NumberInput } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  serviceId: number;
}

export const ServiceEditForm: FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  serviceId,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: service, isLoading: isLoadingService } = useServiceDetail(serviceId);

  const { mutate, isPending: isUpdating } = useUpdateService({
    onSuccess: () => {
      showGlobalToast(t("common.messages.serviceUpdated"), "success");

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
    if (service) {
      form.setFieldsValue({
        name: service.name,
        measure: service.measure,
        price_usd: service.price_usd,
        price_uzs: service.price_uzs,
      });
    }
  }, [service, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        service_id: serviceId,
        name: values.name,
        measure: values.measure,
        price_usd: values.price_usd,
        price_uzs: values.price_uzs,
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("common.labels.editService")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isUpdating || isLoadingService}
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
        <Input placeholder={t("common.placeholder.serviceName")} />
      </Form.Item>

      <Form.Item
        name="measure"
        label={t("common.labels.measure")}
      >
        <Input placeholder={t("common.placeholder.measure")} />
      </Form.Item>

      <Form.Item
        name="price_usd"
        label={t("common.labels.priceUSD")}
      >
        <NumberInput min={0} placeholder={t("common.placeholder.priceUSD")} />
      </Form.Item>

      <Form.Item
        name="price_uzs"
        label={t("common.labels.priceUZS")}
      >
        <NumberInput min={0} placeholder={t("common.placeholder.priceUZS")} />
      </Form.Item>
    </Modal>
  );
};
