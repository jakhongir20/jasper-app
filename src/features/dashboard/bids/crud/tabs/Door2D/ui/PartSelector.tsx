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
  /** Center the content */
  centered?: boolean;
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
  centered = false,
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState<PartCategory>("frames");

  // Get variants for current category (only those with svgUrl)
  const currentVariants = useMemo(() => {
    switch (activeCategory) {
      case "frames":
        return mockData2D.frames.filter(f => f.svgUrl);
      case "crowns":
        return mockData2D.crowns.filter(c => c.svgUrl);
      case "doors":
        return mockData2D.doors.filter(d => d.svgUrl);
      case "locks":
        return mockData2D.locks.filter(l => l.svgUrl);
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
      default:
        return null;
    }
  };

  // Check if category has items
  const hasItems = currentVariants.length > 0;

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
    <div className={cn("flex flex-col", centered && "items-center", className)}>
      {/* Category tabs */}
      <div className={cn("flex gap-1 mb-4 flex-wrap", centered && "justify-center")}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={cn(
              "px-4 py-1.5 text-sm rounded-full transition-colors duration-200",
              activeCategory === tab.key
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Variant thumbnails or empty message */}
      {hasItems ? (
        <div className={cn(
          "flex gap-3 overflow-x-auto pb-2",
          centered ? "justify-center" : "-mx-1 px-1"
        )}>
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
      ) : (
        <div className="text-center text-gray-400 text-sm py-4">
          Нет изображений
        </div>
      )}
    </div>
  );
};

export default PartSelector;
