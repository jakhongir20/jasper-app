import { FC, useCallback, useMemo, useState } from "react";
import { SvgPart, Wall } from "./parts";
import { calculateDoorSizes, formatDimensions } from "./utils/calcSizes";
import {
  DoorConfig,
  getCrownById,
  getDoorById,
  getFrameById,
  getLockById,
} from "./data/data2D";

/**
 * SVG coordinate bounds from Figma exports
 * All parts use same 2000x2000 viewBox but content is in specific regions
 */
const SVG_BOUNDS = {
  // Common viewBox for all parts
  viewBox: "0 0 2000 2000",
  width: 2000,
  height: 2000,
  // Content area bounds (measured from actual SVG content)
  contentX: 570, // leftmost content (crown extends slightly left)
  contentY: 180, // topmost content (above crown for label)
  contentWidth: 820, // ~1390-570
  contentHeight: 1720, // ~1900-180 (includes space for bottom label)
};

interface DoorCanvasProps {
  /** Door configuration */
  config: DoorConfig;
  /** Container width in pixels */
  containerWidth?: number;
  /** Container height in pixels */
  containerHeight?: number;
  /** Whether to show dimension labels */
  showDimensions?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Main Door 2D Canvas component
 * Composes all door parts into a complete door visualization
 * All SVG parts share the same coordinate system from Figma
 */
export const DoorCanvas: FC<DoorCanvasProps> = ({
  config,
  containerWidth = 350,
  containerHeight = 450,
  showDimensions = true,
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

  // Calculate all sizes for dimension labels
  const sizes = useMemo(() => calculateDoorSizes(config), [config]);

  // Dimension labels
  const leafDimLabel = formatDimensions(sizes.leafWidth, sizes.leafHeight);
  const frameDimLabel = `${Math.round(sizes.frameOuterWidth / 10)}×${Math.round(sizes.frameOuterHeight / 10)}×2 (${Math.round(sizes.frameArea * 100)}m)`;

  // Track fallback state for indicator
  const [usingFallback, setUsingFallback] = useState(false);
  const handleFallback = useCallback((isFallback: boolean) => {
    if (isFallback) setUsingFallback(false);
  }, []);

  // Calculate padding for wall and labels
  const padding = 20;

  // Use viewBox that matches the SVG content area
  // This ensures all parts render at their natural positions and align correctly
  const viewBoxX = SVG_BOUNDS.contentX - padding;
  const viewBoxY = crownVariant ? SVG_BOUNDS.contentY : 300; // Start lower if no crown
  const viewBoxWidth = SVG_BOUNDS.contentWidth + padding * 2;
  const viewBoxHeight = crownVariant
    ? SVG_BOUNDS.contentHeight
    : SVG_BOUNDS.contentHeight - 120;

  // Wall cutout position (matches frame position in SVG coords)
  const wallDoorX = 620;
  const wallDoorY = 318;
  const wallDoorWidth = 710;
  const wallDoorHeight = 1530;

  return (
    <div className={className}>
      {/* Fallback indicator */}
      {usingFallback && (
        <div className="mb-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-center text-xs text-amber-600">
          Fallback изображения (SVG файлы не найдены)
        </div>
      )}
      <svg
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        width={containerWidth}
        height={containerHeight}
        className="h-auto w-full"
        style={{ maxWidth: containerWidth }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Wall background with door cutout */}
        <Wall
          canvasWidth={SVG_BOUNDS.width}
          canvasHeight={SVG_BOUNDS.height}
          doorX={wallDoorX}
          doorY={wallDoorY}
          doorWidth={wallDoorWidth}
          doorHeight={wallDoorHeight}
          color={config.wallColor}
          pattern="subtle"
        />

        {/* Crown - renders at its natural position in the shared coordinate space */}
        {crownVariant?.svgUrl && (
          <SvgPart
            svgUrl={crownVariant.svgUrl}
            useNativeViewBox={true}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Door frame - renders at its natural position */}
        {frameVariant?.svgUrl && (
          <SvgPart
            svgUrl={frameVariant.svgUrl}
            useNativeViewBox={true}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Door leaf - renders at its natural position */}
        {doorVariant?.svgUrl && (
          <SvgPart
            svgUrl={doorVariant.svgUrl}
            useNativeViewBox={true}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Door handle - renders at its natural position */}
        {lockVariant?.svgUrl && (
          <SvgPart
            svgUrl={lockVariant.svgUrl}
            useNativeViewBox={true}
            visible={true}
            onFallback={handleFallback}
          />
        )}

        {/* Dimension labels */}
        {showDimensions && (
          <g className="select-none" style={{ pointerEvents: "none" }}>
            {/* Leaf dimensions - positioned above the door */}
            <text
              x={975}
              y={crownVariant ? 200 : 300}
              textAnchor="middle"
              fontSize={28}
              fill="#374151"
              fontFamily="system-ui, sans-serif"
            >
              Полотно: {leafDimLabel}
            </text>

            {/* Frame dimensions - positioned below the door */}
            <text
              x={975}
              y={1870}
              textAnchor="middle"
              fontSize={28}
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
