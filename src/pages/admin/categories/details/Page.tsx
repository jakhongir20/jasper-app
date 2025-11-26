import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { CategoryDetails } from "@/features/admin/categories";
import { useCategoryDetail } from "@/features/admin/categories/model";
import {
  Breadcrumb,
  ContentWrapper,
  LoadingState,
  ErrorState,
} from "@/shared/ui";
import { BreadcrumbItem } from "@/shared/types";

export default function CategoryDetailsPage() {
  const { t } = useTranslation();
  const { guid } = useParams<{ guid: string; }>();
  const categoryId = parseInt(guid || "0");
  const { data: category, isLoading } = useCategoryDetail(categoryId);

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("adminModule.navigation.categories"),
      link: "/admin/categories",
      icon: "hashtag",
    },
    {
      label:
        category?.name || category?.category_id?.toString() || guid || "N/A",
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

  if (!category) {
    return (
      <div>
        <ContentWrapper>
          <Breadcrumb breadcrumb={breadcrumb} />
        </ContentWrapper>
        <ErrorState
          type="notFound"
          title={t("common.messages.categoryNotFound")}
          description={t("common.messages.categoryNotFound")}
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
      <CategoryDetails category={category} />
    </div>
  );
}
