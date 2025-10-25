import { FC } from "react";

import { getAboutStatusLabel } from "@/shared/constants/getStatusLabel";
import { cn } from "@/shared/helpers";

export enum AboutSTATUS {
  blocked = 1,
  active = 2,
  inventory = 3,
}

export type StatusType = keyof typeof AboutSTATUS;

interface Props {
  className?: string;
  value: number;
}

const generateStatus = (status: number) => {
  switch (status) {
    case 1:
      return "text-white bg-red border border-white/[20%]";
    case 2:
      return "text-white bg-green border border-white/[20%]";
    case 3:
      return "text-black-100 bg-gray-700 border border-white/[20%]";
  }
};

export const AboutStatus: FC<Props> = ({ className, value }) => {
  const status = generateStatus(+value);

  return (
    <div
      className={cn(
        className,
        status,
        "max-w-max rounded border border-white-20 px-6px py-2px text-center text-xs font-semibold uppercase",
      )}
    >
      {getAboutStatusLabel(+value)}
    </div>
  );
};
