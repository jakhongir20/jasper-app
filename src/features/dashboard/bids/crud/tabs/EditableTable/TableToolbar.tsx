import { memo } from "react";
import { Button, Spin } from "antd";
import { Icon } from "@/shared/ui";

interface TableToolbarProps {
  selectedCount: number;
  onAdd: () => void;
  onBulkSave: () => void;
  isBulkSaving: boolean;
}

export const TableToolbar = memo<TableToolbarProps>(
  ({ selectedCount, onAdd, onBulkSave, isBulkSaving }) => {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <>
              <span className="text-sm text-gray-500">
                Выбрано: {selectedCount}
              </span>
              <Button
                type="primary"
                onClick={onBulkSave}
                disabled={isBulkSaving}
                icon={
                  isBulkSaving ? (
                    <Spin size="small" />
                  ) : (
                    <Icon icon="check" width={14} color="" />
                  )
                }
              >
                Массовое действие
              </Button>
            </>
          )}
        </div>

        <Button
          type="primary"
          onClick={onAdd}
          icon={<Icon icon="plus" width={14} color="" />}
        >
          Добавить
        </Button>
      </div>
    );
  },
);

TableToolbar.displayName = "TableToolbar";
