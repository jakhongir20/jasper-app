import { FC } from "react";
import { cn } from "@/shared/helpers";
import { Button, Icon } from "@/shared/ui";

interface Props {
  className?: string;
  text: string;
  onClick?: () => void;
}

export const CollapseDeleteBtn: FC<Props> = ({
  className,
  text,
  onClick,
  ...rest
}) => {
  return (
    <Button
      size="small"
      type={"text"}
      className={cn(
        "group mr-4 flex h-7 items-center justify-between gap-1 rounded-md !px-2 !py-1.5 transition-all duration-300",
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      <span className="text-xs font-medium text-gray-500 group-hover:text-black">
        {text}
      </span>
      <Icon icon="trash" color="text-gray-500 group-hover:text-black" />
    </Button>
  );
};
