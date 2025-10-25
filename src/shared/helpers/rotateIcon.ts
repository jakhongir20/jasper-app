export const rotateIcon = (expanded: boolean = false) => {
  const base = "transform transition duration-300 ";
  const value = expanded ? "rotate-180" : "";
  return base + value;
};
