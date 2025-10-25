import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";

export default function ProposalsAddPage() {
  const { t } = useTranslation();

  const breadcrumb = [
    {
      label: t("navigation.proposals"),
      link: "/dashboard/proposals",
      icon: "file",
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
          {t("common.labels.addProposal")}
        </h2>
        <p className="text-gray-600">{t("common.messages.comingSoon")}</p>
      </div>
    </div>
  );
}
