import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { apiService } from "@/shared/lib/services/ApiService";
import { showGlobalToast } from "@/shared/hooks/toastService";
import { buildTransactionPayload } from "@/features/dashboard/bids/utils/transactionTransform";
import type { ApplicationLocalForm } from "@/features/dashboard/bids/model";
import {
  REQUIRED_FIELDS_BY_PRODUCT_TYPE,
  CONDITIONAL_REQUIREMENTS,
  MEASUREMENT_FIELDS,
  ALL_SECTIONS,
} from "../../TransactionForm";

/**
 * Validate a transaction row based on product_type
 */
const validateTransaction = (
  transaction: Record<string, unknown>,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const productType = (transaction.product_type as string) || "";

  if (!productType) {
    errors.push("Тип продукта обязателен");
    return { isValid: false, errors };
  }

  // Get required fields for this product type
  const requiredFields = REQUIRED_FIELDS_BY_PRODUCT_TYPE[productType] || [];
  const conditionalRequirements = CONDITIONAL_REQUIREMENTS[productType] || {};

  // Get field labels for error messages
  const getFieldLabel = (fieldName: string): string => {
    const measurementField = MEASUREMENT_FIELDS.find((f) => f.name === fieldName);
    if (measurementField) return measurementField.label;

    for (const section of ALL_SECTIONS) {
      const field = section.fields.find((f) => f.name === fieldName);
      if (field) return field.label;
    }
    return fieldName;
  };

  // Check required fields
  for (const fieldName of requiredFields) {
    const value = transaction[fieldName];
    if (value === undefined || value === null || value === "") {
      errors.push(`${getFieldLabel(fieldName)} обязательно`);
    }
  }

  // Check conditional requirements
  for (const [fieldName, condition] of Object.entries(conditionalRequirements)) {
    if (condition(transaction as Record<string, unknown>)) {
      const value = transaction[fieldName];
      if (value === undefined || value === null || value === "") {
        errors.push(`${getFieldLabel(fieldName)} обязательно`);
      }
    }
  }

  return { isValid: errors.length === 0, errors };
};

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

      // Validate before saving
      const { isValid, errors } = validateTransaction(transaction);
      if (!isValid) {
        throw new Error(errors.slice(0, 3).join("\n")); // Show first 3 errors
      }

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
