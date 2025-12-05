import { TableAction } from "@/shared/ui";
import type { ColumnType } from "antd/es/table";
import { TransactionFormType as Transaction } from "@/features/dashboard/bids/model";
import i18n from "@/app/i18n";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";
import {
  chamferOptions,
  crownStyleOptions,
  doorwayTypeOptions,
  openingDirectionOptions,
  openingSideOptions,
  sashOptions,
  sheathingOptions,
  thresholdTypeOptions,
  trimStyleOptions,
  underTrimStyleOptions,
  upTrimStyleOptions,
  veenerTypeOptions,
} from "@/features/dashboard/bids";

const t = i18n.t;

export const useTableTransactionColumns = (options: {
  onDelete: (record: Transaction) => void;
  onEdit: (record: Transaction) => void;
  mode?: "add" | "edit";
}): ColumnType<Transaction>[] => {
  const { getAssetUrl } = useStaticAssetsUrl();

  return [
    {
      title: t("common.labels.location"),
      dataIndex: "location",
      render: (location) => {
        // Handle if location is a string (location_id or name)
        if (typeof location === "string") {
          return location || "-";
        }
        // Handle if location is an object with name property
        if (location && typeof location === "object" && "name" in location) {
          return location.name || "-";
        }
        return "-";
      },
    },
    {
      title: t("common.labels.doorType"),
      dataIndex: "door_type",
      render: (doorType) => doorType || "-",
    },
    {
      title: t("common.labels.product_id"),
      dataIndex: "product_id",
      key: "product_id",
      render: (product_id, record): string => {
        // In edit mode, the full object is in record.product
        if (options.mode === "edit" && record.product) {
          return (
            `${record.product.name || ""} / ${record.product.feature || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, product_id is the full object
        if (!product_id) return "-";
        return (
          `${product_id.name || ""} / ${product_id.feature || ""}`.trim() || "-"
        );
      },
    },
    {
      title: t("common.labels.veneer_type"),
      dataIndex: "veneer_type",
      render: (type) => {
        if (!type) return "-";
        return (
          veenerTypeOptions.find((item) => item.value === type)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.lining_number"),
      dataIndex: "lining_number",
      render: (lining_number, record) => {
        // Try to get lining object from record.lining first, then from lining_number
        const lining = record.lining || lining_number;
        if (!lining || !lining.image_url) return "-";
        return (
          <img
            className="w-24 object-scale-down"
            src={getAssetUrl(lining.image_url)}
            alt="lining number"
          />
        );
      },
    },
    {
      title: t("common.labels.frame_front"),
      dataIndex: "frame_front_id",
      render: (frame_id, record) => {
        // Try to get frame object from record.frame_front first, then from frame_id
        const frame = record.frame_front || frame_id;
        if (!frame || !frame.image_url) return "-";
        return (
          <img
            src={getAssetUrl(frame.image_url)}
            className="w-24 object-scale-down"
            alt="frame front"
          />
        );
      },
    },
    {
      title: t("common.labels.frame_back"),
      dataIndex: "frame_back_id",
      render: (frame_id, record) => {
        // Try to get frame object from record.frame_back first, then from frame_id
        const frame = record.frame_back || frame_id;
        if (!frame || !frame.image_url) return "-";
        return (
          <img
            className="w-24 object-scale-down"
            src={getAssetUrl(frame.image_url)}
            alt="frame back"
          />
        );
      },
    },
    {
      title: t("common.labels.doorway_type"),
      dataIndex: "doorway_type",
      render: (type) => {
        if (!type) return "-";
        return (
          doorwayTypeOptions.find((item) => item.value == type)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.doorway_thickness"),
      dataIndex: "doorway_thickness",
      render: (thickness) => thickness || "-",
    },
    {
      title: t("common.labels.height"),
      dataIndex: "height",
      render: (height) => height || "-",
    },
    {
      title: t("common.labels.width"),
      dataIndex: "width",
      render: (width) => width || "-",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "quantity",
      render: (quantity) => quantity || "-",
    },
    {
      title: t("common.labels.opening_side"),
      dataIndex: "opening_side",
      render: (side) => {
        if (!side) return "-";
        return (
          openingSideOptions.find((item) => item.value === side)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.opening_direction"),
      dataIndex: "opening_direction",
      render: (direction) => {
        if (!direction) return "-";
        return (
          openingDirectionOptions.find((item) => item.value === direction)
            ?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.box_width"),
      dataIndex: "box_width",
      render: (boxWidth) => boxWidth || "-",
    },
    {
      title: t("common.labels.threshold"),
      dataIndex: "threshold",
      render: (threshold) => {
        if (!threshold) return "-";
        return (
          thresholdTypeOptions.find((item) => item.value === threshold)
            ?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.chamfer"),
      dataIndex: "chamfer",
      render: (chamfer) => {
        if (!chamfer) return "-";
        return (
          chamferOptions.find((item) => item.value === chamfer)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.sash"),
      dataIndex: "sash",
      render: (sash) => {
        if (!sash) return "-";
        return sashOptions.find((item) => item.value === sash)?.label || "-";
      },
    },
    {
      title: t("common.labels.transom_or_canvas"),
      dataIndex: "transom_or_canvas",
      render: (transom) => transom || "-",
    },
    {
      title: t("common.labels.sheathing_id"),
      dataIndex: "sheathing_id",
      key: "sheathing_id",
      render: (sheathingId, record): string => {
        // Check if sheathing_id is actually a full object (in edit mode)
        if (
          sheathingId &&
          typeof sheathingId === "object" &&
          sheathingId.name
        ) {
          return (
            `${sheathingId.name || ""} / ${sheathingId.feature || ""}`.trim() ||
            "-"
          );
        }
        // In edit mode, check if the full object is in record.sheathing
        if (options.mode === "edit" && record.sheathing) {
          return (
            `${record.sheathing.name || ""} / ${record.sheathing.feature || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, sheathing_id is just the ID number
        if (!sheathingId) return "-";
        return String(sheathingId);
      },
    },
    {
      title: t("common.labels.sheathing_style"),
      dataIndex: "sheathing_style",
      render: (style) => {
        if (!style) return "-";
        return (
          sheathingOptions.find((item) => item.value === style)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.trim_id"),
      dataIndex: "trim_id",
      key: "trim_id",
      render: (trimId, record): string => {
        // Check if trim_id is actually a full object (in edit mode)
        if (trimId && typeof trimId === "object" && trimId.name) {
          return `${trimId.name || ""} / ${trimId.measure || ""}`.trim() || "-";
        }
        // In edit mode, check if the full object is in record.trim
        if (options.mode === "edit" && record.trim) {
          return (
            `${record.trim.name || ""} / ${record.trim.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, trim_id is just the ID number
        if (!trimId) return "-";
        return String(trimId);
      },
    },
    {
      title: t("common.labels.trim_style"),
      dataIndex: "trim_style",
      render: (trim) => {
        if (!trim) return "-";
        return (
          trimStyleOptions.find((item) => item.value === trim)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.up_trim_id"),
      dataIndex: "up_trim_id",
      key: "up_trim_id",
      render: (upTrimId, record): string => {
        // Check if up_trim_id is actually a full object (in edit mode)
        if (upTrimId && typeof upTrimId === "object" && upTrimId.name) {
          return (
            `${upTrimId.name || ""} / ${upTrimId.measure || ""}`.trim() || "-"
          );
        }
        // In edit mode, check if the full object is in record.up_trim
        if (options.mode === "edit" && record.up_trim) {
          return (
            `${record.up_trim.name || ""} / ${record.up_trim.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, up_trim_id is just the ID number
        if (!upTrimId) return "-";
        return String(upTrimId);
      },
    },
    {
      title: t("common.labels.up_trim_quantity"),
      dataIndex: "up_trim_quantity",
      render: (quantity) => quantity || "-",
    },
    {
      title: t("common.labels.up_trim_style"),
      dataIndex: "up_trim_style",
      render: (trim) => {
        if (!trim) return "-";
        return (
          upTrimStyleOptions.find((item) => item.value === trim)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.under_trim_id"),
      dataIndex: "under_trim_id",
      key: "under_trim_id",
      render: (underTrimId, record): string => {
        // Check if under_trim_id is actually a full object (in edit mode)
        if (
          underTrimId &&
          typeof underTrimId === "object" &&
          underTrimId.name
        ) {
          return (
            `${underTrimId.name || ""} / ${underTrimId.measure || ""}`.trim() ||
            "-"
          );
        }
        // In edit mode, check if the full object is in record.under_trim
        if (options.mode === "edit" && record.under_trim) {
          return (
            `${record.under_trim.name || ""} / ${record.under_trim.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, under_trim_id is just the ID number
        if (!underTrimId) return "-";
        return String(underTrimId);
      },
    },
    {
      title: t("common.labels.under_trim_quantity"),
      dataIndex: "under_trim_quantity",
      render: (quantity) => quantity || "-",
    },
    {
      title: t("common.labels.under_trim_style"),
      dataIndex: "under_trim_style",
      render: (trim) => {
        if (!trim) return "-";
        return (
          underTrimStyleOptions.find((item) => item.value === trim)?.label ||
          "-"
        );
      },
    },
    {
      title: t("common.labels.filler_id"),
      dataIndex: "filler_id",
      key: "filler_id",
      render: (fillerId, record): string => {
        // Check if filler_id is actually a full object (in edit mode)
        if (fillerId && typeof fillerId === "object" && fillerId.name) {
          return (
            `${fillerId.name || ""} / ${fillerId.measure || ""}`.trim() || "-"
          );
        }
        // In edit mode, check if the full object is in record.filler
        if (options.mode === "edit" && record.filler) {
          return (
            `${record.filler.name || ""} / ${record.filler.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, filler_id is just the ID number
        if (!fillerId) return "-";
        return String(fillerId);
      },
    },
    {
      title: t("common.labels.crown_id"),
      dataIndex: "crown_id",
      key: "crown_id",
      render: (crownId, record): string => {
        // Check if crown_id is actually a full object (in edit mode)
        if (crownId && typeof crownId === "object" && crownId.name) {
          return (
            `${crownId.name || ""} / ${crownId.measure || ""}`.trim() || "-"
          );
        }
        // In edit mode, check if the full object is in record.crown
        if (options.mode === "edit" && record.crown) {
          return (
            `${record.crown.name || ""} / ${record.crown.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, crown_id is just the ID number
        if (!crownId) return "-";
        return String(crownId);
      },
    },
    {
      title: t("common.labels.crown_style"),
      dataIndex: "crown_style",
      render: (trim) => {
        if (!trim) return "-";
        return (
          crownStyleOptions.find((item) => item.value === trim)?.label || "-"
        );
      },
    },
    {
      title: t("common.labels.glass_id"),
      dataIndex: "glass_id",
      key: "glass_id",
      render: (glassId, record): string => {
        // Check if glass_id is actually a full object (in edit mode)
        if (glassId && typeof glassId === "object" && glassId.name) {
          return (
            `${glassId.name || ""} / ${glassId.measure || ""}`.trim() || "-"
          );
        }
        // In edit mode, check if the full object is in record.glass
        if (options.mode === "edit" && record.glass) {
          return (
            `${record.glass.name || ""} / ${record.glass.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, glass_id is just the ID number
        if (!glassId) return "-";
        return String(glassId);
      },
    },
    {
      title: t("common.labels.glass_quantity"),
      dataIndex: "glass_quantity",
      render: (quantity) => quantity || "-",
    },
    {
      title: t("common.labels.door_lock_id"),
      dataIndex: "door_lock_id",
      key: "door_lock_id",
      render: (doorLockId, record): string => {
        // Check if door_lock_id is actually a full object (in edit mode)
        if (doorLockId && typeof doorLockId === "object" && doorLockId.name) {
          return (
            `${doorLockId.name || ""} / ${doorLockId.measure || ""}`.trim() ||
            "-"
          );
        }
        // In edit mode, check if the full object is in record.door_lock
        if (options.mode === "edit" && record.door_lock) {
          return (
            `${record.door_lock.name || ""} / ${record.door_lock.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, door_lock_id is just the ID number
        if (!doorLockId) return "-";
        return String(doorLockId);
      },
    },
    {
      title: t("common.labels.door_lock_quantity"),
      dataIndex: "door_lock_quantity",
      render: (quantity) => quantity || "-",
    },
    {
      title: t("common.labels.canopy_id"),
      dataIndex: "canopy_id",
      key: "canopy_id",
      render: (canopyId, record): string => {
        // Check if canopy_id is actually a full object (in edit mode)
        if (canopyId && typeof canopyId === "object" && canopyId.name) {
          return (
            `${canopyId.name || ""} / ${canopyId.measure || ""}`.trim() || "-"
          );
        }
        // In edit mode, check if the full object is in record.canopy
        if (options.mode === "edit" && record.canopy) {
          return (
            `${record.canopy.name || ""} / ${record.canopy.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, canopy_id is just the ID number
        if (!canopyId) return "-";
        return String(canopyId);
      },
    },
    {
      title: t("common.labels.canopy_quantity"),
      dataIndex: "canopy_quantity",
      render: (quantity) => quantity || "-",
    },
    {
      title: t("common.labels.latch_id"),
      dataIndex: "latch_id",
      key: "latch_id",
      render: (latchId, record): string => {
        // Check if latch_id is actually a full object (in edit mode)
        if (latchId && typeof latchId === "object" && latchId.name) {
          return (
            `${latchId.name || ""} / ${latchId.measure || ""}`.trim() || "-"
          );
        }
        // In edit mode, check if the full object is in record.latch
        if (options.mode === "edit" && record.latch) {
          return (
            `${record.latch.name || ""} / ${record.latch.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, latch_id is just the ID number
        if (!latchId) return "-";
        return String(latchId);
      },
    },
    {
      title: t("common.labels.latch_quantity"),
      dataIndex: "latch_quantity",
      render: (quantity) => quantity || "-",
    },
    {
      title: t("common.labels.box_service_id"),
      dataIndex: "box_service_id",
      key: "box_service_id",
      render: (boxServiceId, record): string => {
        // Check if box_service_id is actually a full object (in edit mode)
        if (
          boxServiceId &&
          typeof boxServiceId === "object" &&
          boxServiceId.name
        ) {
          return (
            `${boxServiceId.name || ""} / ${boxServiceId.measure || ""}`.trim() ||
            "-"
          );
        }
        // In edit mode, check if the full object is in record.box_service
        if (options.mode === "edit" && record.box_service) {
          return (
            `${record.box_service.name || ""} / ${record.box_service.measure || ""}`.trim() ||
            "-"
          );
        }
        // In add mode, box_service_id is just the ID number
        if (!boxServiceId) return "-";
        return String(boxServiceId);
      },
    },
    {
      title: t("common.labels.actions"),
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
