import { FC } from "react";
import { cn } from "@/shared/helpers";

// Wall color presets
const WALL_COLORS = [
  { id: "white", color: "#FFFFFF", name: "Белый" },
  { id: "light-gray", color: "#E5E7EB", name: "Светло-серый" },
  { id: "gray", color: "#9CA3AF", name: "Серый" },
  { id: "beige", color: "#D4A574", name: "Бежевый" },
  { id: "cream", color: "#FEF3C7", name: "Кремовый" },
];

interface ColorPickerProps {
  /** Current wall color */
  wallColor: string;
  /** Wall color change handler */
  onWallColorChange: (color: string) => void;
  /** Display colors vertically */
  vertical?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Color picker component for wall color selection
 */
export const ColorPicker: FC<ColorPickerProps> = ({
  wallColor,
  onWallColorChange,
  vertical = false,
  className,
}) => {
  return (
    <div className={cn("flex gap-2", vertical ? "flex-col" : "flex-row", className)}>
      {/* Wall color buttons */}
      {WALL_COLORS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onWallColorChange(preset.color)}
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all duration-200",
            "hover:scale-110 hover:shadow-md",
            wallColor === preset.color
              ? "border-primary ring-2 ring-primary/30"
              : "border-gray-300 hover:border-gray-400",
          )}
          style={{ backgroundColor: preset.color }}
          title={preset.name}
        />
      ))}

      {/* Reset button */}
      <button
        type="button"
        onClick={() => onWallColorChange("#F3F4F6")}
        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
        title="Сбросить цвет"
      >
        <svg
          viewBox="0 0 20 20"
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default ColorPicker;
