import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateResource, useResource, RESOURCE_TYPES } from "@/features/admin/resources/model";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal, NumberInput, Select } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  resourceId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ResourceEditForm: FC<Props> = ({ open, resourceId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: resource, isLoading: isLoadingResource } = useResource(resourceId);

  const { mutate, isPending: isLoading } = useUpdateResource({
    onSuccess: () => {
      showGlobalToast(t("common.messages.resourceUpdated"), "success");
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
    if (resource && open) {
      form.setFieldsValue({
        name: resource.name,
        resource_type: resource.resource_type,
        measurement_unit: resource.measurement_unit,
        price_usd: resource.price_usd,
        price_uzs: resource.price_uzs,
      });
    }
  }, [resource, open, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        resource_id: resourceId,
        name: values.name,
        resource_type: values.resource_type,
        price_usd: values.price_usd,
        price_uzs: values.price_uzs,
        measurement_unit: values.measurement_unit,
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("common.labels.editResource")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isLoading || isLoadingResource}
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
        <Input placeholder={t("common.placeholder.resourceName")} />
      </Form.Item>
      <br />
      <Form.Item
        name="resource_type"
        label={t("common.labels.resourceType")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <Select
          placeholder={t("common.placeholder.resourceType")}
          options={RESOURCE_TYPES.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
        />
      </Form.Item>
      <br />
      <Form.Item
        name="measurement_unit"
        label={t("common.labels.measurementUnit")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <Input placeholder={t("common.placeholder.measurementUnit")} />
      </Form.Item>
      <br />
      <Form.Item
        name="price_usd"
        label={t("common.input.priceUSD")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <NumberInput min={0} placeholder={t("common.placeholder.priceUSD")} />
      </Form.Item>
      <br />
      <Form.Item name="price_uzs" label={t("common.input.priceUZS")}>
        <NumberInput min={0} placeholder={t("common.placeholder.priceUZS")} />
      </Form.Item>
    </Modal>
  );
};
