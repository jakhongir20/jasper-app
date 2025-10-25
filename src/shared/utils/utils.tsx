import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useTranslation } from "react-i18next";

import i18n from "@/app/i18n";

dayjs.extend(duration);

const t = i18n.t;

export function formatPhoneNumber(phone?: string) {
  const format = phone
    ?.replace(/\D/g, "")
    .match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
  return `+${format && format[1] ? format[1] : ""}
          ${format && format[2] ? format[2] : ""}
          ${format && format[3] ? format[3] : ""}
          ${format && format[4] ? format[4] : ""}
          ${format && format[5] ? format[5] : ""}`;
}

export const useStatusOptions = () => {
  const { t } = useTranslation();
  return [
    { id: "1", name: t("common.status.draft") },
    { id: "2", name: t("common.status.open") },
    { id: "3", name: t("common.status.pending") },
    { id: "4", name: t("common.status.inProgress") },
    { id: "5", name: t("common.status.mixed") },
    { id: "6", name: t("common.status.received") },
    { id: "7", name: t("common.status.confirming") },
    { id: "8", name: t("common.status.closed") },
    { id: "9", name: t("common.status.canceled") },
    { id: "10", name: t("common.status.deleted") },
    { id: "11", name: t("common.status.paid") },
    { id: "12", name: t("common.status.archived") },
    { id: "13", name: t("common.status.incoming") },
    { id: "14", name: t("common.status.qualification") },
    { id: "15", name: t("common.status.moved") },
    { id: "16", name: t("common.status.inTransit") },
    { id: "17", name: t("common.status.delivered") },
  ];
};

export const useMTemplateStatusOptions = () => {
  const { t } = useTranslation();
  return [
    { id: "1", name: t("common.status.draft") },
    { id: "2", name: t("common.status.open") },
  ];
};

export const useReceiptStatusOptions = () => {
  const { t } = useTranslation();
  return [
    { id: "1", name: t("common.status.draft") },
    { id: "2", name: t("common.status.open") },
    { id: "13", name: t("common.status.incoming") },
    { id: "14", name: t("common.status.qualification") },
    { id: "6", name: t("common.status.received") },
    { id: "8", name: t("common.status.closed") },
    { id: "9", name: t("common.status.canceled") },
  ];
};

export const useRequestOptions = () => {
  const { t } = useTranslation();
  return [
    { id: "1", name: t("common.status.saleToPurchase") },
    { id: "2", name: t("common.status.saleToManufacture") },
    { id: "4", name: t("common.status.saleRefundRequest") },
  ];
};

export const usePurchaseStatusOptions = () => {
  const { t } = useTranslation();

  return [
    { value: "1", label: t("common.status.draft") },
    { value: "2", label: t("common.status.open") },
    { value: "7", label: t("common.status.confirming") },
    { value: "8", label: t("common.status.closed") },
    { value: "9", label: t("common.status.canceled") },
  ];
};

export const useOperationTypeOptions = () => {
  const { t } = useTranslation();
  return [
    { id: "INSERT", name: t("common.filter.operations.INSERT") },
    { id: "UPDATE", name: t("common.filter.operations.UPDATE") },
    { id: "DELETE", name: t("common.filter.operations.DELETE") },
  ];
};

export const useSalaryStatusOptions = () => {
  const { t } = useTranslation();
  return [
    { id: "true", name: t("common.status.added") },
    { id: "false", name: t("common.status.notAdded") },
  ];
};

export const useSalaryBillStatusOptions = () => {
  const { t } = useTranslation();
  return [
    { id: "1", name: t("common.status.pending") },
    { id: "2", name: t("common.status.paid") },
    { id: "3", name: t("common.status.canceled") },
  ];
};
export const useVehicleStatusOptions = (): {
  value: unknown;
  label: string;
}[] => {
  const { t } = useTranslation();
  return [
    { value: "1", label: t("common.status.available") },
    { value: "2", label: t("common.status.isUsed") },
    { value: "3", label: t("common.status.isFixed") },
    { value: "4", label: t("common.status.outOfUsage") },
  ];
};

export function getOnlyUpdatedFields<T extends Record<string, any>>(
  oldFields: T,
  updatedFields: T,
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in updatedFields) {
    if (!Object.prototype.hasOwnProperty.call(updatedFields, key)) {
      continue; // skip inherited props
    }

    const oldVal = oldFields[key];
    const newVal = updatedFields[key];

    // 1) Both values are objects (and not arrays) -> Recurse deeply
    if (
      oldVal &&
      newVal &&
      typeof oldVal === "object" &&
      typeof newVal === "object" &&
      !Array.isArray(oldVal) &&
      !Array.isArray(newVal)
    ) {
      const nestedDiff = getOnlyUpdatedFields(oldVal, newVal);
      // If nestedDiff is non-empty, we store it
      if (Object.keys(nestedDiff).length > 0) {
        result[key] = nestedDiff;
      }
    }
    // 2) Both values are arrays -> store entire newVal if they differ
    else if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      // naive approach: if any element differs or lengths differ, we store the new array
      if (
        oldVal.length !== newVal.length ||
        !oldVal.every((v, i) => Object.is(v, newVal[i]))
      ) {
        result[key] = newVal;
      }
    }
    // 3) Primitive or mismatched types -> compare directly
    else {
      if (!Object.is(oldVal, newVal)) {
        result[key] = newVal;
      }
    }
  }

  return result;
}

export function formatMoneyDecimal(
  number?: number,
  fix = 0,
  option = "decimal",
) {
  if (number == null || isNaN(number)) {
    return "0";
  }

  let style: string;
  if (["USD", "RUB"].includes(option)) {
    style = "currency";
  } else if (["kilogram", "meter", "percent"].includes(option)) {
    style = "unit";
  } else {
    style = "decimal";
  }

  const formatOptions: Intl.NumberFormatOptions = {
    style: style as any,
    maximumFractionDigits: fix,
    minimumFractionDigits: fix,
  };

  if (style === "currency") {
    formatOptions.currency = option;
  } else if (style === "unit") {
    formatOptions.unit = option;
  }

  return (
    new Intl.NumberFormat("en-US", formatOptions)
      .format(number)
      ?.replaceAll(",", " ") || "0"
  );
}

/**
 * Debounce function with key support.
 * Each key will have its own debounce timer.
 */
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export function debounce<T extends (...args: any[]) => void>(
  key: string,
  func: T,
  wait: number,
) {
  return (...args: Parameters<T>) => {
    if (debounceTimers[key]) {
      clearTimeout(debounceTimers[key]);
    }
    debounceTimers[key] = setTimeout(() => {
      func(...args);
      delete debounceTimers[key];
    }, wait);
  };
}

/**
 * Generate a random unique id.
 */
export function getRandomId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

/**
 * Check if a value is truly empty (null, undefined, empty string, empty object, empty array)
 */
export function isTrulyEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}
