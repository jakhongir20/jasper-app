import { t } from "i18next";
import { FC, useState } from "react";

import userDefault from "@/shared/assets/icons/userDefault.svg";
import { cn, formattedPrice } from "@/shared/helpers";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  imageUrl?: string | null;
  name: string;
  accountBalance: string | number;
  link?: string;
}

export const CPartnerCard: FC<Props> = ({
  className,
  imageUrl = null,
  name,
  accountBalance,
  link,
}) => {
  const [src, setSrc] = useState(imageUrl || userDefault);

  const handleError = () => {
    setSrc(userDefault);
  };
  return (
    <div
      className={cn(
        "flex w-max min-w-[297px] items-center gap-3 rounded-xl border border-gray-800 bg-gray-600 p-2",
        className,
      )}
    >
      {imageUrl != null && (
        <p className="h-[76px] w-[76px] overflow-hidden rounded-lg border border-gray-700">
          <img
            className={"h-full w-full object-cover"}
            src={src}
            alt="avatar"
            onError={handleError}
          />
        </p>
      )}
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xs font-medium leading-15 text-gray-500">
            {t("common.details.name")}:
          </p>
          <Link to={link} className="text-sm font-bold leading-18 text-black">
            {name}
          </Link>
        </div>
        <div className="text-sm font-bold leading-18 text-black">
          <p className="text-xs font-medium leading-18 text-gray-500">
            {t("common.table.balance")}:
          </p>
          <p className="text-sm font-bold leading-18 text-black">
            {formattedPrice(accountBalance)}
          </p>
        </div>
      </div>
    </div>
  );
};
