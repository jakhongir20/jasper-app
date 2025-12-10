import React, { FC, useState, useMemo } from "react";
import type { UploadFile, UploadProps } from "antd";
import { Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useToast } from "@/shared/hooks";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";
import { ProductImageAssignmentEnumEntity } from "@/shared/lib/api/generated/gateway/model/productImageAssignmentEnumEntity";

// Russian translations for assignment enum values
const ASSIGNMENT_LABELS: Record<string, string> = {
  "one-sash-door": "Одностворчатая дверь",
  "one-half-sash-door": "Полуторастворчатая дверь",
  "two-sash-door": "Двустворчатая дверь",
  "three-sash-door": "Трёхстворчатая дверь",
  "four-sash-door": "Четырёхстворчатая дверь",

  "one-sash-frame": "Одностворчатый наличник",
  "one-half-sash-frame": "Полуторастворчатый наличник",
  "two-sash-frame": "Двустворчатый наличник",
  "three-sash-frame": "Трёхстворчатый наличник",
  "four-sash-frame": "Четырёхстворчатый наличник",

  "one-sash-crown": "Одностворчатая корона",
  "one-half-sash-crown": "Полуторастворчатая корона",
  "two-sash-crown": "Двустворчатая корона",
  "three-sash-crown": "Трёхстворчатая корона",
  "four-sash-crown": "Четырёхстворчатая корона",

  "one-sash-transom": "Одностворчатая фрамуга",
  "one-half-sash-transom": "Полуторастворчатая фрамуга",
  "two-sash-transom": "Двустворчатая фрамуга",
  "three-sash-transom": "Трёхстворчатая фрамуга",
  "four-sash-transom": "Четырёхстворчатая фрамуга",

  "one-sash-up-frame": "Одностворчатый надналичник",
  "one-half-sash-up-frame": "Полуторастворчатый надналичник",
  "two-sash-up-frame": "Двустворчатый надналичник",
  "three-sash-up-frame": "Трёхстворчатый надналичник",
  "four-sash-up-frame": "Четырёхстворчатый надналичник",

  "one-sash-under-frame": "Одностворчатый подналичник",
  "one-half-sash-under-frame": "Полуторастворчатый подналичник",
  "two-sash-under-frame": "Двустворчатый подналичник",
  "three-sash-under-frame": "Трёхстворчатый подналичник",
  "four-sash-under-frame": "Четырёхстворчатый подналичник",

  "one-sash-trim": "Одностворчатый обклад",
  "one-half-sash-trim": "Полуторастворчатый обклад",
  "two-sash-trim": "Двустворчатый обклад",
  "three-sash-trim": "Трёхстворчатый обклад",
  "four-sash-trim": "Четырёхстворчатый обклад",
};

// Assignment options for product images with Russian labels
const assignmentOptions = Object.values(ProductImageAssignmentEnumEntity).map(
  (value) => ({
    label: ASSIGNMENT_LABELS[value] || value,
    value: value,
  })
);

interface MultipleImageUploadProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  maxCount?: number;
  maxSize?: number; // in MB
  allowedFormats?: string[];
  productId?: number;
  onImageDelete?: (productImageId: number) => Promise<void>;
  showAssignment?: boolean; // Whether to show assignment select for each image
}

type FileType = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];

const getBase64 = (file: FileType): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const MultipleImageUpload: FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  maxCount = 10,
  maxSize = 5,
  allowedFormats = ["image/png", "image/jpeg", "image/jpg"],
  productId,
  onImageDelete,
  showAssignment = false,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getAssetUrl } = useStaticAssetsUrl();
  const [fileList, setFileList] = useState<UploadFile[]>(value);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Helper to get full URL with base URL
  const getDisplayUrl = (url?: string): string | undefined => {
    if (!url) return undefined;

    // If it's a base64 string or full URL, use as is
    if (
      url.startsWith("data:image/") ||
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    // Otherwise, prepend base URL
    return getAssetUrl(url);
  };

  // Process fileList to add full URLs for display
  const displayFileList = useMemo(() => {
    return fileList.map((file) => {
      if (
        file.url &&
        !file.url.startsWith("data:image/") &&
        !file.url.startsWith("http")
      ) {
        return {
          ...file,
          url: getDisplayUrl(file.url),
        };
      }
      return file;
    });
  }, [fileList, getAssetUrl]);

  const beforeUpload = (file: FileType) => {
    const isAllowedFormat = allowedFormats.includes(file.type);
    if (!isAllowedFormat) {
      toast(t("common.fileUploader.formatFotAllowed"), "error");
      return false;
    }
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      toast(t("common.fileUploader.fileSizeNotAllowed"), "error");
      return false;
    }
    return false; // Prevent auto-upload, we'll handle it manually
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    // Process each new file to convert to base64
    const processedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj && !file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj as FileType);
        }
        return file;
      }),
    );

    setFileList(processedFileList);
    onChange?.(processedFileList);
  };

  const handleRemove = async (file: UploadFile) => {
    // If file has product_image_id (existing/saved image), send DELETE request
    const productImageId = (file as any).product_image_id;
    if (productImageId && onImageDelete) {
      try {
        await onImageDelete(productImageId);
        toast(t("toast.delete.success"), "success");
      } catch (error) {
        toast(t("toast.delete.error"), "error");
        return false; // Prevent removal from UI if DELETE fails
      }
    }

    // Remove from file list
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    onChange?.(newFileList);
    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    const previewUrl = getDisplayUrl(file.url) || (file.preview as string);
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };

  const handleAssignmentChange = (uid: string, assignment: string) => {
    const updatedFileList = fileList.map((file) => {
      if (file.uid === uid) {
        return { ...file, assignment };
      }
      return file;
    });
    setFileList(updatedFileList);
    onChange?.(updatedFileList);
  };

  const uploadButton = (
    <button type="button" style={{ border: 0, background: "none" }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t("common.button.uploadImage")}</div>
    </button>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={displayFileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        multiple
        maxCount={maxCount}
        itemRender={
          showAssignment
            ? (originNode, file) => (
                <div className="flex flex-col">
                  {originNode}
                  <Select
                    size="small"
                    placeholder={t("common.labels.assignment")}
                    value={(file as any).assignment}
                    onChange={(value) => handleAssignmentChange(file.uid, value)}
                    options={assignmentOptions}
                    className="mt-1 w-full"
                    style={{ width: "100%" }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </div>
              )
            : undefined
        }
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>

      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
        {maxSize && (
          <p className="w-fit rounded-md bg-gray-600 px-2 py-1 text-xs text-black">
            <span className="font-normal">
              {t("common.fileUploader.maxSize")}:
            </span>
            <span className="font-medium">
              {maxSize}
              {t("common.fileUploader.mb")}
            </span>
          </p>
        )}
        {allowedFormats?.length > 0 && (
          <p className="flex w-fit flex-nowrap space-x-2 rounded-md bg-gray-600 px-2 py-1 text-xs font-medium text-black">
            <span className="font-normal">
              {t("common.fileUploader.allowedFormats")}:
            </span>
            <span className="font-medium">
              {allowedFormats.map((format) => format.split("/")[1]).join(", ")}
            </span>
          </p>
        )}
        <p className="w-fit rounded-md bg-gray-600 px-2 py-1 text-xs text-black">
          <span className="font-normal">{t("common.labels.maxImages")}:</span>
          <span className="font-medium">{maxCount}</span>
        </p>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
          onClick={() => setPreviewOpen(false)}
        >
          <img
            alt="preview"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            src={previewImage}
          />
        </div>
      )}
    </>
  );
};
