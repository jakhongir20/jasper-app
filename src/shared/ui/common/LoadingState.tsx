import { Spin } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  className?: string;
  size?: "small" | "default" | "large";
  text?: string;
  showText?: boolean;
}

export const LoadingState: FC<LoadingStateProps> = ({
  className = "",
  size = "default",
  text,
  showText = true,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <Spin size={size} />
      {showText && (
        <p className="mt-4 text-gray-600">
          {text || t("common.messages.loading")}
        </p>
      )}
    </div>
  );
};
