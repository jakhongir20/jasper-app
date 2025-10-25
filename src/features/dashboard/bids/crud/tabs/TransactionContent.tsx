import { FC, useState } from "react";
import { cn } from "@/shared/helpers";
import {
  ApplicationLocalForm,
  TransactionFormType as Transaction,
} from "@/features/dashboard/bids";
import { TableWrapper } from "@/shared/ui";
import { useTableTransactionColumns } from "@/features/dashboard/bids/constants/columns/TableTransactionColumn";
import { Form } from "antd";
import { TransactionDrawer } from "@/features/dashboard/bids/crud/tabs/TransactionDrawer";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
}

export const TransactionContent: FC<Props> = ({
  className,
  isLoadingDetail,
  mode,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const form = Form.useFormInstance<ApplicationLocalForm>();

  const columns = useTableTransactionColumns({
    onDelete: () => {},
    onEdit: () => {},
    mode: mode,
  });

  return (
    <div className={cn(className)}>
      <TransactionDrawer
        mode={mode}
        open={openDrawer}
        onClose={setOpenDrawer}
      />
      <TableWrapper<Transaction>
        loading={!!isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("transactions")?.length
            ? form.getFieldValue("transactions")
            : []
        }
        rowKey={(record) => record._uid as string}
        columns={columns}
        noFilter
        showSearch={false}
        showDropdown={false}
        onAdd={() => {
          setOpenDrawer(true);
        }}
      />
    </div>
  );
};
