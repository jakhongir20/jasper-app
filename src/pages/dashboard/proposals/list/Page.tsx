import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Organization } from "@/features/crm/organizations/model/organization.types";
import { DeleteAction } from "@/features/crm/organizations/ui/DeleteAction";
import { columns } from "@/pages/crm/organizations/list/TableColumn";
import { useTableFetch } from "@/shared/hooks";
import { TableWrapper } from "@/shared/ui";

import Filter from "@/shared/ui/filter/Filter";

export default function Page() {
  const { tableData, isLoading, pagination } = useTableFetch<Organization>(
    "/gateway/application/all/",
    {
      user_id: "1",
    },
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAdd = () => {
    navigate(`/crm/organizations/add`);
  };

  const handleOpen = (row: Organization) => {
    navigate(`/crm/organizations/${row.guid}`);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const onDelete = (data: Organization) => {
    setOpenDelete(true);
    setSelectedOrganization(data);
  };

  return (
    <div className="px-10">
      <TableWrapper<Organization>
        data={tableData as Organization[]}
        loading={isLoading}
        columns={columns(t, {
          onOpenDelete: onDelete,
        })}
        unhideableColumns={["code"]}
        clickableColumns={["title", "code"]}
        pagination={pagination}
        filters={[
          "group",
          "recorder",
          "registrationDate_from",
          "registrationDate_to",
          "status",
        ]}
        onAdd={handleAdd}
        onRowClick={handleOpen}
      >
        <Filter
          filters={{
            partner: false,
            organization: false,
            organizationGroup: true,
            statusOptions: [
              { value: "1", label: t("common.status.draft") },
              { value: "2", label: t("common.status.open") },
            ],
          }}
        />
      </TableWrapper>

      <DeleteAction
        open={openDelete}
        setOpen={setOpenDelete}
        guid={selectedOrganization?.guid as string}
        title={selectedOrganization?.title || ""}
      />
    </div>
  );
}
