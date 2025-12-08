import { Modal, Spin } from "antd";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReactNode,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ApiService } from "@/shared/lib/services";
import { useTranslation } from "react-i18next";
import { TableDataResponse } from "@/shared/hooks/useTableFetch";
import { cn } from "@/shared/helpers";
import { getRandomId } from "@/shared/utils";
import { ImageWithFallback } from "@/shared/ui";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";

const PAGE_SIZE = 12;

type ItemType = {
  id: string;
  name: string;
  [key: string]: number | string | boolean | unknown;
};

export const ImageSelectPopover = <T extends ItemType = ItemType>({
  fetchUrl,
  labelKey = "name",
  valueKey = "id",
  imageKey,
  renderItem,
  value,
  onChange,
  placeholder = "",
  params,
}: {
  fetchUrl: string;
  labelKey: string;
  valueKey: string;
  imageKey?: string;
  renderItem?: (item: T) => ReactNode;
  value?: string | number | T;
  onChange: (item: T) => void;
  params?: Record<string, unknown>;
  placeholder?: string;
}) => {
  const { t } = useTranslation();
  const { getAssetUrl } = useStaticAssetsUrl();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<string | number>>(
    new Set(),
  );
  const [selectedImageFailed, setSelectedImageFailed] = useState(false);
  const [fetchEnabled, setFetchEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const getItemTextLabel = (item: T | null | undefined): string => {
    if (!item) return "-";
    const possibleName = (item as unknown as { name?: string }).name;
    const possibleTitle = (item as unknown as { title?: string }).title;
    const possibleLabel = item[labelKey] as unknown as
      | string
      | number
      | undefined;
    return String(
      (possibleName && String(possibleName).trim()) ||
        (possibleTitle && String(possibleTitle).trim()) ||
        (possibleLabel !== undefined ? possibleLabel : "-"),
    );
  };

  const getItemImagePath = (item: T | null | undefined): string => {
    if (!item) return "";

    // If imageKey is provided, use it first
    const imageKeyValue = imageKey
      ? (item as unknown as Record<string, string | undefined>)?.[imageKey]
      : undefined;

    const primary = (item as unknown as Record<string, string | undefined>)?.[
      labelKey
    ];
    const fallbackImageUrl = (item as unknown as { image_url?: string })
      ?.image_url;
    const fallbackFrameworkImage = (
      item as unknown as { framework_image?: string }
    )?.framework_image;

    const rawPath =
      imageKeyValue ||
      primary ||
      fallbackImageUrl ||
      fallbackFrameworkImage ||
      "";
    return getAssetUrl(rawPath);
  };

  const fetchItems = async ({ pageParam = 0 }) =>
    await ApiService.$get<TableDataResponse<T>>(fetchUrl, {
      params: {
        limit: PAGE_SIZE,
        offset: pageParam,
        ...params,
      },
    });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [fetchUrl, params],
      queryFn: fetchItems,
      getNextPageParam: (lastPage, allPages) => {
        // Add null checks to prevent the error
        if (
          !lastPage ||
          !lastPage.results ||
          !Array.isArray(lastPage.results)
        ) {
          return undefined;
        }
        return lastPage.results.length === PAGE_SIZE
          ? allPages.length * PAGE_SIZE
          : undefined;
      },
      initialPageParam: 0,
      enabled: fetchEnabled && open,
    });

  const allItems = data?.pages.flatMap((p) => p?.results || []) || [];

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleSelect = (item: T) => {
    setSelectedItem(item);
    onChange(item);
    setOpen(false);
  };

  const fetchItemByIdRef = useRef<
    ((id: string | number) => Promise<void>) | null
  >(null);

  const fetchItemById = useCallback(
    async (id: string | number) => {
      if (!fetchUrl) return;

      const url = `${fetchUrl}?id=${id}`;
      const response = await ApiService.$get<TableDataResponse<T>>(url, {
        params: { offset: 0, limit: 1, ...params },
      });

      const item = response?.results?.find((item) => item[valueKey] == id);

      if (item) {
        setSelectedItem(item);

        // Add the item to the query cache if it doesn't exist
        queryClient.setQueryData([fetchUrl, params], (oldData: any) => {
          if (!oldData) {
            return { pages: [{ results: [item] }], pageParams: [0] };
          }

          // Check if item already exists in cache
          const exists = oldData.pages.some((page: any) =>
            page?.results?.some(
              (existingItem: T) => existingItem[valueKey] == id,
            ),
          );

          if (!exists) {
            return {
              ...oldData,
              pages: [{ results: [item] }, ...oldData.pages],
            };
          }

          return oldData;
        });
      }
    },
    [fetchUrl, params, valueKey, queryClient],
  );

  // Update the ref whenever fetchItemById changes
  useEffect(() => {
    fetchItemByIdRef.current = fetchItemById;
  }, [fetchItemById]);

  useEffect(() => {
    if (!value) {
      setSelectedItem(null);
      setSelectedImageFailed(false);
      return;
    }

    // If value is an object, use it directly - no API call needed
    if (typeof value === "object" && value !== null) {
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
        setSelectedItem(foundItem);
        setSelectedImageFailed(false);
      } else if (fetchUrl && fetchItemByIdRef.current) {
        // Item not found in existing data and we have a fetch URL - make API call
        fetchItemByIdRef.current(value);
      }
    }
  }, [value, valueKey, fetchUrl, params]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !fetchEnabled) {
      setFetchEnabled(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded border border-gray-700 p-2",
          selectedItem?.[valueKey] ? "w-36" : "w-full",
        )}
        onClick={() => handleOpenChange(true)}
      >
        {selectedItem ? (
          <ImageWithFallback
            src={getItemImagePath(selectedItem)}
            alt=""
            fallbackText={getItemTextLabel(selectedItem)}
            className="h-full w-full"
            imageClassName="h-full w-full object-cover"
            fallbackClassName="h-full w-full text-sm"
            spinnerSize="small"
            onError={() => setSelectedImageFailed(true)}
          />
        ) : (
          <span className="text-sm text-gray-400">
            {placeholder || t("common.select")}
          </span>
        )}
      </div>

      <Modal
        title={t("common.select")}
        open={open}
        onCancel={handleClose}
        footer={null}
        width={800}
        className="!p-0"
        centered
      >
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="max-h-[70vh] overflow-y-auto p-4"
        >
          <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {allItems.map((item) => (
              <div
                key={String(item?.[valueKey]) || getRandomId("image_select_")}
                className={cn(
                  "group cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 hover:shadow-lg",
                  item?.[valueKey] === selectedItem?.[valueKey]
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300",
                )}
                onClick={() => handleSelect(item)}
              >
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <div className="relative">
                    <ImageWithFallback
                      src={getItemImagePath(item)}
                      alt={getItemTextLabel(item)}
                      fallbackText={getItemTextLabel(item)}
                      className="h-32 w-full"
                      imageClassName="h-32 w-full rounded object-cover"
                      fallbackClassName="h-32 w-full rounded flex items-center justify-center text-xs text-gray-500"
                      spinnerSize="small"
                      onError={() =>
                        setFailedImageIds((prev) => {
                          const next = new Set(prev);
                          next.add(item?.[valueKey] as string | number);
                          return next;
                        })
                      }
                    />
                    <div className="mt-2 text-center">
                      <p className="truncate text-xs text-gray-600">
                        {getItemTextLabel(item)}
                      </p>
                    </div>
                    {item?.[valueKey] === selectedItem?.[valueKey] && (
                      <div className="absolute right-2 top-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {isFetchingNextPage && (
            <div className="py-4 text-center">
              <Spin size="default" />
              <p className="mt-2 text-sm text-gray-500">
                {t("common.loading")}...
              </p>
            </div>
          )}
          {allItems.length === 0 && !isFetchingNextPage && (
            <div className="py-8 text-center">
              <p className="text-gray-500">{t("common.noData")}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
