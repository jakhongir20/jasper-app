import { memo, useState } from "react";
import { Button, Select } from "antd";
import { Icon } from "@/shared/ui";
import { PRODUCT_TYPES } from "../TransactionForm";

interface TableToolbarProps {
  selectedCount: number;
  onAdd: () => void;
  onBulkEdit: () => void;
  onSelectByProductType: (productType: string) => void;
  hasTransactions: boolean;
}

export const TableToolbar = memo<TableToolbarProps>(
  ({
    selectedCount,
    onAdd,
    onBulkEdit,
    onSelectByProductType,
    hasTransactions,
  }) => {
    const [filterValue, setFilterValue] = useState<string | undefined>(undefined);

    const handleProductTypeChange = (value: string) => {
      setFilterValue(value);
      onSelectByProductType(value);
    };

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

          {hasTransactions && (
            <Select
              value={filterValue}
              onChange={handleProductTypeChange}
              options={PRODUCT_TYPES}
              style={{ width: 180 }}
              placeholder="Выбрать по типу"
              allowClear
              onClear={() => setFilterValue(undefined)}
            />
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
