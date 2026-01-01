/**
 * SVG scaling utilities for 2D door visualization
 * Converts real-world measurements (mm) to SVG pixels
 */

// Default scale: 0.1 means 1mm = 0.1px (or 10mm = 1px)
// This gives a reasonable visual size for typical door dimensions
export const DEFAULT_SCALE = 0.15;

/**
 * Convert millimeters to pixels
 */
export function mmToPx(mm: number, scale: number = DEFAULT_SCALE): number {
  return mm * scale;
}

/**
 * Convert pixels to millimeters
 */
export function pxToMm(px: number, scale: number = DEFAULT_SCALE): number {
  return px / scale;
}

/**
 * Calculate scale to fit door within container
 * @param doorWidthMm - Door width in millimeters
 * @param doorHeightMm - Door height in millimeters
 * @param containerWidth - Container width in pixels
 * @param containerHeight - Container height in pixels
 * @param padding - Padding in pixels (default 40)
 */
export function calculateFitScale(
  doorWidthMm: number,
  doorHeightMm: number,
  containerWidth: number,
  containerHeight: number,
  padding: number = 40,
): number {
  const availableWidth = containerWidth - padding * 2;
  const availableHeight = containerHeight - padding * 2;

  const scaleX = availableWidth / doorWidthMm;
  const scaleY = availableHeight / doorHeightMm;

  // Use the smaller scale to ensure door fits within container
  return Math.min(scaleX, scaleY);
}

/**
 * Calculate viewBox dimensions for SVG
 */
export function calculateViewBox(
  widthMm: number,
  heightMm: number,
  scale: number = DEFAULT_SCALE,
  padding: number = 20,
): {
  viewBox: string;
  width: number;
  height: number;
} {
  const width = mmToPx(widthMm, scale) + padding * 2;
  const height = mmToPx(heightMm, scale) + padding * 2;

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
  };
}

/**
 * Center offset for positioning door within viewBox
 */
export function calculateCenterOffset(
  containerWidth: number,
  containerHeight: number,
  objectWidth: number,
  objectHeight: number,
): { x: number; y: number } {
  return {
    x: (containerWidth - objectWidth) / 2,
    y: (containerHeight - objectHeight) / 2,
  };
}