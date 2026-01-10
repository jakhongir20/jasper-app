import { type FC } from "react";
import { cn } from "@/shared/helpers";
import { EditableTransactionsTable } from "@/features/dashboard/bids/crud/tabs/EditableTable";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabTransactionsForm: FC<Props> = ({ className, mode }) => {
  return (
    <div className={cn("relative py-1", className)}>
      <EditableTransactionsTable mode={mode} />
    </div>
  );
};
