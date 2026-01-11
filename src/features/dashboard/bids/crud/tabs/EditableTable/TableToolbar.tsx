import { memo } from "react";
import { Button } from "antd";
import { Icon } from "@/shared/ui";

interface TableToolbarProps {
  selectedCount: number;
  onAdd: () => void;
  onBulkEdit: () => void;
}

export const TableToolbar = memo<TableToolbarProps>(
  ({ selectedCount, onAdd, onBulkEdit }) => {
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
                onClick={onBulkEdit}
                icon={<Icon icon="pen-square" width={14} color="" />}
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
