import { Form, Radio } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { Input, NumberInput } from "@/shared/ui";
import { ImageUpload } from "@/shared/ui/imageUpload";

interface Props {
  className?: string;
}

export const ConfigurationSettingsForm: FC<Props> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col gap-4 px-4 py-4", className)}>
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-2">
        <Form.Item
          name="usd_rate"
          label={t("common.labels.usdRate")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <NumberInput min={0} placeholder={t("common.placeholder.usdRate")} />
        </Form.Item>

        <Form.Item
          name="hosting_domain"
          label={t("common.labels.hostingDomain")}
        >
          <Input disabled placeholder={t("common.placeholder.hostingDomain")} />
        </Form.Item>

        <Form.Item
          name="standard_box_width"
          label={t("common.labels.standardBoxWidth")}
        >
          <NumberInput
            min={0}
            placeholder={t("common.placeholder.standardBoxWidth")}
          />
        </Form.Item>

        <Form.Item
          name="percent_calculation_method"
          label={t("common.labels.percentCalculationMethod")}
        >
          <Radio.Group>
            <Radio value={1}>
              {
                "Последовательный расчёт (процент начисляется на результат предыдущего)"
              }
            </Radio>
            <Radio value={2}>
              {"Отдельный расчёт (проценты считаются независимо друг от друга)"}
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      <Form.Item name="pfp_file" label={t("common.labels.pfpFile")}>
        <ImageUpload
          label={t("common.labels.uploadImage")}
          buttonText={t("common.button.uploadImage")}
          maxSize={5}
          showDelete
          allowedFormats={["image/png", "image/jpeg", "image/jpg"]}
        />
      </Form.Item>
    </div>
  );
};
