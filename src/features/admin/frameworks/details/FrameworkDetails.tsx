import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { Descriptions, Space, Button } from "antd";
import { cn } from "@/shared/helpers";
import { Framework } from "@/features/admin/frameworks/model";
import { ImageWithFallback } from "@/shared/ui/image/ImageWithFallback";
import { useConfiguration } from "@/shared/contexts/ConfigurationContext";

interface Props {
  framework: Framework;
  className?: string;
  onEdit?: () => void;
  onClose?: () => void;
}

export const FrameworkDetails: FC<Props> = ({
  framework,
  className,
  onEdit,
  onClose,
}) => {
  const { t } = useTranslation();
  const { getStaticAssetsBaseUrl } = useConfiguration();

  return (
    <div className={cn("px-4", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-gray-900">
          {t("common.labels.frameworkDetails")}
        </h4>
        <Space>
          {onClose && (
            <Button onClick={onClose}>{t("common.button.close")}</Button>
          )}
          {onEdit && (
            <Button type="primary" onClick={onEdit}>
              {t("common.button.edit")}
            </Button>
          )}
        </Space>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <Descriptions
          title={t("common.labels.frameworkInformation")}
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label={t("common.labels.id")}>
            {framework.framework_id}
          </Descriptions.Item>
          <Descriptions.Item label={t("common.labels.name")}>
            {framework.name}
          </Descriptions.Item>
          <Descriptions.Item label={t("common.labels.order")}>
            {framework.order_number}
          </Descriptions.Item>
          <Descriptions.Item label={t("common.labels.image")}>
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={
                  framework.image_url
                    ? `${getStaticAssetsBaseUrl()}/${framework.image_url}`
                    : null
                }
                alt={framework.name}
                className="h-20 w-20 rounded-lg border border-gray-200"
                fallbackText={t("common.labels.noImage")}
                fallbackClassName="h-20 w-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-sm text-gray-500"
                imageClassName="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {framework.image_url
                    ? t("common.messages.imageUploaded")
                    : t("common.messages.noImageAvailable")}
                </span>
                {framework.image_url && (
                  <span className="text-xs text-gray-500">
                    {t("common.messages.clickToViewFullSize")}
                  </span>
                )}
              </div>
            </div>
          </Descriptions.Item>
          {framework.created_at && (
            <Descriptions.Item label={t("common.labels.createdAt")}>
              {new Date(framework.created_at * 1000).toLocaleDateString()}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </div>
  );
};

export default FrameworkDetails;
