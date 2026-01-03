/**
 * Sash options for door configuration
 * Used in both TransactionForm and Door2D SashSelector
 */
export const SASH_OPTIONS: { value: string; label: string }[] = [
  { value: "1", label: "1 - Ствочатая" },
  { value: "2", label: "1.5 - Ствочатая" },
  { value: "3", label: "2 - Ствочатая" },
  { value: "4", label: "3 - Ствочатая" },
  { value: "5", label: "4 - Ствочатая" },
];

export type SashOptionValue = "1" | "2" | "3" | "4" | "5";

/**
 * Map sash form value to assignment prefix
 * sash = 1 → one-sash
 * sash = 2 → one-half-sash
 * sash = 3 → two-sash
 * sash = 4 → three-sash
 * sash = 5 → four-sash
 */
export const SASH_TO_ASSIGNMENT: Record<string, string> = {
  "1": "one-sash",
  "2": "one-half-sash",
  "3": "two-sash",
  "4": "three-sash",
  "5": "four-sash",
};

/**
 * Get assignment prefix from sash form value
 */
export function getAssignmentFromSash(sashValue: string | null | undefined): string | null {
  if (!sashValue) return null;
  return SASH_TO_ASSIGNMENT[sashValue] || null;
}
