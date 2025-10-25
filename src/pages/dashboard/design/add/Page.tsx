import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";

export default function DesignAddPage() {
  const { t } = useTranslation();

  const breadcrumb = [
    {
      label: t("navigation.design"),
      link: "/dashboard/design",
      icon: "layout",
    },
    { label: t("common.navigation.add") },
  ];

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {t("common.labels.addDesign")}
        </h2>
        <p className="text-gray-600">{t("common.messages.comingSoon")}</p>
      </div>
    </div>
  );
}
