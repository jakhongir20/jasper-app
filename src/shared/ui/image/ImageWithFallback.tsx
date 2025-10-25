import { Spin } from "antd";
import { FC, useState } from "react";
import { cn } from "@/shared/helpers";

interface ImageWithFallbackProps {
  src: string | null;
  alt?: string;
  fallbackText: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  spinnerSize?: "small" | "default" | "large";
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  src,
  alt = "",
  fallbackText,
  className = "",
  imageClassName = "",
  fallbackClassName = "",
  spinnerSize = "default",
  onLoad,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    onError?.();
  };

  // If no src provided, show fallback immediately
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-center text-xs text-gray-600",
          fallbackClassName,
          className,
        )}
      >
        {fallbackText}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-center text-xs text-gray-600",
          fallbackClassName,
          className,
        )}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spin size={spinnerSize} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          imageClassName,
          loading ? "opacity-0" : "opacity-100",
          "transition-opacity duration-200",
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
