import { useMemo } from "react";
import {
  extractValidationErrors,
  getFieldError,
  hasFieldError,
} from "@/shared/utils";

/**
 * Custom hook for handling API validation errors in forms
 * @param error - The error object from API response
 * @returns Object with helper functions for validation error handling
 */
export function useValidationErrors(error: unknown) {
  const validationErrors = useMemo(
    () => extractValidationErrors(error),
    [error],
  );

  return {
    validationErrors,
    getFieldError: (fieldPath: string) =>
      getFieldError(validationErrors, fieldPath),
    hasFieldError: (fieldPath: string) =>
      hasFieldError(validationErrors, fieldPath),
    // Helper for nested form fields like "transactions.0.factory_mdf"
    getNestedFieldError: (fieldPath: string) =>
      getFieldError(validationErrors, fieldPath),
    // Helper for array fields like "transactions.0.factory_mdf"
    getArrayFieldError: (arrayName: string, index: number, fieldName: string) =>
      getFieldError(validationErrors, `${arrayName}.${index}.${fieldName}`),
    // Check if any validation errors exist
    hasErrors: Object.keys(validationErrors).length > 0,
    // Get all error messages
    getAllErrors: () => {
      const allErrors: string[] = [];
      Object.values(validationErrors).forEach((errors) => {
        allErrors.push(...errors);
      });
      return allErrors;
    },
  };
}
