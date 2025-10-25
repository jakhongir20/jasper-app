import { Radio, RadioChangeEvent } from "antd";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { BankType } from "@/features/currency/exchange-rate/crud";
import userDefault from "@/shared/assets/icons/userDefault.svg";
import { cn } from "@/shared/helpers";

export interface CCustomSelector {
  value: number | string | BankType;
  label: string;
  imageUrl: string | null;
}

interface Props {
  className?: string;
  value: BankType;
  options: CCustomSelector[];
  onChange?: (e: RadioChangeEvent) => void;
}

export const CCustomSelector: FC<Props> = ({
  className,
  value,
  onChange,
  options,
}) => {
  const { t } = useTranslation();

  const [src, setSrc] = useState(userDefault);

  const handleError = () => {
    setSrc(userDefault);
  };

  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      rootClassName={
        "group [&_.ant-radio-button-wrapper]:!border-none [&_.ant-radio-button-wrapper>span]:!w-full [&_.ant-radio-button-wrapper]:before:!hidden [&_.ant-radio-button-wrapper]:!rounded-6 [&_.ant-radio-button-wrapper]:after:!hidden [&_.ant-radio-button-wrapper]:!border-800"
      }
      className={cn(
        "custom-bank-selector group flex h-auto w-full gap-2.5",
        className,
      )}
    >
      {options.map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          checked={true}
          rootClassName={"group"}
          className={
            "custom-bank-selector-item flex min-h-9 w-max cursor-pointer items-center justify-between rounded-lg bg-gray-600 p-2 shadow-sm"
          }
        >
          <div className="flex w-full flex-nowrap items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={"w-7 overflow-hidden rounded-md bg-white"}>
                <img
                  className={"h-full"}
                  src={option.imageUrl || src}
                  alt={option.label}
                  onError={handleError}
                />
              </div>
              <div className="mb-0 truncate text-sm font-medium">
                {t(option.label)}
              </div>
            </div>
          </div>
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
