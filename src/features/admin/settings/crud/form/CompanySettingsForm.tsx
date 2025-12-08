import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { Input } from "@/shared/ui";

interface Props {
  className?: string;
}

export const CompanySettingsForm: FC<Props> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col px-4 gap-4 py-4", className)}>
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-2">
        <Form.Item
          name="name"
          label={t("common.labels.companyName")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.companyName")} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t("common.labels.phone")}
        >
          <Input placeholder={t("common.placeholder.phone")} />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("common.labels.email")}
          rules={[{ type: "email", message: t("common.validation.invalidEmail") }]}
        >
          <Input placeholder={t("common.placeholder.email")} />
        </Form.Item>

        <Form.Item
          name="address"
          label={t("common.labels.address")}
        >
          <Input placeholder={t("common.placeholder.address")} />
        </Form.Item>
      </div>
    </div>
  );
};
