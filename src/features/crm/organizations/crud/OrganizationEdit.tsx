import { type FC } from "react";
import { useTranslation } from "react-i18next";

export default function OrganizationEdit() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">
        {t("common.labels.editOrganization")}
      </h2>
      <p className="text-gray-600">{t("common.messages.comingSoon")}</p>
    </div>
  );
}

