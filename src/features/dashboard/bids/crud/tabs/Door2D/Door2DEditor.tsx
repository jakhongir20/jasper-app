import { FC, useCallback, useState } from "react";
import { cn } from "@/shared/helpers";
import { DoorCanvas } from "./DoorCanvas";
import { ColorPicker, PartSelector } from "./ui";
import { defaultDoorConfig, DoorConfig } from "./data/data2D";

interface Door2DEditorProps {
  /** Initial configuration (for edit mode) */
  initialConfig?: Partial<DoorConfig>;
  /** Callback when configuration changes */
  onChange?: (config: DoorConfig) => void;
  /** Custom class name */
  className?: string;
}

/**
 * Main 2D Door Editor component
 * Combines visualization, part selection, and color picker
 */
export const Door2DEditor: FC<Door2DEditorProps> = ({
  initialConfig,
  onChange,
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

  // Handle wall color change
  const handleWallColorChange = useCallback(
    (color: string) => {
      updateConfig({ wallColor: color });
    },
    [updateConfig],
  );

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Main content: Canvas + Color picker */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-gray-50 to-white py-6">
        {/* Door canvas visualization - larger size */}
        <DoorCanvas
          config={config}
          containerWidth={420}
          containerHeight={500}
          showDimensions={true}
          showWall={true}
        />

        {/* Wall color picker - vertical on the right side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <ColorPicker
            wallColor={config.wallColor}
            onWallColorChange={handleWallColorChange}
            vertical={true}
          />
        </div>
      </div>

      {/* Bottom section: Part selector only */}
      <div className="border-t border-[rgba(5,5,5,0.06)] bg-white px-4 py-4">
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
          centered={true}
        />
      </div>
    </div>
  );
};

export default Door2DEditor;
