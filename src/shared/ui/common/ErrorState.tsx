import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "@/shared/ui";

interface ErrorStateProps {
  className?: string;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
  type?: "notFound" | "error" | "custom";
}

export const ErrorState: FC<ErrorStateProps> = ({
  className = "",
  title,
  description,
  showBackButton = true,
  backButtonText,
  onBack,
  type = "error",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case "notFound":
        return {
          title: title || t("common.details.pageNotFound"),
          description: description || t("common.details.pageNotFoundDetail"),
        };
      case "error":
        return {
          title: title || t("common.details.serverError"),
          description: description || t("common.details.serverErrorDetail"),
        };
      default:
        return {
          title: title || t("common.messages.error"),
          description: description || t("common.messages.error"),
        };
    }
  };

  const { title: displayTitle, description: displayDescription } =
    getDefaultContent();

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <div className="mb-6">
        <img
          src={type === "notFound" ? "/404.svg" : "/500.svg"}
          alt={type === "notFound" ? "404" : "500"}
          className="h-48 w-auto"
        />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-gray-900">{displayTitle}</h2>

      <p className="mb-8 max-w-md text-center text-gray-600">
        {displayDescription}
      </p>

      {showBackButton && (
        <Button
          color="primary"
          icon={<Icon icon="arrow-left" color="text-white" />}
          type="link"
          onClick={handleBack}
        >
          {backButtonText || t("common.details.goToHome")}
        </Button>
      )}
    </div>
  );
};
