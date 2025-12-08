import { Form, Tabs } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CompanySettingsForm,
  ConfigurationSettingsForm,
  useCompanyDetail,
  useConfigurationDetail,
  useUpdateCompany,
  useUpdateConfiguration,
} from "@/features/admin/settings";
import { ContentInner, CAddHeader } from "@/shared/ui";
import { showGlobalToast } from "@/shared/hooks";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [companyForm] = Form.useForm();
  const [configForm] = Form.useForm();

  const { data: company, isLoading: isLoadingCompany } = useCompanyDetail();
  const { data: config, isLoading: isLoadingConfig } = useConfigurationDetail();

  const { mutate: updateCompany, isPending: isUpdatingCompany } = useUpdateCompany({
    onSuccess: () => {
      showGlobalToast(t("common.messages.companyUpdated"), "success");
    },
    onError: (error: any) => {
      showGlobalToast(
        error?.response?.data?.message || t("common.messages.error"),
        "error",
      );
    },
  });

  const { mutate: updateConfig, isPending: isUpdatingConfig } = useUpdateConfiguration({
    onSuccess: () => {
      showGlobalToast(t("common.messages.configurationUpdated"), "success");
    },
    onError: (error: any) => {
      showGlobalToast(
        error?.response?.data?.message || t("common.messages.error"),
        "error",
      );
    },
  });

  useEffect(() => {
    if (company) {
      companyForm.setFieldsValue(company);
    }
  }, [company, companyForm]);

  useEffect(() => {
    if (config) {
      configForm.setFieldsValue(config);
    }
  }, [config, configForm]);

  const handleSaveCompany = () => {
    companyForm.validateFields().then((values) => {
      updateCompany(values);
    });
  };

  const handleSaveConfig = () => {
    configForm.validateFields().then((values) => {
      updateConfig(values);
    });
  };

  const tabs = [
    {
      key: "company",
      label: t("common.labels.company"),
      children: (
        <Form form={companyForm} layout="vertical">
          <CAddHeader
            mode="edit"
            title={t("common.labels.companySettings")}
            loading={isUpdatingCompany}
            onSave={handleSaveCompany}
          />
          <CompanySettingsForm />
        </Form>
      ),
    },
    {
      key: "configuration",
      label: t("common.labels.configuration"),
      children: (
        <Form form={configForm} layout="vertical">
          <CAddHeader
            mode="edit"
            title={t("common.labels.configurationSettings")}
            loading={isUpdatingConfig}
            onSave={handleSaveConfig}
          />
          <ConfigurationSettingsForm />
        </Form>
      ),
    },
  ];

  return (
    <ContentInner>
      <Tabs items={tabs} />
    </ContentInner>
  );
}
