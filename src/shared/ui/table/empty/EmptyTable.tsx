import { Button, Icon } from "@/shared/ui";
import { Link } from "react-router-dom";
import React, { FC } from "react";
import { cn } from "@/shared/helpers";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  showAddButton?: boolean;
  link?: string;
  onClick?: () => void;
}

export const EmptyTable: FC<Props> = function ({
  className,
  showAddButton = true,
  link,
  onClick,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        className,
        "flex h-full min-h-[calc(60vh_-_90px)] items-center justify-center",
      )}
    >
      <div className="grid place-items-center gap-6">
        <div className="flex size-[88px] items-center justify-center rounded-full bg-gray-600 p-5">
          <Icon
            // icon={(icon as IconType) ?? "plus"}
            icon="list"
            color="text-gray-500"
            width={48}
          />
        </div>

        <div className={"flex flex-col items-center gap-6"}>
          <div className={"text-center"}>
            <h2 className="text-2xl font-semibold text-black">
              {t("common.noData.title")}
            </h2>
            <p className="font-normal text-black-100">
              {t("common.noData.description")}
            </p>
          </div>

          {showAddButton &&
            (link ? (
              <Link to={link}>
                <Button
                  icon={<Icon icon={"plus"} />}
                  className={"text-sm font-medium text-white"}
                  color={"primary"}
                  onClick={() => onClick?.()}
                >
                  {t("common.button.add")}
                </Button>
              </Link>
            ) : (
              <Button
                icon={<Icon icon={"plus"} color={"text-white"} />}
                className={"text-sm font-medium text-white"}
                color={"primary"}
                onClick={() => onClick?.()}
              >
                {t("common.button.add")}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};
