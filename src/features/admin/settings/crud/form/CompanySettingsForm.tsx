import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { Input, InputPhone } from "@/shared/ui";
import { validatePhone } from "@/shared/utils/validations";

interface Props {
  className?: string;
}

export const CompanySettingsForm: FC<Props> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col gap-4 px-4 py-4", className)}>
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-2">
        <Form.Item
          name="display_name"
          label={t("common.labels.companyName")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.displayName")} />
        </Form.Item>

        <Form.Item
          name="legal_name"
          label={t("common.labels.legalName")}
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <Input placeholder={t("common.placeholder.legalName")} />
        </Form.Item>

        <Form.Item
          name="company_phone_number"
          label={t("common.labels.phone")}
          rules={[{ validator: validatePhone }]}
          validateTrigger={["onBlur", "onSubmit"]}
        >
          <InputPhone placeholder={t("common.placeholder.phone")} />
        </Form.Item>
      </div>
    </div>
  );
};
