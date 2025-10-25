import { Dispatch, SetStateAction } from "react";

export function useTabCollapseErrorHandler(
  tabName: "cargo" | "contacts",
  formFinishErrors: any[] = [],
  createdItems: string[],
  setActiveKey: Dispatch<SetStateAction<string[]>>,
) {
  const errors = formFinishErrors?.filter(
    (field: any) => field.errors?.length > 0,
  );

  const errorKeys = new Set<string>();

  errors.forEach(({ name }: any) => {
    if (name?.length >= 2 && name[0] === tabName) {
      const index = Number(name[1]);
      const collapseKey = createdItems[index];
      if (collapseKey) {
        errorKeys.add(collapseKey);
      }
    }
  });

  setActiveKey((prevKeys) => [...new Set([...prevKeys, ...errorKeys])]);
}
