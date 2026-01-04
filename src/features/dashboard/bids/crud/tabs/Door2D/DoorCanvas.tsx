import { FC, useMemo } from "react";
import { calculateDoorSizes, formatDimensions } from "./utils/calcSizes";
import {
  DoorConfig,
  getCrownById,
  getDoorById,
  getFrameById,
  getLockById,
} from "./data/data2D";
import { cn } from "@/shared/helpers";

/** Image URLs from API */
interface ImageUrls {
  doorUrl?: string;
  frameUrl?: string;
  crownUrl?: string;
  lockUrl?: string;
}

interface DoorCanvasProps {
  /** Door configuration */
  config: DoorConfig;
  /** Container width in pixels */
  containerWidth?: number;
  /** Container height in pixels */
  containerHeight?: number;
  /** Whether to show dimension labels */
  showDimensions?: boolean;
  /** Image URLs from API (overrides static svgUrl from mockData) */
  imageUrls?: ImageUrls;
  /** Custom class name */
  className?: string;
}

/**
 * Main Door 2D Canvas component
 * Uses layered images approach - each part is rendered as a separate image
 * stacked on top of each other with CSS positioning
 */
export const DoorCanvas: FC<DoorCanvasProps> = ({
  config,
  containerWidth = 350,
  containerHeight = 450,
  showDimensions = true,
  imageUrls,
  className,
}) => {
  // Get variant data from mockData (fallback when no API images)
  const frameVariant = useMemo(
    () => getFrameById(config.frameId),
    [config.frameId],
  );
  const crownVariant = useMemo(
    () => (config.crownId ? getCrownById(config.crownId) : null),
    [config.crownId],
  );
  const doorVariant = useMemo(
    () => getDoorById(config.doorId),
    [config.doorId],
  );
  const lockVariant = useMemo(
    () => (config.lockId ? getLockById(config.lockId) : null),
    [config.lockId],
  );

  // Determine which URLs to use (API images take priority)
  const doorUrl = imageUrls?.doorUrl || doorVariant?.svgUrl;
  const frameUrl = imageUrls?.frameUrl || frameVariant?.svgUrl;
  const crownUrl = imageUrls?.crownUrl || crownVariant?.svgUrl;
  const lockUrl = imageUrls?.lockUrl || lockVariant?.svgUrl;

  // Calculate all sizes for dimension labels
  const sizes = useMemo(() => calculateDoorSizes(config), [config]);

  // Dimension labels
  const leafDimLabel = formatDimensions(sizes.leafWidth, sizes.leafHeight);
  const frameDimLabel = `${Math.round(sizes.frameOuterWidth / 10)}×${Math.round(sizes.frameOuterHeight / 10)}×2 (${Math.round(sizes.frameArea * 100)}m)`;

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      style={{ width: containerWidth }}
    >
      {/* Door visualization container */}
      <div
        className="relative"
        style={{
          width: containerWidth,
          height: containerHeight,
        }}
      >
        {/* Wall color background - covers bottom 85% to avoid area above door */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "100%",
            backgroundColor: config.wallColor,
            zIndex: 0,
          }}
        />

        {/* Frame layer - background */}
        {frameUrl && (
          <img
            src={frameUrl}
            alt="Frame"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ zIndex: 10 }}
          />
        )}

        {/* Door layer - middle */}
        {doorUrl && (
          <img
            src={doorUrl}
            alt="Door"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ zIndex: 20 }}
          />
        )}

        {/* Crown layer - on top of frame */}
        {crownUrl && (
          <img
            src={crownUrl}
            alt="Crown"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ zIndex: 30 }}
          />
        )}

        {/* Lock layer - on top */}
        {lockUrl && (
          <img
            src={lockUrl}
            alt="Lock"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ zIndex: 40 }}
          />
        )}
      </div>
    </div>
  );
};

export default DoorCanvas;
