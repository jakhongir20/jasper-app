import { FC } from "react";

import {
  getSalaryBillStatusLabel,
  getVehicleStatusLabel,
} from "@/shared/constants/getStatusLabel";
import { cn } from "@/shared/helpers";

export enum VehicleSTATUS {
  available = 1,
  isUsed = 2,
  isFixed = 3,
  outOfUsage,
}

export type StatusType = keyof typeof VehicleStatus;

interface Props {
  className?: string;
  value: number;
}

const generateStatus = (status: number) => {
  switch (status) {
    case 1:
      return "text-black-100 bg-gray-700 border border-white/[20%]";
    case 2:
      return "text-white bg-blue border border-white/[20%]";
    case 3:
      return "text-white bg-orange border border-white/[20%]";
    case 4:
      return "text-white bg-red border border-white/[20%]";
  }
};

export const VehicleStatus: FC<Props> = ({ className, value }) => {
  const status = generateStatus(+value);

  return (
    <div
      className={cn(
        className,
        status,
        "max-w-max rounded border border-white-20 px-6px py-2px text-center text-xs font-semibold uppercase",
      )}
    >
      {getVehicleStatusLabel(+value)}
    </div>
  );
};
