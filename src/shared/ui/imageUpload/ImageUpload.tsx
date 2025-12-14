import React, { FC, useEffect, useMemo, useState } from "react";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Icon } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import "./index.css";
import { useToast } from "@/shared/hooks";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";

interface ImageUploadProps {
  onImageUpload?: (base64Image: string | null) => void; // Callback to pass the Base64 image back to the parent
  onChange?: (value: string | null) => void;
  buttonText?: string; // Customizable button text
  maxSize?: number; // Maximum file size in MB
  allowedFormats?: string[]; // Allowed file formats
  label?: string;
  hasError?: boolean; // New prop to indicate validation error
  value?: string; // Default image URL
  showDelete?: boolean; // Whether to show delete button
}

type FileType = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (
  file: FileType,
  maxSize: number,
  allowedFormats: string[],
  toast: any,
  t: any,
) => {
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
  return true;
};

export const ImageUpload: FC<ImageUploadProps> = ({
  onChange,
  onImageUpload,
  buttonText,
  label,
  maxSize = 5,
  allowedFormats = ["image/png", "image/jpeg", "image/jpg"],
  hasError = false,
  value,
  showDelete = true,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getAssetUrl } = useStaticAssetsUrl();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(value);

  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  // Get the display URL with base URL prepended if needed
  // Add cache-busting parameter to prevent browser caching issues
  const displayImageUrl = useMemo(() => {
    if (!imageUrl) return undefined;

    // If it's a base64 string, use as is
    if (imageUrl.startsWith("data:image/")) {
      return imageUrl;
    }

    let url: string;
    // If it's already a full URL (http/https), use as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      url = imageUrl;
    } else {
      // Otherwise, it's a relative path - prepend base URL
      url = getAssetUrl(imageUrl);
    }

    // Add cache-busting parameter for non-base64 URLs
    const cacheBuster = `t=${Date.now()}`;
    return url.includes("?") ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
  }, [imageUrl, getAssetUrl]);

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done" || info.file.originFileObj) {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);

        if (onChange) {
          onChange(url); // Call onChange if provided
        }

        if (onImageUpload) {
          onImageUpload(url); // Pass Base64 image back to parent
        }
      });
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setImageUrl(undefined);

    if (onChange) {
      onChange(null); // Update form field value
    }

    if (onImageUpload) {
      onImageUpload(null); // Pass null back to parent
    }
  };

  const uploadButton = (
    <button type="button" className={""}>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <Icon
          icon={"imageUpload"}
          width={50}
          color="size-[37px] text-gray-400 transition-all duration-300 group-hover:text-primary"
        />
      )}
      <p
        className={
          "mt-2 text-base font-medium text-gray-400 transition-all duration-300 group-hover:text-primary"
        }
      >
        {buttonText || t("common.fileUploader.addImage")}
      </p>
    </button>
  );

  return (
    <div>
      {label && <div className="mb-6px text-sm font-normal">{label}</div>}
      <Upload
        action=""
        customRequest={({ onSuccess }) =>
          setTimeout(() => onSuccess?.("ok"), 0)
        }
        key={imageUrl}
        rootClassName={`[&_.ant-upload]:!size-[148px] [&_.ant-upload]:!bg-transparent [&_.ant-upload]:!rounded-xl [&_.ant-upload-select]:rounded-xl [&_.ant-upload-select]:!border-none ${
          hasError ? "bg-red-500" : ""
        }`}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader group w-fit"
        showUploadList={false}
        beforeUpload={(file) =>
          beforeUpload(file, maxSize, allowedFormats, toast, t)
        }
        onChange={handleChange}
      >
        {imageUrl ? (
          <div
            className={
              "group relative z-50 flex size-[148px] max-h-[148px] max-w-[148px] items-center justify-center overflow-hidden"
            }
          >
            <img
              key={displayImageUrl}
              src={displayImageUrl}
              className={
                "h-full w-full overflow-hidden rounded-xl object-cover"
              }
              alt={""}
              style={{ width: "100%" }}
            />
            <div
              className={"absolute right-2 top-2 flex transform flex-col gap-1"}
            >
              <div
                className={
                  "flex size-6 items-center justify-center rounded-md bg-gray-200/[64%]"
                }
              >
                <Icon
                  icon={"pen-square"}
                  color={"text-white size-3.5 transition-opacity duration-300"}
                />
              </div>
              {showDelete && (
                <div
                  className={
                    "flex size-6 items-center justify-center rounded-md bg-gray-200/[64%]"
                  }
                  onClick={handleDelete}
                >
                  <Icon
                    icon={"trash"}
                    color={"text-white size-3.5 transition-opacity duration-300"}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
        {maxSize && (
          <p className="w-fit rounded-md bg-gray-600 px-2 py-1 text-xs text-black">
            <span className="font-normal">
              {t("common.fileUploader.maxSize")}:
            </span>
            <span className={"font-medium"}>
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
            <span className={"font-medium"}>
              {allowedFormats.map((format) => format.split("/")[1]).join(", ")}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
