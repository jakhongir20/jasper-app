import { memo, useState } from "react";
import { Popconfirm, Spin } from "antd";
import { Button } from "@/shared/ui";

interface ActionCellProps {
  rowIndex: number;
  onSave: (rowIndex: number) => Promise<void>;
  onDelete: (rowIndex: number) => void;
  isSaving?: boolean;
}

export const ActionCell = memo<ActionCellProps>(
  ({ rowIndex, onSave, onDelete, isSaving }) => {
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      setSaving(true);
      try {
        await onSave(rowIndex);
      } finally {
        setSaving(false);
      }
    };

    const isLoading = saving || isSaving;

    return (
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <Spin size="small" />
        ) : (
          <>
            <Button type="primary" size="small" onClick={handleSave}>
              Сохранить
            </Button>
            <Popconfirm
              title="Удалить запись?"
              description="Это действие нельзя отменить"
              onConfirm={() => onDelete(rowIndex)}
              okText="Да"
              cancelText="Нет"
              placement="left"
            >
              <Button type="default" size="small">
                Удалить
              </Button>
            </Popconfirm>
          </>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.rowIndex === next.rowIndex && prev.isSaving === next.isSaving,
);

ActionCell.displayName = "ActionCell";
