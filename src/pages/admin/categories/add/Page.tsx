import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CategoryAddForm } from "@/features/admin/categories";

export default function CategoryAddPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const breadcrumb = [
    {
      label: t("adminModule.navigation.categories"),
      link: "/admin/categories",
      icon: "tags",
    },
    { label: t("common.navigation.add") },
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
      <CategoryAddForm
        open={true}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
