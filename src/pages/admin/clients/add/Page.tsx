import { Breadcrumb, ContentWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { CustomerAddForm } from "@/features/admin/customers/crud/form/CustomerAddForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CustomerAddPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const breadcrumb = [
    {
      label: t("admin.navigation.customers"),
      link: "/admin/clients",
      icon: "users",
    },
    { label: t("common.navigation.add") },
  ];

  const handleSuccess = () => {
    navigate("/admin/clients");
  };

  const handleCancel = () => {
    navigate("/admin/clients");
  };

  return (
    <div>
      <ContentWrapper>
        <Breadcrumb breadcrumb={breadcrumb} />
      </ContentWrapper>

      <CustomerAddForm
        open={isFormOpen}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}