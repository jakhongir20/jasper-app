import { FC, useState } from "react";

import userDefault from "@/shared/assets/icons/userDefault.svg";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  value: string;
  imgUrl: string;
}

export const CProduct: FC<Props> = ({ className, imgUrl, value }) => {
  const [src, setSrc] = useState(imgUrl || userDefault);

  const handleError = () => {
    setSrc(userDefault);
  };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <p className="h-6 w-6">
        <img className="w-full" src={src} alt="product" onError={handleError} />
      </p>
      <div className="max-w-[80%] text-sm font-medium text-black">{value}</div>
    </div>
  );
};
