import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal, Select } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateCategory, useCategoriesList } from "../../model";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CategoryAddForm: FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useCategoriesList();
  const categories = categoriesData?.results || [];

  const { mutate, isPending: isLoading } = useCreateCategory({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableData"],
      });
      showGlobalToast(t("common.messages.categoryCreated"), "success");
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        name: values.name,
        section_index: values.section_index || null,
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("common.labels.addCategory")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isLoading}
      saveBtnText={t("common.button.save")}
      cancelText={t("common.button.cancel")}
      size="middle"
      form={form}
    >
      <div className="flex flex-col gap-4">
        <Form.Item
          name="name"
          label={t("common.labels.name")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.category")} />
        </Form.Item>

        <Form.Item name="section_index" label={t("common.labels.section")}>
          <Select
            placeholder={t("common.placeholder.section")}
            options={categories.map((cat) => ({
              value: cat.category_id,
              label: cat.name,
            }))}
          />
        </Form.Item>
      </div>
    </Modal>
  );
};
