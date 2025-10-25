import { Tooltip } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/helpers";
import { Button, ContentWrapper, CTitle, Icon, Status } from "@/shared/ui";

interface Props {
  className?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  title?: string;
  status?: number;
  showEditButton?: boolean | null;
  showDeleteButton?: boolean | null;
  duplicateButtonOptions?: {
    show?: boolean;
    text?: string;
    action?: () => void;
    disabled?: boolean;
  };
}

export const CDetailsHeader: FC<Props> = ({
  className,
  onDelete,
  onEdit,
  title = "Title",
  status,
  showEditButton = true,
  showDeleteButton = true,
  duplicateButtonOptions = { show: false, text: "" },
}) => {
  const { t } = useTranslation();

  return (
    <ContentWrapper className={cn("h-[64px] px-4", className)}>
      <div className="flex w-full items-center justify-between">
        <div className={"flex flex-row items-center gap-3"}>
          <CTitle value={title} />

          {status ? <Status value={status} /> : null}
        </div>
        <div className="flex gap-3 p-2.5 px-0">
          {duplicateButtonOptions.show && (
            <Tooltip
              title={
                duplicateButtonOptions.disabled
                  ? t("common.tooltip.noPartnerOrOrganisation")
                  : ""
              }
            >
              <span>
                <Button
                  type="default"
                  color={"default"}
                  icon={<Icon icon="forward" color="text-black" />}
                  iconPosition={"start"}
                  onClick={duplicateButtonOptions.action}
                  className={"hover:!bg-gray-200/30"}
                  disabled={duplicateButtonOptions.disabled}
                >
                  {duplicateButtonOptions.text || t("common.button.duplicate")}
                </Button>
              </span>
            </Tooltip>
          )}

          {showEditButton && (
            <Button
              type="default"
              color={"default"}
              icon={<Icon icon="pen-square" color="text-black" />}
              iconPosition={"start"}
              onClick={onEdit}
              className={"hover:!bg-gray-200/30"}
            >
              {t("common.button.edit")}
            </Button>
          )}

          {showDeleteButton && (
            <Button
              type="primary"
              color={"red"}
              icon={<Icon icon="trash" color="text-red" />}
              onClick={onDelete}
              className="hover:!bg-red-200/30"
            >
              {t("common.button.delete")}
            </Button>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
