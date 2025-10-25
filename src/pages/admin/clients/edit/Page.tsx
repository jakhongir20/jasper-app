import {
  Breadcrumb,
  ContentWrapper,
  LoadingState,
  ErrorState,
} from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CustomerEditForm } from "@/features/admin/customers/crud/form/CustomerEditForm";
import { useCustomerGetCustomerGet } from "@/shared/lib/api";

export default function CustomerEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { guid: id } = useParams<{ guid: string }>();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const { data: customer, isLoading } = useCustomerGetCustomerGet(
    { customer_id: Number(id) },
    {
      query: {
        enabled: !!id,
      },
    },
  );

  const breadcrumb = [
    {
      label: t("admin.navigation.customers"),
      link: "/admin/clients",
      icon: "users",
    },
    { label: t("common.navigation.edit") },
  ];

  const handleSuccess = () => {
    navigate("/admin/clients");
  };

  const handleCancel = () => {
    navigate("/admin/clients");
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

  if (!customer) {
    return (
      <div>
        <ContentWrapper>
          <Breadcrumb breadcrumb={breadcrumb} />
        </ContentWrapper>
        <ErrorState
          type="notFound"
          title={t("common.messages.customerNotFound")}
          description={t("common.messages.customerNotFound")}
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

      <CustomerEditForm
        open={isFormOpen}
        customer={customer || null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
