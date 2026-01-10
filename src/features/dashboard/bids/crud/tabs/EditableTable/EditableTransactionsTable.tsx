import { type FC, useState, useCallback } from "react";
import { Form } from "antd";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";
import { getRandomId } from "@/shared/utils";
import { useTableColumns } from "./useColumns";
import { TableToolbar } from "./TableToolbar";
import { TableHeader } from "./TableHeader";
import { EditableRow } from "./EditableRow";
import { useSaveRow } from "./hooks/useSaveRow";
import { useBulkValidation } from "./hooks/useBulkValidation";
import { TransactionDrawer } from "../TransactionDrawer";

interface EditableTransactionsTableProps {
  mode: "add" | "edit";
}

export const EditableTransactionsTable: FC<EditableTransactionsTableProps> = ({
  mode,
}) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();
  const columns = useTableColumns();

  // State
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [savingRows, setSavingRows] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // Watch transactions for rendering
  const transactions = Form.useWatch("transactions", form) ?? [];

  // API hooks
  const saveRowMutation = useSaveRow();
  const bulkValidationMutation = useBulkValidation();

  // Row selection handlers
  const toggleRowSelection = useCallback((index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  const selectAllRows = useCallback(() => {
    if (selectedRows.length === transactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map((_: unknown, i: number) => i));
    }
  }, [selectedRows.length, transactions.length]);

  // Add new row
  const handleAddRow = useCallback(() => {
    const currentTransactions = form.getFieldValue("transactions") ?? [];
    const newTransaction = {
      _uid: getRandomId("transaction_"),
      entity_quantity: 1,
      opening_thickness: 1,
    };
    form.setFieldValue("transactions", [
      ...currentTransactions,
      newTransaction,
    ]);
  }, [form]);

  // Save single row
  const handleSaveRow = useCallback(
    async (rowIndex: number) => {
      setSavingRows((prev) => new Set(prev).add(rowIndex));
      try {
        await saveRowMutation.mutateAsync(rowIndex);
      } finally {
        setSavingRows((prev) => {
          const next = new Set(prev);
          next.delete(rowIndex);
          return next;
        });
      }
    },
    [saveRowMutation],
  );

  // Delete row
  const handleDeleteRow = useCallback(
    (rowIndex: number) => {
      const currentTransactions = form.getFieldValue("transactions") ?? [];
      const updated = currentTransactions.filter(
        (_: unknown, i: number) => i !== rowIndex,
      );
      form.setFieldValue("transactions", updated);

      // Update selected rows
      setSelectedRows((prev) =>
        prev
          .filter((i) => i !== rowIndex)
          .map((i) => (i > rowIndex ? i - 1 : i)),
      );
    },
    [form],
  );

  // Bulk save
  const handleBulkSave = useCallback(() => {
    if (selectedRows.length > 0) {
      bulkValidationMutation.mutate(selectedRows);
    }
  }, [selectedRows, bulkValidationMutation]);

  // Open drawer for row editing (double-click)
  const handleOpenDrawer = useCallback((rowIndex: number) => {
    setEditingRowIndex(rowIndex);
    setDrawerOpen(true);
  }, []);

  // Close drawer
  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingRowIndex(null);
  }, []);

  // Check selection state
  const allSelected =
    transactions.length > 0 && selectedRows.length === transactions.length;
  const someSelected = selectedRows.length > 0;

  return (
    <div className="editable-table-container">
      <TableToolbar
        selectedCount={selectedRows.length}
        onAdd={handleAddRow}
        onBulkSave={handleBulkSave}
        isBulkSaving={bulkValidationMutation.isPending}
      />

      <div
        className="overflow-x-auto rounded-lg"
        style={{ border: "1px solid #f0f0f0" }}
      >
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <TableHeader
              columns={columns}
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={selectAllRows}
            />
          </thead>
          <tbody>
            <Form.List name="transactions">
              {(fields) =>
                fields.map((field, index) => {
                  const transaction = transactions[index] as Record<string, unknown> | undefined;
                  const rowProductType = (transaction?.product_type as string) ?? "";
                  return (
                    <EditableRow
                      key={field.key}
                      rowIndex={index}
                      fieldKey={field.key}
                      selected={selectedRows.includes(index)}
                      onSelect={() => toggleRowSelection(index)}
                      onRemove={() => handleDeleteRow(index)}
                      onDoubleClick={() => handleOpenDrawer(index)}
                      columns={columns}
                      onSave={handleSaveRow}
                      isSaving={savingRows.has(index)}
                      productType={rowProductType}
                    />
                  );
                })
              }
            </Form.List>
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="py-8 text-center text-gray-400">
            Нет записей. Нажмите «Добавить» для создания новой записи.
          </div>
        )}
      </div>

      {/* Drawer fallback for full editing (double-click) */}
      {drawerOpen && editingRowIndex !== null && (
        <TransactionDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          mode={mode}
          transactionIndex={editingRowIndex}
        />
      )}
    </div>
  );
};
