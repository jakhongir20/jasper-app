import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { Input, NumberInput, CSwitch } from "@/shared/ui";
import { ImageUpload } from "@/shared/ui/imageUpload";
import { Molding } from "@/features/admin/moldings/model";

interface Props {
  className?: string;
  initialValues?: Partial<Molding>;
  isEdit?: boolean;
}

export const MoldingForm: FC<Props> = ({
  className,
  initialValues,
  isEdit = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col gap-4 py-4", className)}>
      {/* Basic Information */}
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-2">
        <Form.Item
          name="name"
          label={t("common.labels.name")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.name")} />
        </Form.Item>

        <Form.Item
          name="order"
          label={t("common.labels.order")}
          initialValue={0}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput
            placeholder={t("common.placeholder.order")}
            min={0}
            max={999999}
          />
        </Form.Item>
      </div>

      {/* Image Upload */}
      <Form.Item
        name="molding_image"
        label={t("common.labels.image")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <ImageUpload
          label={t("common.labels.uploadImage")}
          buttonText={t("common.button.uploadImage")}
          maxSize={5}
          allowedFormats={["image/png", "image/jpeg", "image/jpg"]}
          onChange={(value) => {
            // This will be handled by Form.Item automatically
          }}
        />
      </Form.Item>

      {/* Trim Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">
          {t("common.labels.trimOptions")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            name="has_up_trim"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.hasUpTrim")}
          >
            <CSwitch />
          </Form.Item>

          <Form.Item
            name="has_under_trim"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.hasUnderTrim")}
          >
            <CSwitch />
          </Form.Item>

          <Form.Item
            name="has_crown"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.hasCrown")}
          >
            <CSwitch />
          </Form.Item>
        </div>
      </div>

      {/* Height Coefficients */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">
          {t("common.labels.heightCoefficients")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            name="height_minus_coefficient"
            label={t("common.labels.heightMinusCoefficient")}
            initialValue={0}
          >
            <NumberInput placeholder="0" min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="height_plus_coefficient"
            label={t("common.labels.heightPlusCoefficient")}
            initialValue={0}
          >
            <NumberInput placeholder="0" min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="is_height_coefficient_applicable"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.isHeightCoefficientApplicable")}
          >
            <CSwitch />
          </Form.Item>

          <Form.Item
            name="height_coefficient_use_case"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.heightCoefficientUseCase")}
          >
            <CSwitch />
          </Form.Item>

          <Form.Item
            name="is_height_coefficient_double"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.isHeightCoefficientDouble")}
          >
            <CSwitch />
          </Form.Item>
        </div>
      </div>

      {/* Width Coefficients */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">
          {t("common.labels.widthCoefficients")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            name="width_minus_coefficient"
            label={t("common.labels.widthMinusCoefficient")}
            initialValue={0}
          >
            <NumberInput placeholder="0" min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="width_plus_coefficient"
            label={t("common.labels.widthPlusCoefficient")}
            initialValue={0}
          >
            <NumberInput placeholder="0" min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="is_width_coefficient_applicable"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.isWidthCoefficientApplicable")}
          >
            <CSwitch />
          </Form.Item>

          <Form.Item
            name="width_coefficient_use_case"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.widthCoefficientUseCase")}
          >
            <CSwitch />
          </Form.Item>

          <Form.Item
            name="is_width_coefficient_double"
            valuePropName="checked"
            initialValue={false}
            label={t("common.labels.isWidthCoefficientDouble")}
          >
            <CSwitch />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};
