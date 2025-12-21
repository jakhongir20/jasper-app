import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import {
  ProductForm,
  useDeleteProductImage,
  useProductDetail,
  useUpdateProduct,
} from "@/features/admin/products";
import { CAddHeader, ErrorState, LoadingState } from "@/shared/ui";
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
    onError: (error: any) => {
      console.error("Update product error:", error?.response?.data || error);
      toast(t("toast.errorUpdate"), "error");
    },
  });

  const deleteImageMutation = useDeleteProductImage({
    mutation: {
      onSuccess: () => {
        toast(t("toast.delete.success"), "success");
      },
      onError: () => {
        toast(t("toast.delete.error"), "error");
      },
    },
  });

  const handleDeleteImage = async (productImageId: number): Promise<void> => {
    await deleteImageMutation.mutateAsync({
      params: { product_image_id: productImageId },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (product) {
        // Format images - only send NEW images (with preview/base64)
        // Existing images are already on server, no need to re-upload
        const newImages =
          values.product_images
            ?.filter((file: any) => file.preview) // Only new uploads
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

        // Only send fields that the API accepts
        updateProductMutation.mutate({
          productId: product.product_id,
          payload: {
            name: values.name,
            product_type,
            measurement_unit: values.measurement_unit,
            product_images: newImages,
            price_uzs: values.price_uzs,
            price_usd: values.price_usd,
            category_id: values.category_id,
            frame_thickness: values.frame_thickness,
            frame_width: values.frame_width,
            under_frame_height: values.under_frame_height,
            percent_trim: values.percent_trim,
            percent_molding: values.percent_molding,
            percent_covering_primary: values.percent_covering_primary,
            percent_covering_secondary: values.percent_covering_secondary,
            percent_color: values.percent_color,
            percent_extra_option: values.percent_extra_option,
            product_resource_unions: [],
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
    measurement_unit: product.measurement_unit, // Old API uses 'measure'
    product_images:
      product.product_images?.map((img: any, index: number) => ({
        uid: String(img.product_image_id || `-${index}`),
        name: `image-${index}.png`,
        status: "done",
        url: img.image_url,
        assignment: img.assignment, // Preserve assignment for existing images
        product_image_id: img.product_image_id, // Preserve for deletion
      })) || [],
    price_uzs: product.price_uzs,
    price_usd: product.price_usd,
    category_id: product.category?.category_id, // Extract from nested category object
    category: product.category,
    frame_thickness: product.frame_thickness || 0,
    frame_width: product.frame_width || 0,
    under_frame_height: product.under_frame_height || 0,
    percent_trim: product.percent_trim || 0,
    percent_molding: product.percent_molding || 0,
    percent_covering_primary: product.percent_covering_primary || 0,
    percent_covering_secondary: product.percent_covering_secondary || 0,
    percent_color: product.percent_color || 0,
    percent_extra_option: product.percent_extra_option || 0,
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
        <ProductForm product={product} onImageDelete={handleDeleteImage} />
      </Form>
    </div>
  );
}
