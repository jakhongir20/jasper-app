import { Form } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/helpers";
import { Button, ContentWrapper, CTitle, Status } from "@/shared/ui";

interface Props {
  className?: string;
  title?: string;
  mode?: "add" | "edit";
  loading?: boolean;
  disabled?: boolean;
  disabledAddBtn?: boolean;
  onSaveDraft?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  saveDraftText?: string;
  saveText?: string;
  addText?: string;
  cancelText?: string;
  children?: React.ReactNode | React.ReactNode[];
  code?: string;
  status?: number;
  showAddButton?: boolean | null;
  showCancelButton?: boolean;
  saveDraftClass?: string;
}

export const CAddHeader: FC<Props> = ({
  className,
  title,
  mode,
  onSaveDraft = () => {},
  onSave = () => {},
  onCancel = () => {},
  saveText,
  addText,
  cancelText,
  loading,
  code,
  status,
  showAddButton = true,
  showCancelButton = false,
  saveDraftClass,
  disabledAddBtn = false,
}) => {
  const { t } = useTranslation();
  const [loadingButton, setLoadingButton] = useState<"draft" | "save" | null>(
    null,
  );

  const handleSave = () => {
    setLoadingButton("save");
    onSave();
  };

  useEffect(() => {
    if (!loading) {
      setLoadingButton(null);
    }
  }, [loading]);

  return (
    <ContentWrapper className={cn("!no-scrollbar", className)}>
      <div className="flex w-full items-center justify-between pl-4">
        <div className="flex flex-row items-center gap-3">
          <div className={"flex flex-row items-center gap-3"}>
            <CTitle value={title} />

            {status ? <Status value={status} /> : null}

            {code ? (
              <span
                className={
                  "rounded-md bg-violet-300 px-6px py-2px text-base font-semibold text-violet"
                }
              >
                {code}
              </span>
            ) : null}
          </div>
        </div>

        <div className={cn("mr-4 flex gap-3 p-2.5", saveDraftClass)}>
          {showCancelButton && (
            <Form.Item>
              <Button
                type="default"
                onClick={onCancel}
                disabled={loading || disabledAddBtn}
              >
                {cancelText || t("common.button.cancel")}
              </Button>
            </Form.Item>
          )}
          <Form.Item>
            {showAddButton && (
              <Button
                type="primary"
                htmlType="submit"
                loading={loadingButton === "save" && loading}
                disabled={
                  (loadingButton === "draft" && loading) || disabledAddBtn
                }
                onClick={handleSave}
              >
                {t("common.button.save")}
              </Button>
            )}
          </Form.Item>
        </div>
      </div>
    </ContentWrapper>
  );
};
