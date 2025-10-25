import { twMerge } from "tailwind-merge";

export function cn(
  ...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]
) {
  return twMerge(
    inputs
      .flatMap((input) =>
        typeof input === "string"
          ? input
          : typeof input === "object" && input !== null
            ? Object.keys(input).filter((key) => input[key])
            : [],
      )
      .join(" "),
  );
}
