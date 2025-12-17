import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ApplicationListItem } from "@/features/dashboard/bids";
import { useProfile } from "@/features/auth/login/model/auth.queries";
import { columns } from "./TableColumn";
import { useTableFetch, useToggle } from "@/shared/hooks";
import { TableWrapper } from "@/shared/ui";
import { DeleteAction } from "@/shared/ui/common/DeleteAction";
import Filter from "@/shared/ui/filter/Filter";

export default function Page() {
  const { data: user } = useProfile();
  const endpoint = user?.is_admin ? "/admin/application/all" : "/application/all";

  const { tableData, isLoading, pagination } =
    useTableFetch<ApplicationListItem>(endpoint);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOpen: isOpenDelete, toggle: toggleOpenDelete } = useToggle();

  const handleAdd = () => navigate(`add`);

  const handleOpen = (row: ApplicationListItem) => {
    if (row?.application_id) navigate(`${row?.application_id}`);
  };

  const [selectedRecord, setSelectedRecord] =
    useState<ApplicationListItem | null>(null);

  const onDelete = (data: ApplicationListItem) => {
    toggleOpenDelete();
    setSelectedRecord(data);
  };

  // test

  return (
    <div className="px-4">
      <TableWrapper<ApplicationListItem>
        data={tableData as ApplicationListItem[]}
        loading={isLoading}
        columns={columns(t, {
          onOpenDelete: onDelete,
          canEdit: true,
          canDelete: true,
        })}
        clickableColumns={[]}
        pagination={pagination}
        filters={["date_from", "date_to"]}
        onAdd={handleAdd}
        onRowClick={handleOpen}
      >
        <Filter
          filters={{
            partner: false,
            organization: false,
            paymentType: false,
            status: false,
            totalAmount: false,
            recorder: false,
            date: false,
            registrationDate: false,
            applicationDate: true,
          }}
        />
      </TableWrapper>

      <DeleteAction
        open={isOpenDelete}
        closeModal={toggleOpenDelete}
        url="/application"
        params={{
          id: selectedRecord?.application_id?.toString() || "",
          key: "application_id",
        }}
      />
    </div>
  );
}
