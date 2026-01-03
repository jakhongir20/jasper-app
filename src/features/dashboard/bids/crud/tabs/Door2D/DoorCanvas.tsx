import { FC, useCallback, useMemo, useState } from "react";
import { SvgPart, Wall } from "./parts";
import { DEFAULT_SCALE, mmToPx } from "./utils/scale";
import { calculateDoorSizes, formatDimensions } from "./utils/calcSizes";
import {
  DoorConfig,
  getCrownById,
  getDoorById,
  getFrameById,
  getLockById,
} from "./data/data2D";

interface DoorCanvasProps {
  /** Door configuration */
  config: DoorConfig;
  /** Container width in pixels */
  containerWidth?: number;
  /** Container height in pixels */
  containerHeight?: number;
  /** Whether to show dimension labels */
  showDimensions?: boolean;
  /** Whether to show the wall background */
  showWall?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Main Door 2D Canvas component
 * Composes all door parts into a complete door visualization
 */
export const DoorCanvas: FC<DoorCanvasProps> = ({
  config,
  containerWidth = 350,
  containerHeight = 450,
  showDimensions = true,
  showWall = true,
  className,
}) => {
  // Get variant data
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

  // Calculate all sizes
  const sizes = useMemo(() => calculateDoorSizes(config), [config]);

  // Calculate scale to fit container
  const scale = useMemo(() => {
    const paddingX = 60;
    const paddingY = 80;
    const availableWidth = containerWidth - paddingX * 2;
    const availableHeight = containerHeight - paddingY * 2;

    const scaleX = availableWidth / sizes.totalWidth;
    const scaleY = availableHeight / sizes.totalHeight;

    return Math.min(scaleX, scaleY, DEFAULT_SCALE);
  }, [containerWidth, containerHeight, sizes]);

  // Convert mm to px with current scale
  const px = (mm: number) => mmToPx(mm, scale);

  // Calculate positions
  const crownHeight = px(sizes.crownHeight);
  const frameWidth = px(sizes.frameOuterWidth);
  const frameHeight = px(sizes.frameOuterHeight);
  const frameThickness = px(sizes.frameWidth);
  const leafWidth = px(sizes.leafWidth);
  const leafHeight = px(sizes.leafHeight);
  const totalHeight = crownHeight + frameHeight;

  // Center door in canvas
  const doorX = (containerWidth - frameWidth) / 2;
  const doorY = (containerHeight - totalHeight) / 2 + crownHeight;

  // Leaf position within frame
  const leafX = doorX + frameThickness + px(3); // 3mm gap
  const leafY = doorY + frameThickness + px(3);

  // Handle position on door
  const handleX = leafX + leafWidth - px(60); // 60mm from edge
  const handleY = leafY + leafHeight / 2 + px(50); // Slightly below center

  // Crown position
  const crownX = doorX;
  const crownY = doorY - crownHeight;

  // Dimension label positions
  const leafDimLabel = formatDimensions(sizes.leafWidth, sizes.leafHeight);
  const frameDimLabel = `${Math.round(sizes.frameOuterWidth / 10)}×${Math.round(sizes.frameOuterHeight / 10)}×2 (${Math.round(sizes.frameArea * 100)}m)`;

  // Track fallback state for indicator
  const [usingFallback, setUsingFallback] = useState(false);
  const handleFallback = useCallback((isFallback: boolean) => {
    if (isFallback) setUsingFallback(false); // TODO: replace true
  }, []);

  return (
    <div className={className}>
      {/* Fallback indicator */}
      {usingFallback && (
        <div className="mb-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-center text-xs text-amber-600">
          ⚠️ Fallback изображения (SVG файлы не найдены)
        </div>
      )}
      <svg
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        width={containerWidth}
        height={containerHeight}
        className="h-auto w-full"
        style={{ maxWidth: containerWidth }}
      >
        {/* Wall background with door opening */}
        {showWall && (
          <Wall
            canvasWidth={containerWidth}
            canvasHeight={containerHeight}
            doorX={doorX - 5}
            doorY={doorY - 5}
            doorWidth={frameWidth + 10}
            doorHeight={frameHeight + 10}
            color={config.wallColor}
            pattern="subtle"
          />
        )}

        {/* Crown - only show if has SVG */}
        {crownVariant?.svgUrl && (
          <SvgPart
            svgUrl={crownVariant.svgUrl}
            x={crownX}
            y={crownY}
            width={frameWidth}
            height={crownHeight}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Door frame - only show if has SVG */}
        {frameVariant?.svgUrl && (
          <SvgPart
            svgUrl={frameVariant.svgUrl}
            x={doorX}
            y={doorY}
            width={frameWidth}
            height={frameHeight}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Door leaf - only show if has SVG */}
        {doorVariant?.svgUrl && (
          <SvgPart
            svgUrl={doorVariant.svgUrl}
            x={leafX}
            y={leafY}
            width={leafWidth}
            height={leafHeight}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Door handle - only show if has SVG */}
        {lockVariant?.svgUrl && (
          <SvgPart
            svgUrl={lockVariant.svgUrl}
            x={handleX}
            y={handleY}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Dimension labels */}
        {showDimensions && (
          <g className="select-none" style={{ pointerEvents: "none" }}>
            {/* Leaf dimensions */}
            <text
              x={containerWidth / 2}
              y={doorY - crownHeight - 15}
              textAnchor="middle"
              fontSize={11}
              fill="#374151"
              fontFamily="system-ui, sans-serif"
            >
              Полотно: {leafDimLabel}
            </text>

            {/* Frame dimensions */}
            <text
              x={containerWidth / 2}
              y={doorY + frameHeight + 20}
              textAnchor="middle"
              fontSize={11}
              fill="#6B7280"
              fontFamily="system-ui, sans-serif"
            >
              Рамка: {frameDimLabel}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default DoorCanvas;
