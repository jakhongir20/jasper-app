import { type FC, useEffect } from "react";
import { Form } from "antd";
import { Input, Modal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { decorationFormFields } from "@/features/dashboard/bids";
import {
  ApplicationDecoration,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { getRandomId } from "@/shared/utils";
import { renderFormItem } from "@/features/dashboard/bids/utils";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  initialValues?: ApplicationDecoration;
}

export const DecorationModal: FC<Props> = ({
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
        // If editing, use provided decoration values directly
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
      const currentDecorations = parentForm.getFieldValue("decorations") || [];

      if (initialValues) {
        // Update existing decoration
        const updatedDecorations = currentDecorations.map(
          (decoration: ApplicationDecoration) =>
            decoration._uid === initialValues._uid
              ? { ...formValues }
              : decoration,
        );
        parentForm.setFieldsValue({
          decorations: updatedDecorations,
        });
      } else {
        // Add new decoration
        parentForm.setFieldsValue({
          decorations: [
            ...currentDecorations,
            {
              ...formValues,
              _uid: formValues._uid || getRandomId("decoration_"),
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

        {decorationFormFields.map(renderFormItem)}
      </Form>
    </Modal>
  );
};
