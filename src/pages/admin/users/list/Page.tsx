import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { User, UserDeleteAction } from "@/features/admin/users";

import { ContentInner, TableWrapper } from "@/shared/ui";
import { columns } from "./TableColumn";
import { useTableFetch } from "@/shared/hooks";
import { authApiService } from "@/shared/lib/services/ApiService";

export default function Page() {
  const {
    tableData: users,
    isLoading,
    pagination,
  } = useTableFetch<User>(
    "/admin/all",
    {},
    ["tab", "page"],
    false,
    20,
    authApiService,
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAdd = () => {
    navigate(`/admin/users/add`);
  };

  const handleOpen = (row: User) => {
    navigate(`/admin/users/${row.user_id}`);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const onDelete = (data: User) => {
    setOpenDelete(true);
    setSelectedUser(data);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<User>
        data={users || []}
        loading={isLoading}
        columns={columns(t, {
          onOpenDelete: onDelete,
          canEdit: true,
          canDelete: true,
        })}
        noFilter
        unhideableColumns={["ID"]}
        clickableColumns={["Имя", "ID"]}
        pagination={pagination}
        onAdd={handleAdd}
        onRowClick={handleOpen}
      />

      <UserDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        userId={selectedUser?.user_id || 0}
      />
    </ContentInner>
  );
}
