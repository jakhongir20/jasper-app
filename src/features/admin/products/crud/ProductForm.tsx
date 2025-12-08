import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { Product } from "@/features/admin/products";
import { ContentInner, Input, NumberInput, Select } from "@/shared/ui";
import { MultipleImageUpload } from "@/shared/ui/imageUpload";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

export const ProductForm = ({ product, mode }: ProductFormProps) => {
  const { t } = useTranslation();

  return (
    <ContentInner>
      {/* Read-only fields - shown only in edit mode */}
      {mode === "edit" && product && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
          <Form.Item name="product_id" label={t("common.input.productId")}>
            <Input disabled className="bg-gray-100" />
          </Form.Item>

          <Form.Item name="created_at" label={t("common.input.createdAt")}>
            <Input
              disabled
              className="bg-gray-100"
              value={
                product.created_at
                  ? new Date(product.created_at * 1000).toLocaleString()
                  : ""
              }
            />
          </Form.Item>

          <Form.Item name={["category", "name"]} label={t("common.input.categoryName")}>
            <Input disabled className="bg-gray-100" />
          </Form.Item>
        </div>
      )}

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
        >
          <Select
            placeholder={t("common.placeholder.productType")}
            options={[
              { value: "door-window", label: "ДО дверь" },
              { value: "door-deaf", label: "ДГ дверь" },
              { value: "transom", label: "Фрамуга" },
              { value: "doorway", label: "Обшивочный проём" },
              { value: "frame", label: "Наличник" },
              { value: "filler", label: "Нашельник" },
              { value: "crown", label: "Корона" },
              { value: "up_frame", label: "Надналичник" },
              { value: "under_frame", label: "Подналичник" },
              { value: "trim", label: "Обклад" },
              { value: "molding", label: "Молдинг" },
              { value: "covering_primary", label: "Покрытие I" },
              { value: "covering_secondary", label: "Покрытие II" },
              { value: "color", label: "Цвет" },
              { value: "floor_skirting", label: "Плинтус" },
              { value: "heated-floor", label: "Тёплый пол" },
              { value: "latting", label: "Обрешётка" },
              { value: "window", label: "Окно" },
              { value: "windowsill", label: "Подоконник" },
              { value: "glass", label: "Стекло" },
              { value: "door_lock", label: "Замок двери" },
              { value: "hinge", label: "Петля" },
              { value: "door_bolt", label: "Шпингалет" },
              { value: "door_stopper", label: "Стоппер" },
              { value: "anti_threshold", label: "Анти-порог" },
              { value: "box_width", label: "Ширина коробки" },
              { value: "extra_options", label: "Доп. опции" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="measurement_unit"
          label={t("common.input.measure")}
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
          />
        </Form.Item>
      </div>

      {/* Pricing - Second Row */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
        <Form.Item
          name="price_uzs"
          label={t("common.input.priceUZS")}
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

      {/* Frame Dimensions - Third Row */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
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

        <Form.Item
          name="frame_width"
          label={t("common.labels.frameWidth")}
        >
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
        <Form.Item
          name="percent_trim"
          label={t("common.labels.percentTrim")}
        >
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
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

        <Form.Item
          name="percent_color"
          label={t("common.labels.percentColor")}
        >
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
