import { Form, FormInstance, Modal as ModalUI, ModalProps } from "antd";
import { FC, ReactNode } from "react";

import { cn } from "@/shared/helpers";
import { Button, Icon } from "@/shared/ui";

interface Props extends ModalProps {
  className?: string;
  form?: FormInstance;
  title: string | ReactNode;
  loading?: boolean;
  footerBordered?: boolean;
  open: boolean;
  size?: "small" | "middle" | "large" | "extra-large";
  onSave?: () => void;
  onCancel: () => void;
  saveBtnText?: string;
  cancelText?: string;
  children: ReactNode;
  centered?: boolean;
  buttonsFullWidth?: boolean;
  disabledBtns?: boolean;
  manualWith?: number;
  noFooter?: boolean;
  disableSave?: boolean;
}

type ModalWidth = 400 | 610 | 660 | 930;

export const Modal: FC<Props> = ({
  title,
  open = false,
  loading,
  size = "middle",
  onSave,
  onCancel,
  saveBtnText = "save",
  cancelText = "cancel",
  className,
  footerBordered = false,
  buttonsFullWidth = false,
  disabledBtns = false,
  noFooter = false,
  centered = true,
  disableSave = false,
  manualWith = 0,
  children,
  form,
  ...rest
}: Props) => {
  const width: ModalWidth =
    size === "small"
      ? 400
      : size === "middle"
        ? 610
        : size === "large"
          ? 660
          : 930;

  return (
    <ModalUI
      destroyOnHidden
      title={
        <div className="flex h-[52px] items-center justify-between border-b border-gray-800 p-4">
          <div className="text-base font-semibold text-black">{title}</div>
          <span className="cursor-pointer" onClick={onCancel}>
            <Icon
              icon="close"
              className="cursor-pointer transition-all duration-200 hover:text-gray-400"
              width={14}
              height={14}
            />
          </span>
        </div>
      }
      open={open}
      width={manualWith ? manualWith : width}
      rootClassName={"[&_.ant-modal-footer]:!mt-0"}
      className={cn(
        "[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-footer]:!p-4 [&_.ant-modal-header]:!mb-0 [&_.ant-modal-header]:!rounded-2xl",
        footerBordered
          ? "[&_.ant-modal-footer]:!border-t [&_.ant-modal-footer]:!border-solid [&_.ant-modal-footer]:!border-gray-800"
          : "",
      )}
      footer={
        !noFooter ? (
          <div
            className={cn(
              "flex items-center gap-4",
              size === "large" || size === "extra-large" ? "justify-end" : "",
            )}
          >
            <Button
              type="dashed"
              className={cn(
                size === "large" || size === "extra-large" ? "" : "w-full",
                buttonsFullWidth ? "w-full" : "",
              )}
              disabled={loading || disabledBtns}
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              type="primary"
              className={cn(
                size === "large" || size === "extra-large" ? "" : "w-full",
                buttonsFullWidth ? "w-full" : "",
              )}
              disabled={loading || disabledBtns || disableSave}
              loading={loading}
              onClick={onSave}
            >
              {saveBtnText}
            </Button>
          </div>
        ) : null
      }
      closable={false}
      maskClosable={false}
      // afterClose={() => {}}
      centered={centered}
      {...rest}
    >
      {form ? (
        <Form form={form} layout="vertical">
          <div className={cn("max-h-[80svh] overflow-y-auto p-5", className)}>
            {children}
          </div>
        </Form>
      ) : (
        <div className={cn("max-h-[80svh] overflow-y-auto p-5", className)}>
          {children}
        </div>
      )}
    </ModalUI>
  );
};
