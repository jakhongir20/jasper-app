import { type FC, useEffect } from "react";
import { Form } from "antd";
import { Input, Modal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { qualityFormFields } from "@/features/dashboard/bids";
import {
  ApplicationAdditionalQuality,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { getRandomId } from "@/shared/utils";
import { renderFormItem } from "@/features/dashboard/bids/utils";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  initialValues?: ApplicationAdditionalQuality;
}

export const QualityModal: FC<Props> = ({
  isOpen,
  closeModal,
  title,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const parentForm = Form.useFormInstance<ApplicationLocalForm>();

  // Set form values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        // If editing, use provided quality values directly
        form.setFieldsValue(initialValues);
      } else {
        // If adding new, reset form to empty state
        form.resetFields();
      }
    }
  }, [form, isOpen, initialValues]);

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      const formValues = values;
      const currentQualities =
        parentForm.getFieldValue("application_qualities") || [];

      if (initialValues) {
        // Update existing quality
        const updatedQualities = currentQualities.map(
          (quality: ApplicationAdditionalQuality) =>
            quality._uid === initialValues._uid ? { ...formValues } : quality,
        );
        parentForm.setFieldsValue({
          application_qualities: updatedQualities,
        });
      } else {
        // Add new quality
        parentForm.setFieldsValue({
          application_qualities: [
            ...currentQualities,
            {
              ...formValues,
              _uid: formValues._uid || getRandomId("quality_"),
            },
          ],
        });
      }

      closeModal();
    });
  };

  const handleCloseModal = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      size={"middle"}
      className="!p-0"
      cancelText={t("common.button.undo")}
      saveBtnText={t("common.button.confirm")}
      onCancel={handleCloseModal}
      onSave={handleConfirm}
    >
      <Form layout="vertical" form={form} className="grid gap-4 p-5">
        {/* Hidden field for _uid to maintain identity for editing */}
        <Form.Item name="_uid" hidden>
          <Input />
        </Form.Item>

        {qualityFormFields.map(renderFormItem)}
      </Form>
    </Modal>
  );
};
