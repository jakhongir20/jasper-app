export interface ValidationErrorDetail {
  type: string;
  loc: (string | number)[];
  msg: string;
  input: string;
}

export interface ValidationErrors {
  [fieldPath: string]: string[];
}

/**
 * Extracts validation errors from API error response and formats them for form usage
 * @param error - The error object from API response
 * @returns Object with field paths as keys and error messages as arrays
 */
export function extractValidationErrors(error: unknown): ValidationErrors {
  const validationErrors: ValidationErrors = {};

  if (error && typeof error === "object" && "response" in error) {
    const response = (error as any).response;
    const details = response?.data?.detail;

    if (Array.isArray(details)) {
      details.forEach(
        (detail: ValidationErrorDetail | string, index: number) => {
          if (typeof detail === "object" && detail.loc && detail.msg) {
            // Convert location array to field path (e.g., ["body", "transactions", 0, "factory_mdf"] -> "transactions.0.factory_mdf")
            const fieldPath = detail.loc
              .filter((segment) => segment !== "body") // Remove 'body' prefix
              .join(".");

            if (!validationErrors[fieldPath]) {
              validationErrors[fieldPath] = [];
            }

            validationErrors[fieldPath].push(detail.msg);
          }
        },
      );
    }
  }

  return validationErrors;
}

/**
 * Gets the first error message for a specific field
 * @param validationErrors - Object returned from extractValidationErrors
 * @param fieldPath - The field path to get errors for
 * @returns First error message or undefined if no errors
 */
export function getFieldError(
  validationErrors: ValidationErrors,
  fieldPath: string,
): string | undefined {
  return validationErrors[fieldPath]?.[0];
}

/**
 * Checks if a field has validation errors
 * @param validationErrors - Object returned from extractValidationErrors
 * @param fieldPath - The field path to check
 * @returns True if field has errors
 */
export function hasFieldError(
  validationErrors: ValidationErrors,
  fieldPath: string,
): boolean {
  return !!validationErrors[fieldPath]?.length;
}

/**
 * Formats validation errors for display in toast messages
 * @param error - The error object from API response
 * @returns Array of formatted error messages
 */
export function formatValidationErrorsForDisplay(error: unknown): string[] {
  const validationErrors = extractValidationErrors(error);
  const messages: string[] = [];

  Object.entries(validationErrors).forEach(([fieldPath, errors]) => {
    errors.forEach((errorMsg) => {
      // Format: "Field Name: Error message"
      const fieldName = fieldPath.split(".").pop() || fieldPath;
      const formattedFieldName = fieldName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      messages.push(`${formattedFieldName}: ${errorMsg}`);
    });
  });

  return messages;
}
