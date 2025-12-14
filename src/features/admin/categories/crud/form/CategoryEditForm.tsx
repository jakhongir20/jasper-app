import { Form, Spin } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal, Select } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminCategoryReadOneAdminCategoryGet } from "@/shared/lib/api/generated/gateway/categories/categories";
import { useCategoriesList, useUpdateCategory } from "../../model";

interface Props {
  open: boolean;
  categoryId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CategoryEditForm: FC<Props> = ({
  open,
  categoryId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useCategoriesList();
  const categories = categoriesData?.results || [];

  // Fetch category details when modal opens
  const { data: categoryData, isLoading: isCategoryLoading } =
    useAdminCategoryReadOneAdminCategoryGet(
      { category_id: categoryId! },
      {
        query: {
          enabled: open && !!categoryId,
        },
      },
    );

  const { mutate, isPending: isLoading } = useUpdateCategory({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/admin/category"],
      });
      showGlobalToast(t("common.messages.categoryUpdated"), "success");
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
    if (categoryData && open) {
      form.setFieldsValue({
        name: categoryData.name,
        section_index: categoryData.section_index,
      });
    }
  }, [categoryData, open, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (categoryId) {
        mutate({
          category_id: categoryId,
          name: values.name,
          section_index: values.section_index || null,
        });
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Filter out current category and its descendants from parent options
  const availableParentCategories = categories.filter(
    (cat) => cat.category_id !== categoryId,
  );

  return (
    <Modal
      title={t("common.labels.editCategory")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isLoading}
      saveBtnText={t("common.button.save")}
      cancelText={t("common.button.cancel")}
      size="middle"
      form={form}
    >
      {isCategoryLoading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Form.Item
            name="name"
            label={t("common.labels.name")}
            rules={[{ required: true, message: t("common.validation.required") }]}
          >
            <Input placeholder={t("common.placeholder.categoryTitle")} />
          </Form.Item>

          <Form.Item name="section_index" label={t("common.labels.section")}>
            <Select
              placeholder={t("Выберите раздел")}
              options={availableParentCategories.map((cat) => ({
                value: cat.category_id,
                label: cat.name,
              }))}
            />
          </Form.Item>
        </div>
      )}
    </Modal>
  );
};
