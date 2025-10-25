import { TableAction } from "@/shared/ui";
import React from "react";
import type { ColumnType } from "antd/es/table";
import i18n from "@/app/i18n";
import { AspectFormType as Aspect } from "@/features/dashboard/bids/model";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";

const t = i18n.t;

export const useTableAspectColumns = (options: {
  onDelete: (record: Aspect) => void;
  onEdit: (record: Aspect) => void;
  mode?: "add" | "edit";
}): ColumnType<Aspect>[] => {
  const { getAssetUrl } = useStaticAssetsUrl();

  return [
    {
      title: t("aspect"),
      dataIndex: "aspect_file_payload",
      render: (src) => {
        // In edit mode, the URL might already have the base URL from form transformation
        // or it might be a relative path that needs the base URL
        let imageUrl = src;

        if (options.mode === "edit" && src) {
          // If it doesn't start with http, add the base URL
          if (!src.startsWith("http")) {
            imageUrl = getAssetUrl(src);
          }
        }

        return (
          <img
            className="aspect-auto h-20 object-scale-down"
            src={imageUrl}
            alt="img aspect"
          />
        );
      },
    },
    {
      title: t("comment"),
      dataIndex: "comment",
    },
    {
      title: null,
      dataIndex: "action",
      fixed: "right",
      render: (_, record) => {
        return (
          <TableAction
            showDelete
            onDelete={() => options.onDelete(record)}
            onEdit={() => options.onEdit(record)}
          />
        );
      },
    },
  ];
};
