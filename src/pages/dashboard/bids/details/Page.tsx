import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { DetailsContent } from "@/features/dashboard/bids/details/DetailsContent";
import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useApplicationDetail } from "@/features/dashboard/bids/model";
import { BreadcrumbItem } from "@/shared/types";

function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string; }>();
  const { data, isLoading } = useApplicationDetail(String(id));

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("navigation.bids"),
      link: "/dashboard/bids",
      icon: "file",
    },
    { label: data?.customer_name || data?.unique_id },
  ];

  if (isLoading || !data) return null;

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>

      <DetailsContent data={data} isLoading={isLoading} />
    </div>
  );
}

export default Page;
