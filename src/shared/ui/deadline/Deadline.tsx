import { FC } from "react";
import { BadgeProps as AntDBadgeProps } from "antd";
import { Icon } from "@/shared/ui";
import { cn } from "@/shared/helpers";
import dayjs from "dayjs";

interface Props extends AntDBadgeProps {
  className?: string;
  deadlineDate: Date;
}

export const Deadline: FC<Props> = ({ className, deadlineDate }) => {
  const today = dayjs();
  const deadline = dayjs(deadlineDate);
  const daysDifference = deadline.diff(today, "day");

  let textColor = "text-green";
  if (daysDifference <= 7) {
    textColor = "text-red";
  } else if (daysDifference <= 20) {
    textColor = "text-orange";
  }

  return (
    <div
      className={cn(
        "flex w-fit flex-row items-center justify-center gap-1",
        textColor,
        className,
      )}
    >
      <Icon icon={"srok"} size={24} className={textColor} />
      <span className={"h-[17px] text-sm font-medium"}>
        {deadline.format("DD.MM.YYYY")}
      </span>
    </div>
  );
};
