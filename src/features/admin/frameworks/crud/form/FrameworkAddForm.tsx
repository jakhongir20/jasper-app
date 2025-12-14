import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreateFrameworkPayload,
  useCreateFramework,
} from "@/features/admin/frameworks/model";
import { showGlobalToast } from "@/shared/hooks";
import { Modal } from "@/shared/ui";
import { FrameworkForm } from "./FrameworkForm";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  className?: string;
}

export const FrameworkAddForm: FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  className,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const title = t("common.labels.addFramework");

  const { mutate, isPending: isLoading } = useCreateFramework({
    onSuccess: () => {
      showGlobalToast(t("common.messages.frameworkCreated"), "success");
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      form.resetFields();
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Create framework error:", error?.response?.data || error);
      showGlobalToast(
        error?.message || t("common.messages.frameworkCreateFailed"),
        "error",
      );
    },
  });

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const payload: CreateFrameworkPayload = {
          name: values.name,
          framework_image: values.image_url || "",
          order_number: values.order_number,
          doorway_type: values.doorway_type,
          is_frame: values.is_frame ?? false,
          is_filler: values.is_filler ?? false,
          has_crown: values.has_crown ?? false,
          has_transom: values.has_transom ?? false,
          has_under_frame: values.has_under_frame ?? false,
          has_up_frame: values.has_up_frame ?? false,
        };

        console.log("Creating framework with payload:", payload);
        mutate(payload);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
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
        <FrameworkForm />
      </Form>
    </Modal>
  );
};

// Backward compatibility alias
export const MoldingAddForm = FrameworkAddForm;
