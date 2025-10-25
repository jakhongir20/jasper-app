import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { Product } from "@/features/admin/products";
import { ContentInner, Input, NumberInput, TextAreaInput } from "@/shared/ui";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

export const ProductForm = ({ product, mode }: ProductFormProps) => {
  const { t } = useTranslation();

  return (
    <ContentInner>
      {/* Basic Information - First Row */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
        <Form.Item
          name="name"
          label={t("common.input.name")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.productName")} />
        </Form.Item>

        <Form.Item
          name="product_type"
          label={t("common.input.type")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.productType")} />
        </Form.Item>

        <Form.Item
          name="measure"
          label={t("common.input.measure")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.measure")} />
        </Form.Item>
      </div>

      {/* Pricing - Second Row */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
        <Form.Item
          name="price_uzs"
          label={t("common.input.priceUZS")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput min={0} placeholder={t("common.placeholder.priceUZS")} />
        </Form.Item>

        <Form.Item
          name="price_usd"
          label={t("common.input.priceUSD")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput min={0} placeholder={t("common.placeholder.priceUSD")} />
        </Form.Item>

        <Form.Item
          name="category_id"
          label={t("common.input.category")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput min={1} placeholder={t("common.placeholder.category")} />
        </Form.Item>
      </div>

      {/* Features - Third Row */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
        <Form.Item
          name="crown_coefficient"
          label={t("common.input.crownCoefficient")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput
            min={0}
            placeholder={t("common.placeholder.crownCoefficient")}
          />
        </Form.Item>

        <Form.Item
          name="up_under_trim_height"
          label={t("common.input.trimHeight")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput
            min={0}
            placeholder={t("common.placeholder.trimHeight")}
          />
        </Form.Item>

        <Form.Item
          name="up_under_trim_width"
          label={t("common.input.trimWidth")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput
            min={0}
            placeholder={t("common.placeholder.trimWidth")}
          />
        </Form.Item>
      </div>

      {/* Feature Description - Full Width */}
      <div className="w-full">
        <Form.Item name="feature" label={t("common.input.feature")}>
          <TextAreaInput
            rows={3}
            placeholder={t("common.placeholder.feature")}
          />
        </Form.Item>
      </div>
    </ContentInner>
  );
};
