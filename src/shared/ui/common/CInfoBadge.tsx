import { FC, ReactNode, useEffect, useState } from "react";

import userDefault from "@/shared/assets/icons/userDefault.svg";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  imageUrl?: string | null;
  subValue?: ReactNode;
  children: ReactNode;
  reversed?: boolean;
  withImage?: boolean;
}

export const CInfoBadge: FC<Props> = ({
  className,
  subValue,
  imageUrl = null,
  children,
  reversed = false,
  withImage = false,
}) => {
  const [src, setSrc] = useState(imageUrl || userDefault);

  const handleError = () => {
    setSrc(userDefault);
  };

  useEffect(() => {
    if (imageUrl) setSrc(imageUrl);
    else setSrc(userDefault);
  }, [imageUrl]);

  return (
    <div
      className={cn(
        "flex w-max items-center gap-2.5 rounded-[6px] border border-dashed border-gray-800 px-3 py-2",
        className,
      )}
    >
      {withImage && (
        <div className="size-9 overflow-hidden rounded-md border border-gray-800">
          <img
            className={"h-full w-full object-cover"}
            src={src}
            alt="avatar"
            onError={handleError}
          />
        </div>
      )}
      <div>
        {reversed ? (
          <div className={"flex flex-col gap-1"}>
            {subValue && (
              <div className="text-xs font-medium text-gray-500">
                {subValue}
              </div>
            )}
            <div className="text-sm font-bold leading-18 text-black">
              {children}
            </div>
          </div>
        ) : (
          <div className={"flex flex-col gap-1"}>
            <div className="text-sm font-bold leading-18 text-black">
              {children}
            </div>
            {subValue && (
              <div className="text-xs font-medium text-gray-500">
                {subValue}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
