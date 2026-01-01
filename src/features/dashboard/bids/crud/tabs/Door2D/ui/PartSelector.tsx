import { FC, useState, useMemo } from "react";
import { cn } from "@/shared/helpers";
import { PartThumbnail } from "./PartThumbnail";
import {
  mockData2D,
  PartCategory,
  FrameVariant,
  CrownVariant,
  DoorLeafVariant,
  LockVariant,
  FullHeightOption,
} from "../data/data2D";

// Category tab configuration
const CATEGORY_TABS: { key: PartCategory; label: string }[] = [
  { key: "frames", label: "Рамки" },
  { key: "crowns", label: "Короны" },
  { key: "doors", label: "Двери" },
  { key: "locks", label: "Замок" },
  { key: "fullHeight", label: "На весь" },
];

interface PartSelectorProps {
  /** Currently selected frame ID */
  selectedFrameId: number | null;
  /** Currently selected crown ID */
  selectedCrownId: number | null;
  /** Currently selected door ID */
  selectedDoorId: number | null;
  /** Currently selected lock ID */
  selectedLockId: number | null;
  /** Full height mode */
  fullHeight: boolean;
  /** Frame selection handler */
  onFrameSelect: (id: number) => void;
  /** Crown selection handler */
  onCrownSelect: (id: number | null) => void;
  /** Door selection handler */
  onDoorSelect: (id: number) => void;
  /** Lock selection handler */
  onLockSelect: (id: number | null) => void;
  /** Full height toggle handler */
  onFullHeightToggle: (enabled: boolean) => void;
  /** Display color for thumbnails */
  displayColor?: string;
  /** Custom class name */
  className?: string;
}

/**
 * Part selector component with category tabs and variant thumbnails
 */
export const PartSelector: FC<PartSelectorProps> = ({
  selectedFrameId,
  selectedCrownId,
  selectedDoorId,
  selectedLockId,
  fullHeight,
  onFrameSelect,
  onCrownSelect,
  onDoorSelect,
  onLockSelect,
  onFullHeightToggle,
  displayColor = "#D4A574",
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState<PartCategory>("frames");

  // Get variants for current category
  const currentVariants = useMemo(() => {
    switch (activeCategory) {
      case "frames":
        return mockData2D.frames;
      case "crowns":
        // Use 'classic' as placeholder type for "no crown" option
        return [
          { id: 0, name: "Без короны", type: "classic" as const, height: 0 },
          ...mockData2D.crowns,
        ];
      case "doors":
        return mockData2D.doors;
      case "locks":
        // Use 'lever' as placeholder type for "no lock" option
        return [
          { id: 0, name: "Без замка", type: "lever" as const, position: "right" as const },
          ...mockData2D.locks,
        ];
      case "fullHeight":
        return mockData2D.fullHeightOptions;
      default:
        return [];
    }
  }, [activeCategory]);

  // Get selected ID for current category
  const getSelectedId = (): number | null => {
    switch (activeCategory) {
      case "frames":
        return selectedFrameId;
      case "crowns":
        return selectedCrownId;
      case "doors":
        return selectedDoorId;
      case "locks":
        return selectedLockId;
      case "fullHeight":
        return fullHeight ? 2 : 1;
      default:
        return null;
    }
  };

  // Handle variant selection
  const handleSelect = (id: number) => {
    switch (activeCategory) {
      case "frames":
        onFrameSelect(id);
        break;
      case "crowns":
        onCrownSelect(id === 0 ? null : id);
        break;
      case "doors":
        onDoorSelect(id);
        break;
      case "locks":
        onLockSelect(id === 0 ? null : id);
        break;
      case "fullHeight":
        onFullHeightToggle(id === 2);
        break;
    }
  };

  // Get thumbnail type for current category
  const getThumbnailType = (): "frame" | "crown" | "door" | "lock" | "fullHeight" => {
    switch (activeCategory) {
      case "frames":
        return "frame";
      case "crowns":
        return "crown";
      case "doors":
        return "door";
      case "locks":
        return "lock";
      case "fullHeight":
        return "fullHeight";
      default:
        return "frame";
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Category tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full transition-colors duration-200",
              activeCategory === tab.key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Variant thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {currentVariants.map((variant) => (
          <PartThumbnail
            key={variant.id}
            type={getThumbnailType()}
            variant={variant as FrameVariant | CrownVariant | DoorLeafVariant | LockVariant | FullHeightOption}
            selected={getSelectedId() === variant.id}
            onClick={() => handleSelect(variant.id)}
            color={displayColor}
          />
        ))}
      </div>
    </div>
  );
};

export default PartSelector;
