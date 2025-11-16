import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { Icon, Table } from "@/shared/ui";
import { Badge } from "@/shared/ui/badge";
import {
  CVSOptions,
  TableAddSearch,
} from "@/shared/ui/table/action/TableAddSearch";
import { EmptyTable } from "@/shared/ui/table/empty/EmptyTable";
import { ReusableTableProps } from "@/shared/ui/table/Table";

interface Props<T extends object> extends ReusableTableProps<T> {
  showSearch?: boolean;
  addButtonText?: string;
  addButtonVariant?: "solid" | "outlined";
  loading: boolean;
  showAddButton?: boolean | null;
  onAdd?: () => void;
  clickableRows?: string[];
  unClickableColumns?: string[];
  onSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  filters?: (string | string[])[];
  showFilter?: boolean;
  noFilter?: boolean;
  showDropdown?: boolean;
  showRowIndex?: boolean;
  cvsOptions?: CVSOptions;
  emptyTableClassName: string;
}

export const TableWrapper = <T extends object>({
  data,
  columns,
  unhideableColumns = [],
  children,
  showSearch = true,
  addButtonText,
  addButtonVariant,
  loading,
  initialPageSize = 20,
  loaderRows,
  loaderColumns,
  clickableRows,
  onAdd,
  onSearchChange,
  filters,
  showAddButton,
  showFilter = true,
  noFilter = false,
  showDropdown,
  title = undefined,
  cvsOptions,
  emptyTableClassName = "",
  ...rest
}: Props<T>) => {
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  const clearFilterParams = () => {
    if (!filters) return;
    const newSearchParams = new URLSearchParams(searchParams);
    filters.forEach((filter) => {
      if (Array.isArray(filter)) {
        filter.forEach((f) => newSearchParams.delete(f));
      } else {
        newSearchParams.delete(filter);
      }
    });
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    if (filters) {
      const count = filters.reduce((acc, filter) => {
        if (Array.isArray(filter)) {
          return filter.some((f) => searchParams.get(f)) ? acc + 1 : acc;
        }
        return searchParams.get(filter) ? acc + 1 : acc;
      }, 0);
      setBadgeCount(count);
    }
  }, [filters, searchParams]);

  const isShowCVS = !!rest.pagination?.total;

  return (
    <>
      <Table<T>
        columns={columns}
        data={safeData}
        unhideableColumns={unhideableColumns}
        initialPageSize={initialPageSize}
        loading={loading}
        loaderRows={loaderRows}
        loaderColumns={loaderColumns}
        filters={filters}
        showDropdown={showDropdown}
        title={
          title
            ? () => (
              <span className={"flex items-center justify-between gap-4"}>
                {title ? title([]) : undefined}
                {showSearch && (
                  <TableAddSearch
                    cvsOptions={cvsOptions}
                    isShowCVS={isShowCVS}
                    showSearch={showSearch}
                    addButtonText={addButtonText}
                    addButtonVariant={addButtonVariant}
                    showAddButton={showAddButton as boolean}
                    onAdd={onAdd}
                  />
                )}
              </span>
            )
            : undefined
        }
        {...rest}
      >
        {showFilter && !title && (
          <div className={"flex w-full flex-col"}>
            <div className={"flex w-full items-center justify-between gap-4"}>
              {!noFilter ? (
                <div>
                  <div className={"flex flex-row gap-2"}>
                    <div className="relative">
                      <Badge count={badgeCount}>
                        <button
                          className={
                            "flex size-8 cursor-pointer items-center justify-center rounded-lg bg-primary-hover/20 text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                          }
                          onClick={() => setFilterOpen((prev) => !prev)}
                          aria-label="Open filter"
                        >
                          {filterOpen ? (
                            <Icon icon={"close"} width={14} color={""} />
                          ) : (
                            <Icon icon={"filter"} color={""} />
                          )}
                        </button>
                      </Badge>
                    </div>
                    {badgeCount ? (
                      <button
                        className={
                          "flex h-8 cursor-pointer flex-row items-center justify-center gap-2.5 rounded-lg bg-orange/[12%] px-3 py-6px text-orange transition-all duration-300 hover:bg-orange hover:text-white"
                        }
                        onClick={clearFilterParams}
                      >
                        <Icon icon={"clear-filter"} color={"size-4"} />
                        <p className={"text-sm font-medium"}>
                          {t("common.button.clearFilter")}
                        </p>
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <span />
              )}
              {!title && (
                <TableAddSearch
                  isShowCVS={isShowCVS}
                  cvsOptions={cvsOptions}
                  showSearch={showSearch}
                  addButtonText={addButtonText}
                  addButtonVariant={addButtonVariant}
                  showAddButton={showAddButton}
                  onAdd={onAdd}
                />
              )}
            </div>

            <div
              className={`table-filter-slide mt-1 flex flex-col items-start ${filterOpen ? "open" : ""
                }`}
            >
              {/* Triangle */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderBottom: "7px solid #4b505717",
                  marginLeft: 9,
                }}
              />
              <div className="table-filter-dropdown-content mt-0 grid w-full grid-cols-1 items-start justify-start gap-4 rounded-lg border border-black-100/5 bg-gray-600 p-4 transition-all duration-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {children}
              </div>
            </div>
          </div>
        )}
      </Table>
      {!loading && safeData.length === 0 && (
        <EmptyTable showAddButton={showAddButton as boolean} className={emptyTableClassName} onClick={onAdd} />
      )}
    </>
  );
};
