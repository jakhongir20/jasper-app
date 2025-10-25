import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { DetailsContent } from "@/features/crm/organizations/details/DetailsContent";
import { useOrganizationDetail } from "@/features/crm/organizations/model/organization.queries";
import { Breadcrumb, ContentWrapper } from "@/shared/ui";

export default function Page() {
  const { t } = useTranslation();
  const { guid } = useParams<{ guid: string }>();
  const { data, isLoading } = useOrganizationDetail(guid || "");

  const breadcrumb = [
    {
      label: t("crmModule.navigation.organization"),
      link: "/crm/organizations",
      icon: "handshake",
    },
    { label: data?.code || "N/A" },
  ];

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>
      <DetailsContent data={data} isLoading={isLoading} />
    </div>
  );
}
