import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { UserEditForm } from "@/features/admin/users";
import { BreadcrumbItem } from "@/shared/types";

export default function UserEditPage() {
  const { t } = useTranslation();

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("adminModule.navigation.users"),
      link: "/admin/users",
      icon: "users",
    },
    { label: t("adminModule.navigation.edit") },
  ];

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>

      <UserEditForm />
    </div>
  );
}
