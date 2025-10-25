import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { BidsEditForm } from "@/features/dashboard/bids/crud/form/BidsEditForm";
import { BreadcrumbItem } from "@/shared/types";

export default function Page() {
  const { t } = useTranslation();

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("navigation.bids"),
      link: "/dashboard/bids",
      icon: "file",
    },
    { label: t("bids.edit.title") },
  ];

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>

      <BidsEditForm />

    </div>
  );
}
