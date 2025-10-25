import {
  Breadcrumb,
  ContentWrapper,
  LoadingState,
  ErrorState,
} from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { CategoryEditForm } from "@/features/admin/categories";
import { useCategoryDetail } from "@/features/admin/categories/model";

export default function CategoryEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { guid } = useParams<{ guid: string }>();
  const categoryId = parseInt(guid || "0");
  const { data: category, isLoading } = useCategoryDetail(categoryId);

  const breadcrumb = [
    {
      label: t("adminModule.navigation.categories"),
      link: "/admin/categories",
      icon: "tags",
    },
    { label: t("common.navigation.edit") },
  ];

  const handleSuccess = () => {
    navigate("/admin/categories");
  };

  const handleCancel = () => {
    navigate("/admin/categories");
  };

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
      <CategoryEditForm
        open={true}
        category={category}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
