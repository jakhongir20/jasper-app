import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { ProductForm } from "@/features/admin/products";
import { useProductDetail, useUpdateProduct } from "@/features/admin/products";
import { CAddHeader, LoadingState, ErrorState } from "@/shared/ui";
import { useToast } from "@/shared/hooks";

export default function Page() {
  const { guid: productId } = useParams<{ guid: string }>();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: product, isLoading } = useProductDetail(Number(productId));

  const updateProductMutation = useUpdateProduct({
    onSuccess: () => {
      toast(t("toast.successUpdate"), "success");
      navigate("/admin/products");
    },
    onError: (error) => {
      toast(t("toast.errorUpdate"), "error");
    },
  });

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (product) {
        // Extract base64 images from file list
        const product_images = values.product_images?.map((file: any) => {
          // If file has preview (new upload), use preview as base64
          if (file.preview) {
            return file.preview;
          }
          // If file has url (existing image), keep url
          if (file.url) {
            return file.url;
          }
          return null;
        }).filter(Boolean) || [];

        updateProductMutation.mutate({
          productId: product.product_id,
          payload: {
            ...values,
            product_images, // Array of base64 or URLs
          },
        });
      }
    });
  };

  if (isLoading) {
    return <LoadingState className="min-h-96" />;
  }

  if (!product) {
    return (
      <ErrorState
        type="notFound"
        title={t("common.messages.productNotFound")}
        description={t("common.messages.productNotFound")}
        className="min-h-96"
      />
    );
  }

  // Transform product data to match form field names
  const formInitialValues = {
    product_id: product.product_id,
    created_at: product.created_at,
    name: product.name,
    product_type: product.product_type,
    measurement_unit: product.measure, // Old API uses 'measure'
    product_images: product.product_images?.map((img: any, index: number) => ({
      uid: img.image_id || `-${index}`,
      name: `image-${index}.png`,
      status: 'done',
      url: img.url || img.image_url,
    })) || [],
    price_uzs: product.price_uzs,
    price_usd: product.price_usd,
    category_id: product.category_id,
    category: product.category,
    frame_thickness: 0, // Default values for new fields
    frame_width: 0,
    under_frame_height: product.up_under_trim_height || 0,
    percent_trim: 0,
    percent_molding: 0,
    percent_covering_primary: 0,
    percent_covering_secondary: 0,
    percent_color: 0,
    percent_extra_option: 0,
  };

  return (
    <div className="px-10">
      <CAddHeader
        mode="edit"
        title={t("common.product.edit")}
        loading={updateProductMutation.isPending}
        onSave={handleSave}
      />

      <Form form={form} layout="vertical" initialValues={formInitialValues}>
        <ProductForm mode="edit" product={product} />
      </Form>
    </div>
  );
}
