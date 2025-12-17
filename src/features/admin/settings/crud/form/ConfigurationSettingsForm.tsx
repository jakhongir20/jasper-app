import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { Input, NumberInput } from "@/shared/ui";

interface Props {
  className?: string;
}

export const ConfigurationSettingsForm: FC<Props> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col px-4 gap-4 py-4", className)}>
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
          <Input placeholder={t("common.placeholder.hostingDomain")} />
        </Form.Item>

        <Form.Item
          name="molding_coefficient"
          label={t("common.labels.moldingCoefficient")}
        >
          <NumberInput min={0} step={0.01} placeholder={t("common.placeholder.moldingCoefficient")} />
        </Form.Item>
      </div>
    </div>
  );
};
