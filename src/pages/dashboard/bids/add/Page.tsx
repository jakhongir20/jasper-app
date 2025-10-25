import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { BidsAddForm } from "@/features/dashboard/bids/crud/form/BidsAddForm";
import { BreadcrumbItem } from "@/shared/types";

export default function Page() {
  const { t } = useTranslation();

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("navigation.bids"),
      link: "/dashboard/bids",
      icon: "file",
    },
    { label: t("bids.add.title") },
  ];

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>

      <BidsAddForm />
    </div>
  );
}
