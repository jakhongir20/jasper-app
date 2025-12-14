import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { Product } from "@/features/admin/products";
import { ContentInner, Input, NumberInput, Select } from "@/shared/ui";
import { MultipleImageUpload } from "@/shared/ui/imageUpload";
import { useCategoriesList } from "@/features/admin/categories/model/category.queries";
import { PRODUCT_TYPES } from "@/features/dashboard/bids/crud/tabs/TransactionForm";

interface ProductFormProps {
  product?: Product;
  onImageDelete?: (productImageId: number) => Promise<void>;
}

export const ProductForm = ({ product, onImageDelete }: ProductFormProps) => {
  const { t } = useTranslation();
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategoriesList();

  return (
    <ContentInner>
      {/* Pricing and Category - First Row (most important fields) */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Form.Item
          name="price_usd"
          label={t("common.input.priceUSD")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput min={0} placeholder={t("common.placeholder.priceUSD")} />
        </Form.Item>

        <Form.Item name="price_uzs" label={t("common.input.priceUZS")}>
          <NumberInput min={0} placeholder={t("common.placeholder.priceUZS")} />
        </Form.Item>

        <Form.Item
          name="category_id"
          label={t("common.input.category")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Select
            placeholder={t("common.placeholder.category")}
            loading={isCategoriesLoading}
            options={categories?.results?.map((category) => ({
              value: category.category_id,
              label: category.name,
            }))}
          />
        </Form.Item>
      </div>

      {/* Basic Information - Second Row */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Form.Item
          name="name"
          label={t("common.input.name")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.productName")} />
        </Form.Item>

        <Form.Item name="product_type" label={t("common.input.type")}>
          <Select
            placeholder={t("common.placeholder.productType")}
            allowClear
            options={PRODUCT_TYPES}
          />
        </Form.Item>

        <Form.Item
          name="measurement_unit"
          label={t("common.input.measure")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.measure")} />
        </Form.Item>
      </div>

      {/* Multiple Images Upload */}
      <div className="mb-8">
        <Form.Item
          name="product_images"
          label={t("common.labels.images")}
          valuePropName="value"
          getValueFromEvent={(fileList) => fileList}
        >
          <MultipleImageUpload
            maxCount={10}
            maxSize={5}
            allowedFormats={["image/png", "image/jpeg", "image/jpg"]}
            productId={product?.product_id}
            onImageDelete={onImageDelete}
            showAssignment
          />
        </Form.Item>
      </div>

      {/* Frame Dimensions - Third Row */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Form.Item
          name="frame_thickness"
          label={t("common.labels.frameThickness")}
        >
          <NumberInput
            min={0}
            step={0.01}
            placeholder={t("common.placeholder.frameThickness")}
          />
        </Form.Item>

        <Form.Item name="frame_width" label={t("common.labels.frameWidth")}>
          <NumberInput
            min={0}
            step={0.01}
            placeholder={t("common.placeholder.frameWidth")}
          />
        </Form.Item>

        <Form.Item
          name="under_frame_height"
          label={t("common.labels.underFrameHeight")}
        >
          <NumberInput
            min={0}
            step={0.01}
            placeholder={t("common.placeholder.underFrameHeight")}
          />
        </Form.Item>
      </div>

      {/* Percentages - Fourth Row */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Form.Item name="percent_trim" label={t("common.labels.percentTrim")}>
          <NumberInput
            min={0}
            max={100}
            step={0.01}
            placeholder={t("common.placeholder.percentTrim")}
          />
        </Form.Item>

        <Form.Item
          name="percent_molding"
          label={t("common.labels.percentMolding")}
        >
          <NumberInput
            min={0}
            max={100}
            step={0.01}
            placeholder={t("common.placeholder.percentMolding")}
          />
        </Form.Item>

        <Form.Item
          name="percent_covering_primary"
          label={t("common.labels.percentCoveringPrimary")}
        >
          <NumberInput
            min={0}
            max={100}
            step={0.01}
            placeholder={t("common.placeholder.percentCoveringPrimary")}
          />
        </Form.Item>
      </div>

      {/* More Percentages - Fifth Row */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Form.Item
          name="percent_covering_secondary"
          label={t("common.labels.percentCoveringSecondary")}
        >
          <NumberInput
            min={0}
            max={100}
            step={0.01}
            placeholder={t("common.placeholder.percentCoveringSecondary")}
          />
        </Form.Item>

        <Form.Item name="percent_color" label={t("common.labels.percentColor")}>
          <NumberInput
            min={0}
            max={100}
            step={0.01}
            placeholder={t("common.placeholder.percentColor")}
          />
        </Form.Item>

        <Form.Item
          name="percent_extra_option"
          label={t("common.labels.percentExtraOption")}
        >
          <NumberInput
            min={0}
            max={100}
            step={0.01}
            placeholder={t("common.placeholder.percentExtraOption")}
          />
        </Form.Item>
      </div>
    </ContentInner>
  );
};
