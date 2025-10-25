import { useQuery } from "@tanstack/react-query";
import { Cascader as AntdCascader, Empty, Spin } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { rotateIcon } from "@/shared/helpers";
import { ApiService } from "@/shared/lib/services";
import { Icon } from "@/shared/ui";

interface Option {
  value: string | number;
  label: string | number;
  children?: Option[];
}

type Props = {
  options?: Option[];
  api?: string;
  placeholder: string;
  valueKey: string;
  labelKey: string;
  size?: "small" | "middle";
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  disabled?: boolean;
  params?: Record<string, any>;
  changeOnSelect?: boolean;
};

export const Cascader = <T extends Record<string, any>>({
  options,
  placeholder,
  api,
  valueKey,
  labelKey,
  size,
  value,
  onChange,
  disabled = false,
  params = {},
  changeOnSelect = true,
}: Props) => {
  const sizeClass = size === "small" ? "min-h-8" : "min-h-10";

  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetchEnabled, setFetchEnabled] = useState(!!value);
  const [isOpen, setIsOpen] = useState(false);

  const fetchItems = async (): Promise<T[]> => {
    // onChange?.([]);
    if (!api) return [];
    return await ApiService.$get<T[]>(api, {
      params: {
        q: searchTerm,
        ...params,
      },
    });
  };

  const { data, isFetching, refetch } = useQuery<T[]>({
    queryKey: [api, searchTerm, params],
    queryFn: fetchItems,
    enabled: fetchEnabled && Boolean(api),
  });

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 600);

  const handleDropdownVisibleChange = useCallback(
    (visible: boolean) => {
      setIsOpen(visible);
      if (visible && !fetchEnabled && !data) {
        setFetchEnabled(true);
        refetch();
      }
    },
    [fetchEnabled, refetch, data],
  );

  useEffect(() => {
    if (value && api && !data) {
      setFetchEnabled(true);
      refetch();
    }
  }, [value, api, refetch, data]);

  const handleClear = () => {
    setSearchTerm("");
  };

  const mapOptions = (items: T[]): Option[] => {
    return items.map((item) => {
      const mapped: Option = {
        label: item[labelKey],
        value: item[valueKey],
      };
      if (item.children && Array.isArray(item.children)) {
        mapped.children = mapOptions(item.children);
      }
      return mapped;
    });
  };

  const filteredData = useMemo(() => {
    return data ? mapOptions(data) : options || [];
  }, [data, options, labelKey, valueKey]);

  // Helper: find full path for a given target value
  const findFullPath = (
    nodes: Option[],
    target: string | number,
  ): (string | number)[] | null => {
    for (const node of nodes) {
      if (node?.value === target) return [node?.value];
      if (node?.children) {
        const path = findFullPath(node?.children, target);
        if (path) return [node?.value, ...path];
      }
    }
    return null;
  };

  // const computedValue = useMemo(() => {
  //   if (api && value && value.length === 1 && filteredData.length > 0) {
  //     const fullPath = findFullPath(filteredData, value[0]);
  //     return fullPath ? fullPath : value;
  //   }
  //
  //   return value;
  // }, [api, value, filteredData]);

  const computedValue = useMemo(() => {
    if (
      value &&
      Array.isArray(value) &&
      value.length > 0 &&
      value.some((v) => v === undefined)
    ) {
      return [];
    }

    if (api && value && value.length === 1 && filteredData.length > 0) {
      const fullPath = findFullPath(filteredData, value[0]);
      return fullPath ?? value;
    }

    return value;
  }, [value, api, filteredData]);

  const notFound =
    isFetching && (!data || data?.length === 0) ? (
      <Spin size="small" />
    ) : (
      <Empty description={t("common.search.noResults")} />
    );

  return (
    <AntdCascader
      rootClassName={`[&_.ant-select-item-option-selected]:!font-normal [&.ant-select:not(.ant-select-status-error)_.ant-select-selector]:!bg-gray-600 
       [&.ant-select-status-error_.ant-select-selector]:!bg-red-400`}
      className={`w-full min-w-[178px] [&_.ant-select-selection-placeholder]:font-medium ${sizeClass} [&_.ant-select-selection-wrap]:!min-h-9`}
      variant="filled"
      options={api ? filteredData : options}
      placeholder={placeholder}
      showSearch
      suffixIcon={<Icon icon={"chevron-down"} color={rotateIcon(isOpen)} />}
      allowClear
      value={computedValue}
      onChange={onChange}
      onClear={handleClear}
      onSearch={handleSearch}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      notFoundContent={notFound}
      disabled={disabled}
      changeOnSelect={changeOnSelect}
    />
  );
};
