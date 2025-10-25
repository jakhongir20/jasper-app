import { FormInstance, Modal } from "antd";
import React, { FC, ReactNode } from "react";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/helpers";
import { useTranslation } from "react-i18next";

interface Props {
  form?: FormInstance;
  title?: string;
  type: "warning" | "default";
  confirmBtnType?: "primary" | "danger";
  loading?: boolean;
  open: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  confirmBtnClassName?: string;
  showTitle?: boolean;
}

export const ActionModal: FC<Props> = ({
  title,
  type = "warning",
  confirmBtnType = "danger",
  open = false,
  loading,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  children,
  confirmBtnClassName,
  showTitle = false,
}: Props) => {
  const { t } = useTranslation();

  const confirmDefaultText = confirmText ?? t("common.button.delete");
  const cancelDefaultText = cancelText ?? t("common.button.cancel");

  return (
    <Modal
      centered
      destroyOnHidden={true}
      title={null}
      open={open}
      width={400}
      className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-footer]:!mt-0 [&_.ant-modal-footer]:!p-6 [&_.ant-modal-header]:!mb-0 [&_.ant-modal-header]:!rounded-2xl"
      footer={
        <div className={cn("flex items-center gap-4")}>
          <Button type="dashed" className="w-full" onClick={onCancel}>
            {cancelDefaultText}
          </Button>
          <Button
            color={confirmBtnType}
            className={cn(
              "w-full disabled:!text-white disabled:opacity-70",
              confirmBtnClassName,
            )}
            disabled={loading}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmDefaultText}
          </Button>
        </div>
      }
      onCancel={onCancel}
      keyboard={true}
      closable={false}
      maskClosable={false}
      afterClose={() => {}}
    >
      <div className="px-6 pt-6">
        <div className="flex flex-col items-center justify-center">
          {type === "warning" ? (
            <div
              className={cn(
                "mb-6 flex h-20 w-20 items-center justify-center rounded-[50%] bg-[rgba(220,53,69,0.08)] p-4",
                type === "warning"
                  ? "bg-[rgba(220,53,69,0.08)]"
                  : "bg-[rgba(0,0,0,0.08)]",
              )}
            >
              <Icon icon="toast-warning" color={"text-red"} width={56} />
            </div>
          ) : null}
          <div className="mb-1 text-xl font-semibold text-black">
            {type === "warning" && showTitle
              ? t("common.global.wantDelete")
              : title}
          </div>
          <div className="mx-auto text-center text-sm font-normal text-black">
            {type === "warning"
              ? children
                ? children
                : t("common.global.deleteDescription")
              : children}
          </div>
        </div>
      </div>
    </Modal>
  );
};
