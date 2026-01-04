import { LoadingOutlined } from "@ant-design/icons";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Empty, Select as SelectUI, SelectProps, Spin } from "antd";
import {
  CSSProperties,
  memo,
  MouseEvent,
  ReactElement,
  ReactNode,
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { ApiService } from "@/shared/lib/services";
import { Icon, Select as UISelect } from "@/shared/ui";
import { TableDataResponse } from "@/shared/hooks/useTableFetch";
import { debounce } from "lodash";
import { getRandomId } from "@/shared/utils";

type ItemType = {
  id: string;
  name: string;
  [key: string]: number | string | boolean | unknown;
};

interface Props<T> extends Omit<SelectProps, "options" | "onChange"> {
  className?: string;
  rootClassName?: string;
  onSearch?: (value: string) => void;
  fetchUrl?: string;
  placeholder?: string;
  renderOption?: (item: T) => ReactNode;
  onSelect?: (value: string, selectedOption?: T) => void;
  onChange?: (value: string | null) => void;
  style?: CSSProperties;
  value?: T | null | string | number;
  defaultValue?: string | number;
  labelKey: string | string[];
  valueKey: string;
  queryKey?: string;
  size?: "small" | "medium";
  options?: T[];
  status?: "warning" | "error" | "";
  prefix?: ReactNode;
  params?: Record<string, string | number | object | unknown>;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  onClear?: () => void;
  useValueAsLabel?: boolean;
  emptyRender?: ReactNode;
}

const PAGE_SIZE = 10;

const Select = <T extends ItemType>({
  className,
  rootClassName,
  placeholder,
  fetchUrl,
  renderOption,
  onSelect,
  onSearch,
  value,
  labelKey,
  valueKey,
  queryKey,
  options,
  size,
  style,
  status = "",
  prefix,
  params,
  disabled = false,
  loading = false,
  onClear,
  onChange,
  allowClear = true,
  useValueAsLabel = false,
                                      emptyRender = null,
  ...rest
}: Props<T>) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();
  const [placeholderText, setPlaceholderText] = useState<string>(
    placeholder || t("common.search.placeholder"),
  );

  const [fetchEnabled, setFetchEnabled] = useState(Boolean(value));
  const isFetchingRef = useRef(false);

  const fetchItems = async ({ pageParam = 0 }) => {
    if (!fetchUrl) return [];
    const response = await ApiService.$get<TableDataResponse<T>>(fetchUrl, {
      params: {
        limit: PAGE_SIZE,
        offset: pageParam,
        ...params,
      },
    });
    return response;
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey ? queryKey : undefined, searchTerm],
      queryFn: fetchItems,
      getNextPageParam: (lastPage: TableDataResponse<T>, pages) => {
        if (lastPage.results?.length === PAGE_SIZE) {
          return pages.length * PAGE_SIZE;
        }
        return undefined;
      },
      initialPageParam: 0,
      enabled: fetchEnabled,
    });

  const fetchedOptions: T[][] = useMemo(() => {
    return (
      data?.pages.map((page) =>
        page?.results?.filter((item) => {
          const label =
            typeof labelKey === "string"
              ? item[labelKey]
              : Array.isArray(labelKey)
                ? labelKey
                    .map((key) => item[key])
                    .join(" ")
                    .trim()
                : "";

          return typeof label === "string" && label.length > 0;
        }),
      ) || []
    );
  }, [data?.pages, labelKey]);

  const triggerFetch = useCallback(() => {
    if (!fetchEnabled) {
      setFetchEnabled(true);
    }
  }, [fetchEnabled]);

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
        onSearch?.(value);
      }, 400),
    [onSearch],
  );

  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  useEffect(() => {
    if (fetchEnabled) {
      queryClient.invalidateQueries({
        queryKey: [queryKey ? queryKey : undefined, searchTerm],
        exact: true,
      });
    }
  }, [params, fetchEnabled, queryKey, searchTerm, queryClient]);

  const handlePopupScroll = useCallback(
    (e: UIEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      if (
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 10 &&
        hasNextPage &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true;
        fetchNextPage().finally(() => {
          isFetchingRef.current = false;
        });
      }
    },
    [fetchNextPage, hasNextPage],
  );

  const handleDropdownVisibleChange = useCallback((visible: boolean) => {
    setOpen(visible);
  }, []);

  const handleSelect = useCallback(
    async (option: { value: string; label: string }) => {
      const { value: selectedValue, label } = option;

      const allFetched = fetchedOptions.flat();
      const selectedOption = allFetched.find(
        (item) => item[valueKey] == selectedValue,
      );

      if (onSelect) {
        onSelect(selectedValue, selectedOption);
      }

      onChange?.(selectedOption);

      const selected = { [valueKey]: selectedValue, [labelKey]: label } as T;
      setSelectedItem(selected);

      if (fetchUrl) {
        const exists = data?.pages.some((page) =>
          page?.results?.some((item: T) => item[valueKey] == selectedValue),
        );

        if (!exists) {
          queryClient.setQueryData(["items", searchTerm], (oldData: any) => {
            if (!oldData) {
              return { pages: [[selected]], pageParams: [0] };
            }

            return {
              ...oldData,
              pages: [[selected], ...oldData.pages],
            };
          });
        }
      }

      setSearchTerm("");
    },
    [
      data?.pages,
      fetchedOptions,
      onSelect,
      queryClient,
      searchTerm,
      fetchUrl,
      labelKey,
      valueKey,
    ],
  );

  const noItemsYet = !fetchedOptions[0]?.length;
  const notFound =
    isFetching && noItemsYet ? (
      <Spin size="small" />
    ) : (
      <>
        {emptyRender ? (
          emptyRender
        ) : (
          <Empty
            description={t("common.search.noResults")}
            image={<Icon icon="list" height={30} />}
          className="[&_.ant-empty-image]:!h-6"
          />
        )}
      </>
    );

  useEffect(() => {
    if (value && fetchUrl) {
      triggerFetch();
    }
  }, [value, fetchUrl, triggerFetch]);

  const fetchItemByIdRef = useRef<
    ((id: string | number) => Promise<void>) | null
  >(null);

  const fetchItemById = useCallback(
    async (id: string | number) => {
      if (!fetchUrl) return;

      const url = `${fetchUrl}?id=${id}`;
      const response = await ApiService.$get<TableDataResponse<T>>(url, {
        params: { offset: 0, limit: 50, ...params },
      });

      const item = response?.results?.find((item) => item[valueKey] == id);

      if (item) {
        const label =
          typeof labelKey === "string"
            ? item[labelKey]
            : Array.isArray(labelKey)
              ? labelKey
                  .map((key) => item[key])
                  .filter(Boolean)
                  .join(" ")
                  .trim()
              : "";

        setPlaceholderText(label);
        setSelectedItem(item);
      }
    },
    [fetchUrl, params, valueKey, labelKey],
  );

  // Update the ref whenever fetchItemById changes
  useEffect(() => {
    fetchItemByIdRef.current = fetchItemById;
  }, [fetchItemById]);

  useEffect(() => {
    if (!value) {
      setSelectedItem(null);
      setPlaceholderText(placeholder || t("common.search.placeholder"));
      return;
    }

    // If useValueAsLabel is true and value is a string, use it directly as label
    if (useValueAsLabel && typeof value === "string") {
      setPlaceholderText(value);
      setSelectedItem({ [valueKey]: value, [labelKey]: value } as T);
      return;
    }

    // If value is an object, use it directly - no API call needed
    if (typeof value === "object" && value !== null) {
      const label =
        typeof labelKey === "string"
          ? (value as any)[labelKey]
          : Array.isArray(labelKey)
            ? labelKey
                .map((key) => (value as any)[key])
                .filter(Boolean)
                .join(" ")
                .trim()
            : "";
      setPlaceholderText(String(label || ""));
      setSelectedItem(value as T);
      return; // Exit early - no need to fetch data
    }

    // If value is a string or number (ID), try to find it in existing data first
    if (typeof value === "string" || typeof value === "number") {
      let foundItem: T | undefined;

      // Search through all pages and their results
      if (data?.pages) {
        for (const page of data.pages) {
          if (
            page &&
            typeof page === "object" &&
            "results" in page &&
            page.results
          ) {
            const item = page.results.find(
              (item: T) => item[valueKey] == value,
            );
            if (item) {
              foundItem = item;
              break;
            }
          }
        }
      }

      if (foundItem) {
        // Item found in existing data - no API call needed
        const label =
          typeof labelKey === "string"
            ? foundItem[labelKey]
            : Array.isArray(labelKey)
              ? labelKey
                  .map((key) => foundItem[key])
                  .filter(Boolean)
                  .join(" ")
                  .trim()
              : "";
        setPlaceholderText(String(label || ""));
        setSelectedItem(foundItem);
      } else if (fetchUrl && fetchItemByIdRef.current) {
        // Item not found in existing data and we have a fetch URL - make API call
        fetchItemByIdRef.current(value);
      } else {
        // No fetch URL available, just set placeholder
        setPlaceholderText(placeholder || t("common.search.placeholder"));
        setSelectedItem(null);
      }
    }
  }, [
    value,
    data?.pages,
    labelKey,
    valueKey,
    placeholder,
    t,
    fetchUrl,
    useValueAsLabel,
    params,
  ]);

  const stopPropagation = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <UISelect
      showSearch
      allowClear={allowClear}
      open={open}
      onFocus={triggerFetch}
      loading={isFetching || loading}
      onOpenChange={handleDropdownVisibleChange}
      filterOption={false}
      onSearch={debouncedHandleSearch}
      onPopupScroll={handlePopupScroll}
      className={className}
      notFoundContent={notFound}
      status={status}
      prefix={prefix}
      disabled={disabled}
      value={
        selectedItem
          ? {
              value: selectedItem[valueKey],
              label:
                typeof labelKey === "string"
                  ? selectedItem[labelKey]
                  : Array.isArray(labelKey)
                    ? labelKey.map((key) => selectedItem[key]).join(" ")
                    : "",
            }
          : undefined
      }
      placeholder={placeholderText}
      style={style}
      size={size}
      onSelect={handleSelect}
      onClear={() => {
        setSearchTerm("");
        setSelectedItem(null);
        if (queryKey) {
          setSearchParams((prev) => {
            prev.delete(queryKey);
            return prev;
          });
        }
        setPlaceholderText(placeholder || t("common.search.placeholder"));
        onClear?.();
        onChange?.(null);
      }}
      labelInValue
      {...(rootClassName && { rootClassName })}
      {...rest}
    >
      {fetchUrl
        ? fetchedOptions.flat().map((item) => {
            const label = Array.isArray(labelKey)
              ? labelKey.map((k) => item[k]).filter(Boolean).join(" ")
              : item[labelKey];

            return (
              <SelectUI.Option
                key={getRandomId(String(item[valueKey]))}
                value={item[valueKey]}
              >
                {renderOption ? renderOption(item) : label}
              </SelectUI.Option>
            );
          })
        : options?.map((item) => {
            const label = Array.isArray(labelKey)
              ? labelKey.map((k) => item[k]).filter(Boolean).join(" ")
              : item[labelKey];

            return (
              <SelectUI.Option
                key={getRandomId(String(item[valueKey]))}
                value={item[valueKey]}
              >
                {renderOption ? renderOption(item) : label}
              </SelectUI.Option>
            );
          })}

      {isFetchingNextPage && (
        <SelectUI.Option
          value="loading"
          key="loading"
          disabled
          onClick={stopPropagation}
          rootPrefixCls="hover:!bg-transparent"
          className="mx-center text-center hover:!bg-transparent"
        >
          <Spin size="small" indicator={<LoadingOutlined spin />} />
        </SelectUI.Option>
      )}
    </UISelect>
  );
};

export const SelectInfinitive = memo(Select) as <T extends ItemType>(
  props: Props<T>,
) => ReactElement;
