import React, { FC, useCallback } from "react";
import { cn } from "@/shared/helpers";
import { Button, Icon, SearchInput } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { useDownloadCSV } from "@/shared/ui/table/action/useDownloadCVS";

export type CVSOptions = {
  endpoint: string;
  fileName?: string;
  isShow?: boolean;
  isExport?: boolean;
  isImport?: boolean;
  total?: boolean;
  withSalary?: boolean;
  fromDistribution?: boolean;
  type?: number;
  withQuantity?: boolean;
  isExists?: boolean;
  isConfirmed?: boolean;
  batch?: number;
};

interface Props {
  className?: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  addButtonVariant?: "solid" | "outlined";
  onAdd?: () => void;
  cvsOptions?: CVSOptions;
  isShowCVS?: boolean;
}

const params = [
  "warehouse",
  "recorder",
  "shippingType",
  "paymentType",
  "totalAmount",
  "totalAmount_max",
  "totalAmount_min",
  "taxCategory",
  "discountCategory",
  "percent",
  "created_at_from",
  "created_at_to",
  "registrationDate_from",
  "registrationDate_to",
  "date",
  "organization",
  "partner",
  "status",
  "q",
  "operation_type",
  "user",
  "type",
  "role",
  "phone",
  "email",
  "first_name",
  "last_name",
  "middle_name",
  "company",
  "employee_type",
  "range",
  "totalAmount_min",
  "totalAmount_max",
  "openAmount_min",
  "openAmount_max",
  "closedAmount_min",
  "closedAmount_max",
  "percent_max",
  "percent_min",
  "salaryAmount_max",
  "salaryAmount_min",
  "accountBalance_max",
  "accountBalance_min",
  "givenAmount_max",
  "givenAmount_min",
  "debtAmount_max",
  "debtAmount_min",
  "oldPrice_max",
  "oldPrice_min",
  "newPrice_max",
  "newPrice_min",
  "currency",
  "category",
  "group",
  "paymentType",
  "shippingType",
  "role",
  "uom",
  "manufacturer",
  "category",
  "batchProduct",
  "speciality",
  "workTime",
  "recorder",
  "product",
  "expires_at",
];

export const TableAddSearch: FC<Props> = ({
  className,
  showSearch,
  onAdd,
  addButtonText,
  addButtonVariant,
  showAddButton = true,
  cvsOptions,
  isShowCVS,
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = React.useState<string>(
    searchParams.get("query") || "",
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value?.trim());
  };

  const onSearch = useCallback(
    debounce((text: string) => {
      const searchParams = new URLSearchParams(window.location.search);

      setSearchParams(() => {
        searchParams.set("query", text);
        return searchParams;
      });
    }, 500),
    [],
  );

  const { downloadFile, isDownloadingFile } = useDownloadCSV(
    cvsOptions?.endpoint || "",
  );

  return (
    <div className={cn("flex flex-row items-center gap-4", className)}>
      {isShowCVS && Object.keys(cvsOptions ?? {})?.length > 0 && (
        <button
          className={
            "flex size-8 cursor-pointer items-center justify-center rounded-lg bg-violet-300 text-primary transition-all duration-300 hover:bg-violet-500"
          }
          disabled={isDownloadingFile}
          onClick={() => {
            const query = new URLSearchParams();

            query.set("report", "true");

            params.forEach((param) => {
              const value = searchParams.get(param);
              if (value) {
                query.set(param, value);
              }
            });

            if (cvsOptions?.isExport) {
              query.set("isExport", "true");
            }
            if (cvsOptions?.total) {
              query.set("total", "true");
            }

            if (cvsOptions?.isImport) {
              query.set("isImport", "true");
            }
            if (cvsOptions?.withSalary) {
              query.set("withSalary", "true");
            }
            if (cvsOptions?.withQuantity) {
              query.set("withQuantity", "true");
            }
            if (cvsOptions?.isExists) {
              query.set("isExists", "true");
            }
            if (cvsOptions?.isConfirmed) {
              query.set("isConfirmed", "true");
            }
            if (
              cvsOptions?.fromDistribution ||
              cvsOptions?.fromDistribution === false
            ) {
              query.set("fromDistribution", cvsOptions?.fromDistribution);
            }
            if (cvsOptions?.type) {
              // @ts-ignore
              query.set("type", cvsOptions?.type);
            }
            if (cvsOptions?.batch) {
              // @ts-ignore
              query.set("type", cvsOptions?.batch);
            }

            const fullUrl = `${cvsOptions?.endpoint}/?${query.toString()}`;
            downloadFile(cvsOptions?.fileName ?? "Отчет", fullUrl);
          }}
          aria-label="Download CSV"
        >
          <Icon width={22} icon={"excel"} color={""} />
        </button>
      )}
      {showSearch && (
        <SearchInput
          placeholder={t("common.search.title")}
          value={search}
          defaultValue={search}
          onChange={handleSearch}
        />
      )}
      {showAddButton && (
        <Button
          className={"max-h-8"}
          color={"primary"}
          variant={(addButtonVariant ??= "solid")}
          icon={
            <Icon
              icon={"plus"}
              color={
                addButtonVariant === "outlined" ? "text-black" : "text-white"
              }
            />
          }
          onClick={onAdd}
        >
          {addButtonText || t("common.button.add")}
        </Button>
      )}
    </div>
  );
};
