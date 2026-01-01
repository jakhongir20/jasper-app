/**
 * Size calculation utilities for door components
 * Converts opening dimensions to component sizes
 */

import { DoorConfig, getFrameById, getCrownById } from "../data/data2D";

// Standard dimensions in mm
export const DOOR_STANDARDS = {
  // Frame deductions from opening
  frameDeduction: 10, // mm deducted from each side for frame fitting
  leafGap: 3, // gap between leaf and frame

  // Standard frame widths
  standardFrameWidth: 70, // mm
  minFrameWidth: 50,
  maxFrameWidth: 120,

  // Crown standards
  standardCrownHeight: 100, // mm
  minCrownHeight: 60,
  maxCrownHeight: 200,

  // Lock positioning
  lockHeight: 1000, // mm from floor
  lockOffsetFromEdge: 60, // mm from door edge
};

export interface CalculatedSizes {
  // Frame sizes
  frameWidth: number; // Frame element width
  frameOuterWidth: number; // Total frame outer width
  frameOuterHeight: number; // Total frame outer height

  // Leaf sizes
  leafWidth: number;
  leafHeight: number;

  // Crown sizes
  crownWidth: number;
  crownHeight: number;

  // Total door assembly
  totalWidth: number;
  totalHeight: number;

  // Area calculations (in m²)
  leafArea: number;
  frameArea: number;
}

/**
 * Calculate all door component sizes from opening dimensions
 */
export function calculateDoorSizes(config: DoorConfig): CalculatedSizes {
  const frame = getFrameById(config.frameId);
  const crown = config.crownId ? getCrownById(config.crownId) : null;

  // Frame width (thickness of frame profile)
  const frameWidth = frame?.thickness ?? DOOR_STANDARDS.standardFrameWidth;

  // Frame outer dimensions (equals opening minus fitting gap)
  const frameOuterWidth =
    config.openingWidth - DOOR_STANDARDS.frameDeduction * 2;
  const frameOuterHeight =
    config.openingHeight - DOOR_STANDARDS.frameDeduction * 2;

  // Leaf dimensions (frame inner space minus gaps)
  const leafWidth =
    frameOuterWidth - frameWidth * 2 - DOOR_STANDARDS.leafGap * 2;
  const leafHeight =
    frameOuterHeight - frameWidth - DOOR_STANDARDS.leafGap * 2; // Only top frame, bottom has threshold

  // Crown dimensions
  const crownHeight = crown?.height ?? 0;
  const crownWidth = frameOuterWidth + 20; // Crown extends beyond frame

  // Total assembly dimensions
  const totalWidth = Math.max(frameOuterWidth, crownWidth);
  const totalHeight = frameOuterHeight + crownHeight;

  // Area calculations (convert mm² to m²)
  const leafArea = (leafWidth * leafHeight) / 1_000_000;
  const frameArea =
    (frameOuterWidth * frameOuterHeight - leafWidth * leafHeight) / 1_000_000;

  return {
    frameWidth,
    frameOuterWidth,
    frameOuterHeight,
    leafWidth,
    leafHeight,
    crownWidth,
    crownHeight,
    totalWidth,
    totalHeight,
    leafArea,
    frameArea,
  };
}

/**
 * Format area for display
 */
export function formatArea(areaMm2: number): string {
  return areaMm2.toFixed(2);
}

/**
 * Format dimensions for display (e.g., "6×9 (54m²)")
 */
export function formatDimensions(
  widthMm: number,
  heightMm: number,
  includeArea: boolean = true,
): string {
  // Convert to decimeters for display (900mm = 9dm)
  const widthDm = Math.round(widthMm / 100);
  const heightDm = Math.round(heightMm / 100);

  if (!includeArea) {
    return `${widthDm}×${heightDm}`;
  }

  const areaSqM = (widthMm * heightMm) / 1_000_000;
  return `${widthDm}×${heightDm} (${areaSqM.toFixed(0)}m²)`;
}

/**
 * Format single dimension with unit
 */
export function formatMm(mm: number): string {
  if (mm >= 1000) {
    return `${(mm / 1000).toFixed(1)}м`;
  }
  return `${Math.round(mm)}мм`;
}

/**
 * Calculate frame perimeter for pricing
 */
export function calculateFramePerimeter(config: DoorConfig): number {
  const sizes = calculateDoorSizes(config);
  // Frame has 2 vertical + 2 horizontal sides
  return (sizes.frameOuterWidth + sizes.frameOuterHeight) * 2;
}
