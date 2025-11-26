import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserDetails } from "@/features/admin/users";
import { useUserDetail } from "@/features/admin/users/model";
import {
  Breadcrumb,
  ContentWrapper,
  LoadingState,
  ErrorState,
} from "@/shared/ui";
import { BreadcrumbItem } from "@/shared/types";

export default function UserDetailsPage() {
  const { t } = useTranslation();
  const { guid } = useParams<{ guid: string; }>();
  const userId = parseInt(guid || "0");
  const { data: user, isLoading } = useUserDetail(userId);

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("adminModule.navigation.users"),
      link: "/admin/users",
      icon: "users",
    },
    {
      label:
        user?.name ||
        user?.unique_id ||
        user?.user_id?.toString() ||
        guid ||
        "N/A",
    },
  ];

  if (isLoading) {
    return (
      <div>
        <ContentWrapper>
          <Breadcrumb breadcrumb={breadcrumb} />
        </ContentWrapper>
        <LoadingState className="min-h-96" />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <ContentWrapper>
          <Breadcrumb breadcrumb={breadcrumb} />
        </ContentWrapper>
        <ErrorState
          type="notFound"
          title={t("common.messages.userNotFound")}
          description={t("common.messages.userNotFound")}
          className="min-h-96"
        />
      </div>
    );
  }

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>
      <UserDetails user={user} />
    </div>
  );
}
