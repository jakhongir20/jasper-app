import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useFactoryStatusDetail,
  useUpdateFactoryStatus,
} from "@/features/admin/factory-statuses/model";
import { showGlobalToast } from "@/shared/hooks";
import { CSwitch, Input, Modal, NumberInput } from "@/shared/ui";
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

  const { data: factoryStatus, isLoading: isLoadingFactoryStatus } =
    useFactoryStatusDetail(factoryStatusId);

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
        status_index: factoryStatus.status_index ?? 0,
        status_order: factoryStatus.status_order ?? 0,
        is_initial_status: factoryStatus.is_initial_status ?? false,
        is_final_status: factoryStatus.is_final_status ?? false,
      });
    }
  }, [factoryStatus, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        factory_status_id: factoryStatusId,
        name: values.name,
        status_index: values.status_index,
        status_order: values.status_order,
        is_initial_status: values.is_initial_status,
        is_final_status: values.is_final_status,
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={"Редактировать статус фабрики"}
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
        <Input placeholder="Введите название" />
      </Form.Item>
      <br />
      <Form.Item
        name="status_index"
        label={t("common.labels.statusIndex")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <NumberInput min={0} step={1} placeholder="Введите индекс" />
      </Form.Item>
      <br />
      <Form.Item
        name="status_order"
        label={t("common.labels.statusOrder")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <NumberInput min={0} step={1} placeholder="Введите порядок" />
      </Form.Item>
      <br />
      <div className={"grid grid-cols-2"}>
        <Form.Item
          name="is_initial_status"
          label={t("common.labels.isInitialStatus")}
          valuePropName="checked"
        >
          <CSwitch />
        </Form.Item>
        <Form.Item
          name="is_final_status"
          label={t("common.labels.isFinalStatus")}
          valuePropName="checked"
        >
          <CSwitch />
        </Form.Item>
      </div>
    </Modal>
  );
};
