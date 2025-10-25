import React, { FC } from "react";
import { cn, formatPrice, formattedPrice } from "@/shared/helpers";
import { Icon } from "@/shared/ui";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  value: number;
}

export const CPriceDifference: FC<Props> = ({ className, value }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-600 px-3 py-2 text-sm">
      <span>{formattedPrice(Math.abs(value))}</span>
      <Icon
        icon="arrow-bolder"
        color={Math.sign(value) === 1 ? "text-green" : "text-red"}
        className={cn(Math.sign(value) === 1 ? "rotate-180 transform" : "")}
      />
    </div>
  );
};
