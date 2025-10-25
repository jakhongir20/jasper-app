import { FC } from "react";
import { Drawer } from "antd";
import { Button } from "@/shared/ui";
import { TransactionForm } from "@/features/dashboard/bids/crud/tabs/TransactionForm";

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
          <h1>Добавить перечень</h1>
          <div className={"flex gap-2"}>
            <Button onClick={() => onClose(false)} type={"default"}>
              Отмена
            </Button>
            <Button type={"primary"}>
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
