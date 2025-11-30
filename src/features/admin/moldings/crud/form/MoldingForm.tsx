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
          name="order_number"
          label={t("common.labels.order")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput
            placeholder={t("common.placeholder.order")}
            min={0}
            max={999999}
          />
        </Form.Item>
      </div>

      {/* Doorway Type */}
      <Form.Item
        name="doorway_type"
        label={t("common.labels.doorwayType")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <NumberInput
          placeholder={t("common.labels.doorwayType")}
          min={0}
          max={999}
        />
      </Form.Item>

      {/* Image Upload */}
      <Form.Item
        name="framework_image"
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

      {/* Frame and Filler Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">
          {t("common.labels.frameFillerOptions")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            name="is_frame"
            valuePropName="checked"
            label={t("common.labels.isFrame")}
            rules={[{ required: true, message: t("common.validation.required") }]}
          >
            <CSwitch />
          </Form.Item>

          <Form.Item
            name="is_filler"
            valuePropName="checked"
            label={t("common.labels.isFiller")}
            rules={[{ required: true, message: t("common.validation.required") }]}
          >
            <CSwitch />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};
