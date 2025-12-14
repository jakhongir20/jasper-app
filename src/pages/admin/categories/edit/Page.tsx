import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { CategoryEditForm } from "@/features/admin/categories";

export default function CategoryEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { guid } = useParams<{ guid: string }>();
  const categoryId = parseInt(guid || "0") || null;

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

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>
      <CategoryEditForm
        open={true}
        categoryId={categoryId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
