import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { apiService } from "@/shared/lib/services/ApiService";
import { showGlobalToast } from "@/shared/hooks/toastService";
import { buildTransactionPayload } from "@/features/dashboard/bids/utils/transactionTransform";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";
import type { ApplicationTransactionBatchAuditEntity } from "@/shared/lib/api/generated/gateway/model";

/**
 * Hook for bulk validation of multiple transaction rows
 * Uses /application/batch/transaction-auditor API
 */
export const useBulkValidation = () => {
  const form = Form.useFormInstance<ApplicationLocalForm>();

  return useMutation({
    mutationFn: async (rowIndices: number[]) => {
      const transactions = form.getFieldValue("transactions") ?? [];

      // Build payloads for selected rows
      const selectedTransactions = rowIndices
        .map((index) => transactions[index])
        .filter(Boolean);

      if (selectedTransactions.length === 0) {
        throw new Error("No transactions selected");
      }

      const payload: ApplicationTransactionBatchAuditEntity = {
        application_transactions: selectedTransactions.map(
          buildTransactionPayload,
        ),
      };

      // Call the batch transaction-auditor API
      const response = await apiService.$post<boolean>(
        "/application/batch/transaction-auditor",
        payload,
      );

      return { response, rowIndices };
    },
    onSuccess: ({ response, rowIndices }) => {
      showGlobalToast(
        `Массовая проверка выполнена для ${rowIndices.length} записей`,
        "success",
      );

      // If API returns updated data, update form
      // Note: The batch API returns boolean, so no data to update
    },
    onError: (error) => {
      console.error("Bulk validation error:", error);
      showGlobalToast("Ошибка массовой проверки", "error");
    },
  });
};
