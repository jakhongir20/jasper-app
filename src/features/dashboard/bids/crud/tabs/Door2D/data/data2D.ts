/**
 * Mock data for 2D Door visualization
 * This data structure is designed to be easily replaceable by API responses
 */

// Types for door parts
export interface DoorPartVariant {
  id: number;
  name: string;
  thumbnail?: string; // URL or base64 for thumbnail preview
}

export interface FrameVariant extends DoorPartVariant {
  type: "standard" | "decorative" | "minimal";
  thickness: number; // mm
}

export interface CrownVariant extends DoorPartVariant {
  type: "classic" | "modern" | "ornate";
  height: number; // mm
}

export interface DoorLeafVariant extends DoorPartVariant {
  type: "solid" | "glass" | "panel";
  panelCount?: number;
  hasGlass?: boolean;
}

export interface LockVariant extends DoorPartVariant {
  type: "lever" | "knob" | "handle";
  position: "left" | "right";
}

export interface FullHeightOption extends DoorPartVariant {
  enabled: boolean;
}

// Categories for selection tabs
export type PartCategory =
  | "frames"
  | "crowns"
  | "doors"
  | "locks"
  | "fullHeight";

// Color preset
export interface ColorPreset {
  id: string;
  name: string;
  frameColor: string;
  leafColor: string;
  crownColor?: string;
}

// Main data structure
export interface Door2DData {
  frames: FrameVariant[];
  crowns: CrownVariant[];
  doors: DoorLeafVariant[];
  locks: LockVariant[];
  fullHeightOptions: FullHeightOption[];
  colorPresets: ColorPreset[];
}

// Mock data
export const mockData2D: Door2DData = {
  frames: [
    { id: 1, name: "Стандартная", type: "standard", thickness: 70 },
    { id: 2, name: "Узкая", type: "minimal", thickness: 50 },
    { id: 3, name: "Декоративная", type: "decorative", thickness: 90 },
    { id: 4, name: "Двойная", type: "standard", thickness: 100 },
    { id: 5, name: "Премиум", type: "decorative", thickness: 80 },
  ],
  crowns: [
    { id: 1, name: "Классика", type: "classic", height: 120 },
    { id: 2, name: "Модерн", type: "modern", height: 80 },
    { id: 3, name: "Орнамент", type: "ornate", height: 150 },
    { id: 4, name: "Минимал", type: "modern", height: 60 },
  ],
  doors: [
    { id: 1, name: "Глухая", type: "solid", panelCount: 4, hasGlass: false },
    { id: 2, name: "Со стеклом", type: "glass", panelCount: 4, hasGlass: true },
    { id: 3, name: "Филёнка", type: "panel", panelCount: 6, hasGlass: false },
    {
      id: 4,
      name: "Модерн",
      type: "solid",
      panelCount: 2,
      hasGlass: false,
    },
    {
      id: 5,
      name: "Классическая",
      type: "panel",
      panelCount: 4,
      hasGlass: true,
    },
  ],
  locks: [
    { id: 1, name: "Ручка-защёлка", type: "lever", position: "right" },
    { id: 2, name: "Круглая ручка", type: "knob", position: "right" },
    { id: 3, name: "Нажимная", type: "handle", position: "right" },
  ],
  fullHeightOptions: [
    { id: 1, name: "Стандартная высота", enabled: false },
    { id: 2, name: "На всю высоту", enabled: true },
  ],
  colorPresets: [
    {
      id: "white",
      name: "Белый",
      frameColor: "#FFFFFF",
      leafColor: "#F5F5F5",
      crownColor: "#FFFFFF",
    },
    {
      id: "gray",
      name: "Серый",
      frameColor: "#9CA3AF",
      leafColor: "#6B7280",
      crownColor: "#9CA3AF",
    },
    {
      id: "dark",
      name: "Тёмный",
      frameColor: "#374151",
      leafColor: "#1F2937",
      crownColor: "#374151",
    },
    {
      id: "brown",
      name: "Коричневый",
      frameColor: "#92400E",
      leafColor: "#78350F",
      crownColor: "#92400E",
    },
    {
      id: "natural",
      name: "Натуральный",
      frameColor: "#D4A574",
      leafColor: "#C4956A",
      crownColor: "#D4A574",
    },
  ],
};

// Default configuration for new door
export const defaultDoorConfig = {
  // Dimensions in mm
  openingWidth: 900,
  openingHeight: 2100,
  openingThickness: 100,

  // Selected variants (IDs)
  frameId: 1,
  crownId: null as number | null,
  doorId: 1,
  lockId: 1 as number | null,
  fullHeight: false,

  // Colors
  frameColor: "#D4A574",
  leafColor: "#1F2937",
  crownColor: "#D4A574",
  handleColor: "#D4AF37",

  // Calculated dimensions (will be computed)
  leafWidth: 0,
  leafHeight: 0,
  frameWidth: 0,
  frameHeight: 0,
};

export type DoorConfig = typeof defaultDoorConfig;

// Helper to get variant by id
export function getFrameById(id: number): FrameVariant | undefined {
  return mockData2D.frames.find((f) => f.id === id);
}

export function getCrownById(id: number): CrownVariant | undefined {
  return mockData2D.crowns.find((c) => c.id === id);
}

export function getDoorById(id: number): DoorLeafVariant | undefined {
  return mockData2D.doors.find((d) => d.id === id);
}

export function getLockById(id: number): LockVariant | undefined {
  return mockData2D.locks.find((l) => l.id === id);
}
