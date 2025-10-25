import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, CInfo, Status } from "@/shared/ui";
import { cn } from "@/shared/helpers";
import { type CustomerOutputEntity } from "@/shared/lib/api";

interface Props {
  customer: CustomerOutputEntity;
  className?: string;
}

export const CustomerDetails: FC<Props> = ({ customer, className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/clients/edit/${customer.customer_id}`);
  };

  const handleBack = () => {
    navigate("/admin/clients");
  };

  return (
    <div className={cn("px-10", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-gray-900">
          {t("common.labels.customerDetails")}
        </h4>
        <div className="flex gap-4">
          <Button onClick={handleBack}>{t("common.button.back")}</Button>
          <Button type="primary" onClick={handleEdit}>
            {t("common.button.edit")}
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h5 className="mb-4 text-lg font-semibold text-gray-900">
          {t("common.labels.basicInformation")}
        </h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CInfo
            value={t("common.labels.id")}
            subValue={`#${customer.customer_id}`}
          />
          <CInfo
            value={t("common.labels.name")}
            subValue={customer.name || "-"}
          />
          <CInfo
            value={t("common.labels.phone")}
            subValue={customer.phone || "-"}
          />
          <CInfo
            value={t("common.labels.status")}
            subValue={<Status value={customer.is_active ? 1 : 0} />}
          />
        </div>
      </div>
    </div>
  );
};
