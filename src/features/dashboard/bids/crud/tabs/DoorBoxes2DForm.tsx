import { FC, useCallback, useState } from "react";
import { cn } from "@/shared/helpers";
import { message } from "antd";
import { Door2DEditor, DoorConfig } from "./Door2D";

interface Props {
  className?: string;
  mode: "add" | "edit";
  drawerOpen?: boolean;
}

/**
 * Door Boxes 2D Form component
 * Integrates the 2D door editor into the transaction drawer
 */
export const DoorBoxes2DForm: FC<Props> = ({ className, mode, drawerOpen }) => {
  // Track current configuration (will be synced with form later)
  const [currentConfig, setCurrentConfig] = useState<DoorConfig | null>(null);

  // Handle configuration changes
  const handleConfigChange = useCallback((config: DoorConfig) => {
    setCurrentConfig(config);
    // TODO: Sync with parent form when API integration is added
    // parentForm.setFieldsValue({ door2D: config });
  }, []);

  // Handle add/confirm action
  const handleAdd = useCallback(
    (config: DoorConfig) => {
      // For now, just log and show success message
      // Later this will add to a list or sync with parent form
      console.log("Door 2D config added:", config);

      message.success(
        mode === "edit"
          ? "Конфигурация обновлена"
          : "Конфигурация добавлена",
      );

      // TODO: API integration
      // - Save to server
      // - Add to transaction list
      // - Update parent form state
    },
    [mode],
  );

  return (
    <div className={cn("h-[calc(100vh-200px)] min-h-[500px]", className)}>
      <Door2DEditor
        onChange={handleConfigChange}
        onAdd={handleAdd}
        className="h-full"
      />
    </div>
  );
};
