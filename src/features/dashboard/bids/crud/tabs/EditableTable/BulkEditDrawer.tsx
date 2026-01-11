import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Drawer, Form, message } from "antd";
import { Button } from "@/shared/ui";
import { TransactionForm } from "@/features/dashboard/bids/crud/tabs/TransactionForm";
import {
  ApplicationLocalForm,
  GeneralFormType,
} from "@/features/dashboard/bids/model";
import { apiService } from "@/shared/lib/services/ApiService";
import { buildTransactionPayload } from "@/features/dashboard/bids/utils/transactionTransform";
import type { ApplicationTransactionBatchAuditEntity } from "@/shared/lib/api/generated/gateway/model";

interface Props {
  open: boolean;
  onClose: (success: boolean) => void;
  selectedRowIndices: number[];
}

/**
 * Drawer for bulk editing multiple transaction rows.
 * - Shows TransactionForm with empty values
 * - Tracks which fields have been modified
 * - Applies modified fields to all selected rows on save
 * - Calls batch API for validation
 */
export const BulkEditDrawer: FC<Props> = ({
  open,
  onClose,
  selectedRowIndices,
}) => {
  const parentForm = Form.useFormInstance<ApplicationLocalForm>();
  const [drawerForm] = Form.useForm<ApplicationLocalForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track which fields have been modified
  const modifiedFieldsRef = useRef<Set<string>>(new Set());

  // Initialize drawer form when opened
  useEffect(() => {
    if (!open) {
      modifiedFieldsRef.current = new Set();
      return;
    }

    // Get general form values from parent to maintain consistency
    const generalValues = parentForm.getFieldValue(
      "general",
    ) as GeneralFormType;

    // Start with empty transaction - user fills only what they want to change
    drawerForm.setFieldsValue({
      general: generalValues,
      transactions: [{}],
    });
  }, [parentForm, drawerForm, open]);

  // Track field changes
  const handleValuesChange = useCallback(
    (changedValues: any) => {
      if (changedValues?.transactions?.[0]) {
        const changedFields = Object.keys(changedValues.transactions[0]);
        changedFields.forEach((field) => {
          modifiedFieldsRef.current.add(field);
        });
      }
    },
    [],
  );

  const handleCancel = useCallback(() => {
    drawerForm.resetFields();
    modifiedFieldsRef.current = new Set();
    onClose(false);
  }, [drawerForm, onClose]);

  const handleConfirm = useCallback(async () => {
    if (isSubmitting) return;

    const modifiedFields = modifiedFieldsRef.current;
    if (modifiedFields.size === 0) {
      message.warning("Не было внесено изменений");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the modified values from drawer form
      const drawerTransaction =
        (drawerForm.getFieldValue("transactions")?.[0] as Record<
          string,
          any
        >) || {};

      // Get current transactions from parent form
      const transactions = [
        ...(parentForm.getFieldValue("transactions") ?? []),
      ] as Record<string, any>[];

      // Apply modified fields to all selected rows
      const updatedTransactions = transactions.map((transaction, index) => {
        if (selectedRowIndices.includes(index)) {
          const updated = { ...transaction };
          modifiedFields.forEach((fieldName) => {
            const value = drawerTransaction[fieldName];
            if (value !== undefined) {
              updated[fieldName] = value;
            }
          });
          return updated;
        }
        return transaction;
      });

      // Build payloads for batch API
      const selectedTransactions = selectedRowIndices
        .map((index) => updatedTransactions[index])
        .filter(Boolean);

      const payload: ApplicationTransactionBatchAuditEntity = {
        application_transactions: selectedTransactions.map(
          buildTransactionPayload,
        ),
      };

      // Call batch API
      await apiService.$post<boolean>(
        "/application/batch/transaction-auditor",
        payload,
      );

      // Update parent form with modified transactions
      parentForm.setFieldsValue({ transactions: updatedTransactions });

      message.success(
        `Изменения применены к ${selectedRowIndices.length} записям`,
      );
      drawerForm.resetFields();
      modifiedFieldsRef.current = new Set();
      onClose(true);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при сохранении";
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    drawerForm,
    parentForm,
    isSubmitting,
    onClose,
    selectedRowIndices,
  ]);

  return (
    <Drawer
      placement="bottom"
      open={open}
      onClose={handleCancel}
      destroyOnHidden
      closable
      width="100%"
      height="100%"
      maskClosable={false}
      styles={{
        body: {
          paddingTop: 0,
        },
      }}
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1>Массовое редактирование</h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {selectedRowIndices.length} записей
            </span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} type="default">
              Отмена
            </Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              loading={isSubmitting}
            >
              Применить ко всем
            </Button>
          </div>
        </div>
      }
    >
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-sm text-amber-800">
          Заполните только те поля, которые хотите изменить. Они будут применены
          ко всем выбранным записям ({selectedRowIndices.length} шт.).
        </p>
      </div>

      <Form
        layout="vertical"
        form={drawerForm}
        onValuesChange={handleValuesChange}
      >
        <TransactionForm mode="edit" drawerOpen={open} />
      </Form>
    </Drawer>
  );
};
