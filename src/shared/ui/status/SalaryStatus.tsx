import { FC } from "react";

import { getSalaryStatusLabel } from "@/shared/constants/getStatusLabel";
import { cn } from "@/shared/helpers";

export enum STATUS {
  Added = 1,
  notAdded = 2,
}

export type StatusType = keyof typeof STATUS;

interface Props {
  className?: string;
  value: number;
}

const generateStatus = (status: number) => {
  switch (status) {
    case 1:
      return "text-white bg-blue border border-white/[20%]";
    case 2:
      return "text-black-100 bg-gray-700 border border-white/[20%]";
  }
};

export const SalaryStatus: FC<Props> = ({ className, value }) => {
  const status = generateStatus(+value);

  return (
    <div
      className={cn(
        className,
        status,
        "max-w-max rounded border border-white-20 px-6px py-2px text-center text-xs font-semibold uppercase",
      )}
    >
      {getSalaryStatusLabel(+value)}
    </div>
  );
};
