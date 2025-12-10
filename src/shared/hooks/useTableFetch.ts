import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

import { apiService } from "@/shared/lib/services/ApiService";
import { scrollToTopRobust } from "@/shared/utils/scrollUtils";
import { getDateTime } from "@/shared/utils/timeFormat";

export type TableDataResponse<T> = {
  results: T[];
  pagination: {
    limit: number;
    offset: number;
    total_count: number;
    next: string;
    previous: string;
  };
};

interface ApiServiceInterface {
  $get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const INITIAL_LIMIT = 20;
const INITIAL_PAGE = 1;

export const useTableFetch = <T>(
  url: string,
  initialParams = {},
  ignoredParams: string[] = ["tab", "page"],
  noResults = false,
  defaultPageSize = INITIAL_LIMIT,
  apiServiceInstance: ApiServiceInterface = apiService,
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");

  const [pagination, setPagination] = useState({
    total: 0,
    limit: Number(searchParams.get("limit")) || defaultPageSize,
    page: Number(searchParams.get("page")) || INITIAL_PAGE,
    offset: 0,
  });

  const offset = useMemo(
    () => (pagination.page - 1) * pagination.limit,
    [pagination.page, pagination.limit],
  );

  const params = useMemo(() => {
    const allParams: { [key: string]: string | number | boolean } = {
      ...initialParams,
      limit: pagination.limit,
      offset,
      query: search,
    };
    searchParams.forEach((value, key) => {
      if (!ignoredParams.includes(key)) {
        // Convert date parameters to timestamps in seconds
        if (key.endsWith("_from")) {
          // For "from" dates, use start of day (00:00:00)
          const timestamp = getDateTime(value);
          if (timestamp !== undefined) {
            allParams[key] = timestamp;
          }
        } else if (key.endsWith("_to")) {
          // For "to" dates, use end of day (23:59:59) to include the entire day
          const date = dayjs(value);
          if (date.isValid()) {
            const endOfDay = date.endOf("day");
            allParams[key] = Math.floor(endOfDay.valueOf() / 1000);
          }
        } else {
          allParams[key] = value;
        }
      }
    });
    return allParams;
  }, [
    initialParams,
    pagination.limit,
    offset,
    search,
    searchParams,
    ignoredParams,
  ]);

  const queryKey = useMemo(() => {
    return [
      "tableData",
      url,
      {
        ...params,
        page: pagination.page,
        limit: pagination.limit,
      },
    ];
  }, [url, params, pagination.page, pagination.limit]);

  const fetchTableData = async (url: string, options: AxiosRequestConfig) => {
    if (noResults) {
      // For non-paginated endpoints, return the data directly
      return await apiServiceInstance.$get<T[]>(url, options);
    } else {
      // For paginated endpoints, return the paginated response
      return await apiServiceInstance.$get<TableDataResponse<T>>(url, options);
    }
  };

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => await fetchTableData(url, { params }),
  });

  useEffect(() => {
    if (!isLoading && !queryError && data) {
      if (noResults) {
        // For non-paginated data, set total to array length
        setPagination((prev) => ({
          ...prev,
          total: Array.isArray(data) ? data.length : 0,
        }));
      } else {
        // For paginated data, use the pagination info
        const paginatedData = data as TableDataResponse<T>;
        setPagination((prev) => ({
          ...prev,
          total: paginatedData?.pagination?.total_count || 0,
        }));
      }
    }
  }, [isLoading, queryError, data, noResults]);

  const onPageChange = (page: number) => {
    if (page && page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page }));
      setSearchParams((prev) => {
        prev.set("page", page.toString());
        return prev;
      });
    }
  };

  useEffect(() => {
    const newLimit = Number(searchParams.get("limit")) || defaultPageSize;
    const newPage = Number(searchParams.get("page")) || INITIAL_PAGE;
    const newSearch = searchParams.get("query") || "";

    searchParams.set("page", "1");

    if (newSearch !== search) {
      setPagination((prev) => ({
        ...prev,
        limit: defaultPageSize,
        page: INITIAL_PAGE,
      }));
      setSearch(newSearch);
    } else {
      setPagination((prev) => ({
        ...prev,
        limit: newLimit,
        page: newPage,
      }));
    }
  }, [searchParams, search, defaultPageSize]);

  useEffect(() => {
    scrollToTopRobust();
  }, [data]);

  // Handle both paginated and non-paginated data
  const tableData = useMemo(() => {
    if (!data) return [];

    if (noResults) {
      // For non-paginated endpoints, data is already an array
      if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } else {
      // For paginated endpoints, extract results from the response
      const paginatedData = data as TableDataResponse<T>;
      if (
        paginatedData &&
        typeof paginatedData === "object" &&
        "results" in paginatedData
      ) {
        return Array.isArray(paginatedData.results)
          ? paginatedData.results
          : [];
      } else {
        return [];
      }
    }
  }, [data, noResults]) as T[];

  return {
    tableData,
    pagination,
    isLoading,
    error: queryError,
    onPageChange,
    refetch,
  };
};
