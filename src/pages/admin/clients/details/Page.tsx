import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { CustomerDetails } from "@/features/admin/customers";
import { useCustomerGetCustomerGet } from "@/shared/lib/api";
import {
  Breadcrumb,
  ContentWrapper,
  LoadingState,
  ErrorState,
} from "@/shared/ui";
import { BreadcrumbItem } from "@/shared/types";

export default function CustomerDetailsPage() {
  const { t } = useTranslation();
  const { guid } = useParams<{ guid: string }>();
  const customerId = parseInt(guid || "0");
  const { data: customer, isLoading } = useCustomerGetCustomerGet(
    { customer_id: customerId },
    {
      query: {
        enabled: !!customerId,
      },
    },
  );

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: t("admin.navigation.customers"),
      link: "/admin/clients",
      icon: "users",
    },
    { label: customer?.name || "N/A" },
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
      <CustomerDetails customer={customer} />
    </div>
  );
}
