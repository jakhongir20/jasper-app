import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { type FC } from "react";
import { useTranslation } from "react-i18next";

import { TabInfoForm } from "@/features/dashboard/bids/crud";
import { ContentInner, Tabs } from "@/shared/ui";
import { TabTransactionsForm } from "@/features/dashboard/bids/crud/tabs/TabTransactionsForm";
import { TabAspectsForm } from "@/features/dashboard/bids/crud/tabs/TabAspectsForm";
// import { TabSheathingsForm } from "@/features/dashboard/bids/crud/tabs/TabSheathingsForm";
import { TabServicesForm } from "@/features/dashboard/bids/crud/tabs/TabServicesForm";
import { TabQualitiesForm } from "@/features/dashboard/bids/crud/tabs/TabQualitiesForm";
import { TransactionContent } from "@/features/dashboard/bids/crud/tabs/TransactionContent";

interface Props {
  activeTabKey?: string;
  mode: "add" | "edit";
  onChangeTab?: (key: string) => void;
  formFinishErrors: ValidateErrorEntity["errorFields"];
  isLoadingDetail?: boolean;
}

export const BidsTab: FC<Props> = ({ mode, isLoadingDetail }) => {
  const { t } = useTranslation();

  const tabs = [
    {
      key: "1",
      label: t("bids.tabs.general"),
      children: (
        <ContentInner>
          <TabInfoForm />
        </ContentInner>
      ),
    },
    {
      key: "2",
      label: t("bids.tabs.transactions"),
      children: (
        <ContentInner>
          <TransactionContent key={String(isLoadingDetail)} mode={mode} />
          <TabTransactionsForm key={String(isLoadingDetail)} mode={mode} />
        </ContentInner>
      ),
    },
    {
      key: "3",
      label: t("bids.tabs.aspects"),
      children: (
        <ContentInner>
          <TabAspectsForm key={String(isLoadingDetail)} mode={mode} />
        </ContentInner>
      ),
    },
    // {
    //   key: "4",
    //   label: t("bids.tabs.sheathings"),
    //   children: (
    //     <ContentInner>
    //       <TabSheathingsForm key={String(isLoadingDetail)} mode={mode} />
    //     </ContentInner>
    //   ),
    // },
    // {
    //   key: "5",
    //   label: t("bids.tabs.baseboards"),
    //   children: (
    //     <ContentInner>
    //       <TabBaseboardsForm key={String(isLoadingDetail)} mode={mode} />
    //     </ContentInner>
    //   ),
    // },
    // {
    //   key: "6",
    //   label: t("bids.tabs.floors"),
    //   children: (
    //     <ContentInner>
    //       <TabFloorsForm key={String(isLoadingDetail)} mode={mode} />
    //     </ContentInner>
    //   ),
    // },
    // {
    //   key: "7",
    //   label: t("bids.tabs.windowsills"),
    //   children: (
    //     <ContentInner>
    //       <TabWindowsillsForm key={String(isLoadingDetail)} mode={mode} />
    //     </ContentInner>
    //   ),
    // },
    // {
    //   key: "8",
    //   label: t("bids.tabs.lattings"),
    //   children: (
    //     <ContentInner>
    //       <TabLattingsForm key={String(isLoadingDetail)} mode={mode} />
    //     </ContentInner>
    //   ),
    // },
    // {
    //   key: "9",
    //   label: t("bids.tabs.frameworks"),
    //   children: (
    //     <ContentInner>
    //       <TabFrameworksForm key={String(isLoadingDetail)} mode={mode} />
    //     </ContentInner>
    //   ),
    // },
    // {
    //   key: "10",
    //   label: t("bids.tabs.decorations"),
    //   children: (
    //     <ContentInner>
    //       <TabDecorationsForm key={String(isLoadingDetail)} mode={mode} />
    //     </ContentInner>
    //   ),
    // },
    {
      key: "11",
      label: t("bids.tabs.services"),
      children: (
        <ContentInner>
          <TabServicesForm key={String(isLoadingDetail)} mode={mode} />
        </ContentInner>
      ),
    },
    {
      key: "12",
      label: t("bids.tabs.qualities"),
      children: (
        <ContentInner>
          <TabQualitiesForm key={String(isLoadingDetail)} mode={mode} />
        </ContentInner>
      ),
    },
  ];

  return <Tabs items={tabs} />;
};
