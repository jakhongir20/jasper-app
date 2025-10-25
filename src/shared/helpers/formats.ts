export const formattedPrice = (value: string | number | undefined) => {
  if (!Boolean(value)) return 0;

  // we need thousands separator as 'space' - so we use fr-FR locale
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    useGrouping: true,
  }).format(value as number);
};

// export const inValidForm = (form: FormInstance): boolean => {
//   return (
//     !form.isFieldsTouched(true) ||
//     form.getFieldsError().some(({ errors }) => errors.length > 0)
//   );
// };

export const formatPrice = (value: number | string) => {
  const intValue = Math.floor(parseFloat(String(value)));
  const withSpaces = intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSpaces}`;
};
