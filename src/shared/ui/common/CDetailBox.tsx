import { Avatar } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";

import userDefault from "@/shared/assets/icons/userDefault.svg";
import { cn } from "@/shared/helpers";
import { Status } from "@/shared/ui";
import { AboutStatus } from "@/shared/ui/status/AboutStatus";
import { SalaryStatus } from "@/shared/ui/status/SalaryStatus";

interface Props {
  title: string;
  status?: number;
  statusType?: string;
  className?: string;
  value: string;
  children?: ReactNode;
  isAbout?: boolean;
  noStatus?: boolean;
}

export const CDetailBox: FC<Props> = ({
  title,
  status,
  className,
  value,
  children,
  statusType,
  isAbout,
  noStatus,
}) => {
  const [src, setSrc] = useState(value ?? userDefault);

  const handleError = () => {
    setSrc(userDefault);
  };

  useEffect(() => {
    if (value) setSrc(value);
    else setSrc(userDefault);
  }, [value]);

  return (
    <div className={cn("mb-6 flex max-w-min gap-5", className)}>
      <Avatar
        key={src}
        shape="square"
        rootClassName={"[&_.ant-avatar]:!rounded-xl border-gray-800"}
        size={148}
        style={{ minWidth: 148, minHeight: 148 }}
        src={
          <img
            className={"h-full w-full object-cover"}
            src={src}
            alt={title || ""}
            onError={handleError}
          />
        }
      />
      <div className="flex flex-col justify-between">
        <div className="mb-2">
          <p
            className={cn(
              "mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium leading-6 text-black",
            )}
          >
            {title}
          </p>
          {!noStatus &&
            (isAbout ? (
              <AboutStatus value={status} />
            ) : statusType === "salaryStatus" ? (
              <SalaryStatus value={status} />
            ) : (
              <Status value={status} />
            ))}
        </div>
        {children && children}
      </div>
    </div>
  );
};
