import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import OrganizationEdit from "@/features/crm/organizations/crud/OrganizationEdit";

export default function PartnerAddPage() {
  const { t } = useTranslation();

  const breadcrumb = [
    {
      label: t("crmModule.navigation.organization"),
      link: "/crm/organizations",
      icon: "handshake",
    },
    { label: t("crmModule.navigation.edit") },
  ];

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>
      <OrganizationEdit />
    </div>
  );
}
