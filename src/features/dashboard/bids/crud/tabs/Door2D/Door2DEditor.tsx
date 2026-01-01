import { FC, useState, useCallback } from "react";
import { cn } from "@/shared/helpers";
import { DoorCanvas } from "./DoorCanvas";
import { PartSelector, ColorPicker, DimensionInputs } from "./ui";
import { defaultDoorConfig, DoorConfig } from "./data/data2D";
import { Button } from "@/shared/ui";

interface Door2DEditorProps {
  /** Initial configuration (for edit mode) */
  initialConfig?: Partial<DoorConfig>;
  /** Callback when configuration changes */
  onChange?: (config: DoorConfig) => void;
  /** Callback when user confirms/adds the configuration */
  onAdd?: (config: DoorConfig) => void;
  /** Custom class name */
  className?: string;
}

/**
 * Main 2D Door Editor component
 * Combines visualization, part selection, color picker, and dimension inputs
 */
export const Door2DEditor: FC<Door2DEditorProps> = ({
  initialConfig,
  onChange,
  onAdd,
  className,
}) => {
  // Door configuration state
  const [config, setConfig] = useState<DoorConfig>({
    ...defaultDoorConfig,
    ...initialConfig,
  });

  // Update config and notify parent
  const updateConfig = useCallback(
    (updates: Partial<DoorConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates };
        onChange?.(newConfig);
        return newConfig;
      });
    },
    [onChange],
  );

  // Handle dimension changes
  const handleWidthChange = useCallback(
    (width: number) => updateConfig({ openingWidth: width }),
    [updateConfig],
  );

  const handleHeightChange = useCallback(
    (height: number) => updateConfig({ openingHeight: height }),
    [updateConfig],
  );

  const handleThicknessChange = useCallback(
    (thickness: number) => updateConfig({ openingThickness: thickness }),
    [updateConfig],
  );

  // Handle part selection
  const handleFrameSelect = useCallback(
    (id: number) => updateConfig({ frameId: id }),
    [updateConfig],
  );

  const handleCrownSelect = useCallback(
    (id: number | null) => updateConfig({ crownId: id }),
    [updateConfig],
  );

  const handleDoorSelect = useCallback(
    (id: number) => updateConfig({ doorId: id }),
    [updateConfig],
  );

  const handleLockSelect = useCallback(
    (id: number | null) => updateConfig({ lockId: id }),
    [updateConfig],
  );

  const handleFullHeightToggle = useCallback(
    (enabled: boolean) => updateConfig({ fullHeight: enabled }),
    [updateConfig],
  );

  // Handle color changes
  const handleColorChange = useCallback(
    (colors: {
      frameColor?: string;
      leafColor?: string;
      crownColor?: string;
    }) => {
      updateConfig(colors);
    },
    [updateConfig],
  );

  // Handle add button
  const handleAdd = useCallback(() => {
    onAdd?.(config);
  }, [config, onAdd]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Top section: Dimension inputs */}
      <div className="px-4 py-3 border-b border-gray-200">
        <DimensionInputs
          openingWidth={config.openingWidth}
          openingHeight={config.openingHeight}
          openingThickness={config.openingThickness}
          onWidthChange={handleWidthChange}
          onHeightChange={handleHeightChange}
          onThicknessChange={handleThicknessChange}
        />
      </div>

      {/* Main content: Canvas + Color picker */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-gray-50 to-white py-4">
        {/* Door canvas visualization */}
        <DoorCanvas
          config={config}
          containerWidth={350}
          containerHeight={380}
          showDimensions={true}
          showWall={true}
        />

        {/* Color picker (positioned on the right side) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <ColorPicker
            frameColor={config.frameColor}
            leafColor={config.leafColor}
            crownColor={config.crownColor}
            onColorChange={handleColorChange}
            className="flex-col"
          />
        </div>
      </div>

      {/* Bottom section: Part selector and add button */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white">
        {/* Part selector tabs and thumbnails */}
        <PartSelector
          selectedFrameId={config.frameId}
          selectedCrownId={config.crownId}
          selectedDoorId={config.doorId}
          selectedLockId={config.lockId}
          fullHeight={config.fullHeight}
          onFrameSelect={handleFrameSelect}
          onCrownSelect={handleCrownSelect}
          onDoorSelect={handleDoorSelect}
          onLockSelect={handleLockSelect}
          onFullHeightToggle={handleFullHeightToggle}
          displayColor={config.frameColor}
        />

        {/* Add button */}
        <Button
          type="primary"
          size="large"
          className="w-full mt-4"
          onClick={handleAdd}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Добавить
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Door2DEditor;
