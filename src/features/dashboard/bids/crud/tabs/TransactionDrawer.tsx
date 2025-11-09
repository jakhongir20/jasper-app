import { FC, useCallback } from "react";
import { Drawer, Form, message } from "antd";
import { Button } from "@/shared/ui";
import {
  TransactionForm,
  getTransactionValidationPaths,
} from "@/features/dashboard/bids/crud/tabs/TransactionForm";
import { ApplicationLocalForm } from "@/features/dashboard/bids";

interface Props {
  className?: string;
  open: boolean;
  onClose: (closed: boolean) => void;
  mode: "add" | "edit";
}

export const TransactionDrawer: FC<Props> = ({
  className,
  open,
  onClose,
  mode,
}) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();

  const handleConfirm = useCallback(async () => {
    const transactions = form.getFieldValue("transactions") || [];
    const currentTransaction = transactions?.[0] || {};
    const validationPaths = getTransactionValidationPaths(
      currentTransaction as Record<string, unknown>,
    );

    try {
      await form.validateFields(validationPaths as any);
      onClose(false);
    } catch (error) {
      message.error("Заполните обязательные поля");
    }
  }, [form, onClose]);

  return (
    <Drawer
      placement={"bottom"}
      open={open}
      onClose={() => onClose(false)}
      destroyOnHidden
      closable
      width={"100%"}
      height={"100%"}
      maskClosable={false}
      className={className}
      title={
        <div className={"flex items-center justify-between"}>
          <h1>
            {mode === "edit" ? "Редактировать перечень" : "Добавить перечень"}
          </h1>
          <div className={"flex gap-2"}>
            <Button onClick={() => onClose(false)} type={"default"}>
              Отмена
            </Button>
            <Button type={"primary"} onClick={handleConfirm}>
              {mode === "edit" ? "Сохранить изменения" : "Подтвердить"}
            </Button>
          </div>
        </div>
      }
    >
      <TransactionForm mode={mode} />
    </Drawer>
  );
};
