import { type FC, useEffect } from "react";
import { Form } from "antd";
import { Input, Modal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { lattingFormFields } from "@/features/dashboard/bids";
import {
  ApplicationLatting,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { getRandomId } from "@/shared/utils";
import { renderFormItem } from "@/features/dashboard/bids/utils";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  initialValues?: ApplicationLatting;
}

export const LattingsModal: FC<Props> = ({
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
        // If editing, use provided latting values directly
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
      const currentLattings = parentForm.getFieldValue("lattings") || [];

      if (initialValues) {
        // Update existing latting
        const updatedLattings = currentLattings.map(
          (latting: ApplicationLatting) =>
            latting._uid === initialValues._uid ? { ...formValues } : latting,
        );
        parentForm.setFieldsValue({
          lattings: updatedLattings,
        });
      } else {
        // Add new latting
        parentForm.setFieldsValue({
          lattings: [
            ...currentLattings,
            {
              ...formValues,
              _uid: formValues._uid || getRandomId("latting_"),
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

        {lattingFormFields.map(renderFormItem)}
      </Form>
    </Modal>
  );
};
