import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { apiService } from "@/shared/lib/services/ApiService";
import { showGlobalToast } from "@/shared/hooks/toastService";
import { buildTransactionPayload } from "@/features/dashboard/bids/utils/transactionTransform";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";

/**
 * Hook for saving a single transaction row
 * Uses /application/transaction-auditor API
 */
export const useSaveRow = () => {
  const form = Form.useFormInstance<ApplicationLocalForm>();

  return useMutation({
    mutationFn: async (rowIndex: number) => {
      const transactions = form.getFieldValue("transactions") ?? [];
      const transaction = transactions[rowIndex];

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Backend handles validation
      const payload = buildTransactionPayload(transaction);

      // Call the transaction-auditor API
      const response = await apiService.$post<Record<string, any>>(
        "/application/transaction-auditor",
        payload,
      );

      return { response, rowIndex };
    },
    onSuccess: ({ response, rowIndex }) => {
      // Update the row with API response (calculated fields)
      const transactions = [...(form.getFieldValue("transactions") ?? [])];

      if (response && typeof response === "object") {
        transactions[rowIndex] = {
          ...transactions[rowIndex],
          ...response,
        };
        form.setFieldValue("transactions", transactions);
      }

      showGlobalToast("Сохранено", "success");
    },
    onError: (error) => {
      console.error("Save row error:", error);
      showGlobalToast("Ошибка сохранения", "error");
    },
  });
};
