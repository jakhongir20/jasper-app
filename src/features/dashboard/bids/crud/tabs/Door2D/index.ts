// Main components
export { DoorCanvas } from "./DoorCanvas";
export { Door2DEditor } from "./Door2DEditor";

// UI components
export { PartSelector, PartThumbnail, ColorPicker, DimensionInputs } from "./ui";

// SVG Parts
export { Frame, DoorLeaf, Crown, Handle, Wall } from "./parts";

// Data and types
export {
  mockData2D,
  defaultDoorConfig,
  getFrameById,
  getCrownById,
  getDoorById,
  getLockById,
} from "./data/data2D";
export type {
  DoorConfig,
  Door2DData,
  FrameVariant,
  CrownVariant,
  DoorLeafVariant,
  LockVariant,
  ColorPreset,
  PartCategory,
} from "./data/data2D";

// Utilities
export { mmToPx, pxToMm, calculateFitScale, calculateViewBox } from "./utils/scale";
export {
  calculateDoorSizes,
  formatDimensions,
  formatArea,
  formatMm,
  DOOR_STANDARDS,
} from "./utils/calcSizes";
export type { CalculatedSizes } from "./utils/calcSizes";
