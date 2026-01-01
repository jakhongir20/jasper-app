import { FC } from "react";
import { cn } from "@/shared/helpers";
import { mockData2D, ColorPreset } from "../data/data2D";

interface ColorPickerProps {
  /** Current frame color */
  frameColor: string;
  /** Current leaf color */
  leafColor: string;
  /** Current crown color */
  crownColor?: string;
  /** Color change handler */
  onColorChange: (colors: {
    frameColor?: string;
    leafColor?: string;
    crownColor?: string;
  }) => void;
  /** Custom class name */
  className?: string;
}

/**
 * Color picker component for door visualization
 * Shows preset color combinations and allows individual color selection
 */
export const ColorPicker: FC<ColorPickerProps> = ({
  frameColor,
  leafColor,
  crownColor,
  onColorChange,
  className,
}) => {
  // Apply a preset
  const applyPreset = (preset: ColorPreset) => {
    onColorChange({
      frameColor: preset.frameColor,
      leafColor: preset.leafColor,
      crownColor: preset.crownColor || preset.frameColor,
    });
  };

  // Check if a preset is currently active
  const isPresetActive = (preset: ColorPreset): boolean => {
    return (
      preset.frameColor === frameColor &&
      preset.leafColor === leafColor
    );
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Preset color buttons */}
      <div className="flex items-center gap-1">
        {mockData2D.colorPresets.map((preset) => (
          <ColorPresetButton
            key={preset.id}
            preset={preset}
            active={isPresetActive(preset)}
            onClick={() => applyPreset(preset)}
          />
        ))}

        {/* Remove/reset button */}
        <button
          type="button"
          onClick={() =>
            onColorChange({
              frameColor: "#D4A574",
              leafColor: "#1F2937",
              crownColor: "#D4A574",
            })
          }
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
    </div>
  );
};

/**
 * Individual color preset button
 */
interface ColorPresetButtonProps {
  preset: ColorPreset;
  active: boolean;
  onClick: () => void;
}

const ColorPresetButton: FC<ColorPresetButtonProps> = ({
  preset,
  active,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-full border-2 transition-all duration-200",
        "hover:scale-110 hover:shadow-md",
        active
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-300 hover:border-gray-400",
      )}
      style={{
        background: `linear-gradient(135deg, ${preset.frameColor} 50%, ${preset.leafColor} 50%)`,
      }}
      title={preset.name}
    />
  );
};

export default ColorPicker;
