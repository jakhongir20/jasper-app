import type { FC } from "react";
import { useState } from "react";

import { Tabs } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { ApplicationGeneralInfo } from "@/features/dashboard/bids/details/tabs/TabTableProducts";
import { ApplicationCalc } from "@/features/dashboard/bids/details/tabs/ApplicationCalc";
import { CalculationResults } from "@/features/dashboard/bids/details/tabs/CalculationResults";
import { ApplicationDetail } from "@/features/dashboard/bids/details/index";

interface Props {
  application: ApplicationDetail;
  id: number;
}

export const ApplicationDetailsTabs: FC<Props> = ({ application, id }) => {
  const { t } = useTranslation();
  const [forecastData, setForecastData] = useState<ApplicationDetail | null>(null);

  const tabs = [
    {
      key: "1",
      label: t("tabs.generalInfo"),
      children: <ApplicationGeneralInfo application={application} id={id} />,
    },
    {
      key: "2",
      label: t("tabs.summary"),
      disabled: false,
      children: (
        <ApplicationCalc
          application={application}
          id={id}
          onForecastDataUpdate={setForecastData}
        />
      ),
    },
    {
      key: "3",
      label: t("tabs.calculationResults"),
      children: forecastData ? (
        <CalculationResults application={forecastData} />
      ) : (
        <div className="p-8 text-center text-gray-500">
          {t("common.messages.calculate_first")}
        </div>
      ),
    },
  ];

  return <Tabs items={tabs} activeTabKey={"1"} />;
};
