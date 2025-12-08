import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";
import { useMemo, useCallback } from "react";

import { CDate } from "@/shared/ui";
import { ImageWithFallback } from "@/shared/ui/image/ImageWithFallback";
import { TableAction } from "@/shared/ui/table/action/TableAction";
import { Framework } from "@/features/admin/frameworks";

export const columns = (
  t: TFunction<"translation", undefined>,
  options: {
    onOpenDelete: (data: Framework) => void;
    onOpenEdit: (data: Framework) => void;
    canEdit: boolean;
    canDelete: boolean;
    baseUrl: string;
  },
): ColumnType<Framework>[] => {
  // Render functions
  const renderImage = (imageUrl: string | undefined, record: Framework) => {
    const fullImageUrl = imageUrl ? `${options.baseUrl}/${imageUrl}` : null;

    return (
      <div className="flex h-12 w-12 items-center justify-center">
        <ImageWithFallback
          src={fullImageUrl}
          alt={record?.name || "Framework"}
          className="h-12 w-12 rounded object-cover"
          fallbackText="No Image"
          fallbackClassName="h-12 w-12 rounded bg-gray-50 border border-gray-800 flex items-center justify-center text-xs text-gray-500"
          imageClassName="h-12 w-12 rounded object-cover"
        />
      </div>
    );
  };

  const renderOrder = useCallback((order: number) => order || 0, []);

  const renderCreatedAt = useCallback((createdAt: number) => {
    return createdAt ? <CDate value={new Date(createdAt * 1000)} /> : "-";
  }, []);

  return useMemo(
    () => [
      {
        key: "name",
        title: t("common.labels.number"),
        dataIndex: "name",
      },
      {
        key: "image_url",
        title: t("common.labels.image"),
        dataIndex: "image_url",
        width: 120,
        render: renderImage,
      },
      {
        key: "order_number",
        title: t("common.labels.order"),
        dataIndex: "order_number",
        width: 100,
        render: renderOrder,
      },
      {
        key: "created_at",
        title: t("common.labels.createdAt"),
        dataIndex: "created_at",
        width: 120,
        render: renderCreatedAt,
      },
      ...(options.canDelete || options.canEdit
        ? [
          {
            title: null,
            dataIndex: "action",
            fixed: "right" as const,
            width: 120,
            render: (_: unknown, record: Framework) => {
              return (
                <TableAction
                  showDelete={options.canDelete}
                  showEdit={options.canEdit}
                  onDelete={() => options.onOpenDelete(record)}
                  onEdit={() => options.onOpenEdit(record)}
                />
              );
            },
          },
        ]
        : []),
    ],
    [t, options],
  );
};
