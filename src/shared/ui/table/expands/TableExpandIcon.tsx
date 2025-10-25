import React from "react";
import { Icon } from "@/shared/ui";
import { RecordType } from "@/shared/ui/table/Table";

interface ExpandIconProps<T> {
  expanded: boolean;
  onExpand: (record: T, event: React.MouseEvent<HTMLElement>) => void;
  record: T;
}

export const TableExpandIcon = <T extends RecordType>({
  expanded,
  onExpand,
  record,
}: ExpandIconProps<T>) => {
  const nestedRecords = record?.nestedData || record?.data;
  if (!nestedRecords || nestedRecords.length === 0) return null;

  if (expanded) {
    return (
      <div
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          onExpand(record, e);
        }}
        className="flex min-h-5 min-w-5 items-center justify-center"
      >
        <Icon icon="close" color="text-primary size-3 cursor-pointer block" />
      </div>
    );
  }

  return (
    <div
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        onExpand(record, e);
      }}
      className="flex h-full min-h-5 w-full min-w-5 items-center justify-center"
    >
      <Icon
        icon="plus"
        color="text-gray-900 size-5 cursor-pointer block hover:text-violet"
      />
    </div>
  );
};
