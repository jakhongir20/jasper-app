import { type FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: any;
  isLoading: boolean;
}

export const DetailsContent: FC<Props> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-lg text-red-500">Organization not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">
        {t("common.labels.organizationDetails")}
      </h2>
      <p className="text-gray-600">{t("common.messages.comingSoon")}</p>
    </div>
  );
};

