import { Breadcrumb, ContentInner, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import UserAddForm from "@/features/admin/users/crud/form/UserAddForm";
import { BreadcrumbItem } from "@/shared/types";

export default function PartnerAddPage() {
  const { t } = useTranslation();

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("adminModule.navigation.users"),
      link: "/admin/users",
      icon: "users",
    },
    { label: t("adminModule.navigation.add") },
  ];

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>

      <ContentInner>
        <UserAddForm />
      </ContentInner>
    </div>
  );
}
