import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { DeleteAction } from "@/features/dashboard/design";
import { useTableFetch } from "@/shared/hooks";
import { TableWrapper } from "@/shared/ui";

import Filter from "@/shared/ui/filter/Filter";

// TODO: Create proper design types and models
interface Design {
  guid: string;
  title: string;
  code: string;
  status: string;
  registrationDate: string;
}

export default function Page() {
  const { tableData, isLoading, pagination } = useTableFetch<Design>(
    "/design/all/",
    {
      user_id: "1",
    },
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAdd = () => {
    navigate(`/dashboard/design/add`);
  };

  const handleOpen = (row: Design) => {
    navigate(`/dashboard/design/${row.guid}`);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  const onDelete = (data: Design) => {
    setOpenDelete(true);
    setSelectedDesign(data);
  };

  // TODO: Create proper columns for design
  const columns = [
    {
      key: "code",
      title: t("common.labels.code"),
      dataIndex: "code",
    },
    {
      key: "title",
      title: t("common.labels.title"),
      dataIndex: "title",
    },
    {
      key: "status",
      title: t("common.labels.status"),
      dataIndex: "status",
    },
    {
      key: "action",
      title: null,
      dataIndex: "action",
      render: (_: unknown, record: Design) => (
        <button onClick={() => onDelete(record)}>
          {t("common.button.delete")}
        </button>
      ),
    },
  ];

  return (
    <div className="px-10">
      <TableWrapper<Design>
        data={tableData as Design[]}
        loading={isLoading}
        columns={columns}
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
        guid={selectedDesign?.guid as string}
        title={selectedDesign?.title || ""}
      />
    </div>
  );
}
