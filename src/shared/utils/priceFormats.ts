export const stripNonDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const formatWithSpaces = (digitsOnly: string): string => {
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
