import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useToast } from "@/shared/hooks/useToast";

/** Each tab has a `tabKey` and a list of `fields` belonging to that tab. */
export interface TabConfig {
  tabKey: string;
  fields: string[];
}

/**
 * A custom hook that returns a reusable `handleFinishFailed` function.
 *
 * @param tabConfigs - an array describing which fields belong to which tab
 */

export function useTabErrorHandler(tabConfigs: TabConfig[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();

  const getTabKeyForField = useCallback(
    (fieldName: string) => {
      const found = tabConfigs.find((cfg) => cfg.fields.includes(fieldName));
      return found ? found.tabKey : tabConfigs[0].tabKey;
    },
    [tabConfigs],
  );

  function scrollToField() {
    const el = document.querySelector(".ant-form-item-has-error");
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    toast(t("toast.requiredFields"), `error`);
  }

  const formFinishFailed = useCallback(
    (err: any) => {
      const invalidFields = err?.errorFields || [];

      if (invalidFields.length > 0) {
        const firstInvalidFieldPath = invalidFields[0].name;
        const fieldName = Array.isArray(firstInvalidFieldPath)
          ? firstInvalidFieldPath[0]
          : firstInvalidFieldPath;

        const targetTabKey = getTabKeyForField(fieldName);
        if (targetTabKey) {
          const params = new URLSearchParams(searchParams);
          params.set("tab", targetTabKey);

          setSearchParams(params);
          setTimeout(() => {
            scrollToField();
          }, 300);
        }
      }
    },
    [getTabKeyForField],
  );

  return { formFinishFailed };
}
