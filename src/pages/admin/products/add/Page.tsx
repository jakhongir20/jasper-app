import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { ProductForm } from "@/features/admin/products";
import { CAddHeader } from "@/shared/ui";
import { useCreateProduct } from "@/features/admin/products";
import { useToast } from "@/shared/hooks";

export default function Page() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const createProductMutation = useCreateProduct({
    onSuccess: () => {
      toast(t("toast.successCreate"), "success");
      navigate("/admin/products");
    },
    onError: (error) => {
      toast(t("toast.errorCreate"), "error");
    },
  });

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Format images according to ProductImageInputEntity
      const product_images =
        values.product_images
          ?.map((file: any) => {
            // For new uploads, use base64 with default assignment
            if (file.preview) {
              return {
                assignment: "one-sash-door", // Default assignment
                image_file: file.preview,
              };
            }
            // For existing images (shouldn't happen in create mode)
            if (file.url) {
              return {
                assignment: "one-sash-door",
                image_file: file.url,
              };
            }
            return null;
          })
          .filter(Boolean) || [];

      createProductMutation.mutate({
        ...values,
        product_images,
      });
    });
  };

  return (
    <div className="px-10">
      <CAddHeader
        mode="add"
        title={t("common.product.add")}
        loading={createProductMutation.isPending}
        onSave={handleSave}
      />
      <Form form={form} layout="vertical">
        <ProductForm mode="create" />
      </Form>
    </div>
  );
}
