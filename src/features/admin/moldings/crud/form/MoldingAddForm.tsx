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
          molding_image: values.molding_image,
          order: values.order || 0,
          has_up_trim: values.has_up_trim || false,
          has_under_trim: values.has_under_trim || false,
          has_crown: values.has_crown || false,
          height_minus_coefficient: values.height_minus_coefficient || 0,
          width_minus_coefficient: values.width_minus_coefficient || 0,
          height_plus_coefficient: values.height_plus_coefficient || 0,
          width_plus_coefficient: values.width_plus_coefficient || 0,
          is_height_coefficient_applicable:
            values.is_height_coefficient_applicable || false,
          height_coefficient_use_case:
            values.height_coefficient_use_case || false,
          is_height_coefficient_double:
            values.is_height_coefficient_double || false,
          is_width_coefficient_applicable:
            values.is_width_coefficient_applicable || false,
          width_coefficient_use_case:
            values.width_coefficient_use_case || false,
          is_width_coefficient_double:
            values.is_width_coefficient_double || false,
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
