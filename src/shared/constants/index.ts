import i18n from "@/app/i18n";
import {
  JobTypes,
  PaymentTypes,
  SalaryBillStatusTypes,
  SalaryTypes,
} from "@/shared/types";

export * from "./formats";
export * from "./settings";
const t = i18n.t;

/*
 * use it like this VVVVV
 *
 * jobTypes[JobTypes.FULL_TIME] OR jobTypes['backend_given_value']
 *
 * */

export const jobTypes: Record<JobTypes, string> = {
  1: t("salaryModule.workTime.fullTime"),
  2: t("salaryModule.workTime.partTime"),
  3: t("salaryModule.workTime.contract"),
};

export const paymentTypes: Record<PaymentTypes, string> = {
  1: t("salaryModule.paymentType.bank"),
  2: t("salaryModule.paymentType.cash"),
  3: t("salaryModule.paymentType.ePayment"),
  4: t("salaryModule.paymentType.paymentApps"),
};

export const salaryTypes: Record<SalaryTypes, string> = {
  1: t("salaryModule.salaryType.salary"),
  2: t("salaryModule.salaryType.bonus"),
  3: t("salaryModule.salaryType.debt"),
};

export const salaryBillStatusOptions: {
  value: SalaryBillStatusTypes;
  label: string;
}[] = [
  {
    value: SalaryBillStatusTypes.DRAFT,
    label: t("common.status.draft"),
  },
  {
    value: SalaryBillStatusTypes.PAID,
    label: t("salaryModule.billStatus.paid"),
  },
  {
    value: SalaryBillStatusTypes.CANCELED,
    label: t("salaryModule.billStatus.denied"),
  },
];

export const uomComparisonTypes = [
  { value: 0, label: t("common.status.reference") },
  { value: 2, label: t("common.status.bigger") },
  { value: 1, label: t("common.status.smaller") },
];
