import dayjs from "dayjs";
import { FC } from "react";

import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  value: string;
}

export const CPeriod: FC<Props> = ({ className, value }) => {
  const time = dayjs(value, "HH:mm:ss.SSSSSS");
  const formattedTime = `${time.hour()} часов ${time.minute()} минут`;

  return (
    <div className={cn("", className)}>
      <div className="text-sm font-medium leading-18 text-black">
        {value ? formattedTime : "-"}
      </div>
    </div>
  );
};
