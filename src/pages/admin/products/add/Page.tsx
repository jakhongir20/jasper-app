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
    onError: (error: any) => {
      console.error("Create product error:", error?.response?.data || error);
      toast(t("toast.errorCreate"), "error");
    },
  });

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Format images according to ProductImageInputEntity
      const product_images =
        values.product_images
          ?.filter((file: any) => file.preview) // Only new uploads with base64
          .map((file: any) => ({
            assignment: file.assignment || "one-sash-door",
            image_file: file.preview,
          })) || [];

      // Valid product types according to API
      const validProductTypes = [
        "door-window",
        "door-deaf",
        "doorway",
        "window",
        "windowsill",
        "heated-floor",
        "latting",
      ];

      // Only send product_type if it's valid, otherwise send null
      const product_type = validProductTypes.includes(values.product_type)
        ? values.product_type
        : null;

      createProductMutation.mutate({
        ...values,
        product_type,
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
