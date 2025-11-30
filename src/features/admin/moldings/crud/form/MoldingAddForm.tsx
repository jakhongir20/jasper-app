import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateMolding,
  CreateMoldingPayload,
} from "@/features/admin/moldings/model";
import { showGlobalToast } from "@/shared/hooks";
import { Modal } from "@/shared/ui";
import { MoldingForm } from "./MoldingForm";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  className?: string;
}

export const MoldingAddForm: FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  className,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useCreateMolding({
    onSuccess: () => {
      showGlobalToast(t("common.messages.moldingCreated"), "success");
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      form.resetFields();
      onSuccess();
    },
    onError: (error: any) => {
      showGlobalToast(
        error?.message || t("common.messages.moldingCreateFailed"),
        "error",
      );
    },
  });

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const payload: CreateMoldingPayload = {
          name: values.name,
          framework_image: values.framework_image,
          order_number: values.order_number,
          doorway_type: values.doorway_type,
          is_frame: values.is_frame,
          is_filler: values.is_filler,
        };

        mutate(payload);
      })
      .catch((errorInfo) => {});
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("common.labels.addMolding")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSave}
      saveBtnText={t("common.button.add")}
      cancelText={t("common.button.cancel")}
      loading={isLoading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className={cn(className)}
        scrollToFirstError
      >
        <MoldingForm />
      </Form>
    </Modal>
  );
};
