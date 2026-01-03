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
