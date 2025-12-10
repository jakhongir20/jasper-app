import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { ProductForm } from "@/features/admin/products";
import {
  useProductDetail,
  useUpdateProduct,
  useDeleteProductImage,
} from "@/features/admin/products";
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
    onError: () => {
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

  const handleDeleteImage = async (productImageId: number) => {
    return deleteImageMutation.mutateAsync({
      params: { product_image_id: productImageId },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (product) {
        // Format images according to ProductImageInputEntity
        const product_images =
          values.product_images
            ?.map((file: any) => {
              // For new uploads (has preview), use base64 with assignment from select (or default)
              if (file.preview) {
                return {
                  assignment: file.assignment || "one-sash-door",
                  image_file: file.preview,
                };
              }
              // For existing images (has url), preserve their assignment
              if (file.url) {
                return {
                  assignment: file.assignment || "one-sash-door",
                  image_file: file.url,
                };
              }
              return null;
            })
            .filter(Boolean) || [];

        // Only send fields that the API accepts
        updateProductMutation.mutate({
          productId: product.product_id,
          payload: {
            name: values.name,
            product_type: values.product_type,
            measurement_unit: values.measurement_unit,
            product_images,
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
    under_frame_height: product.up_under_trim_height || 0,
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
        <ProductForm
          mode="edit"
          product={product}
          onImageDelete={handleDeleteImage}
        />
      </Form>
    </div>
  );
}
