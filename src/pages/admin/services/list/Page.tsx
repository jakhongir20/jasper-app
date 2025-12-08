import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Service, ServiceDeleteAction } from "@/features/admin/services";
import { TableWrapper, ContentInner } from "@/shared/ui";
import { columns } from "./TableColumn";
import { ServiceAddForm } from "@/features/admin/services/crud/form/ServiceAddForm";
import { ServiceEditForm } from "@/features/admin/services/crud/form/ServiceEditForm";
import { useTableFetch } from "@/shared/hooks";

export default function Page() {
  const { tableData: services, isLoading } = useTableFetch<Service>("/admin/service/all");
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setOpenEdit(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setOpenDelete(true);
  };

  const handleAddSuccess = () => {
    setOpenAdd(false);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setSelectedService(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Service>
        data={services || []}
        loading={isLoading}
        columns={columns(t, {
          onOpenEdit: handleEdit,
          onOpenDelete: handleDelete,
          canEdit: true,
          canDelete: true,
        })}
        pagination={false}
        onAdd={handleAdd}
        noFilter
        unhideableColumns={["name"]}
      />

      {/* Add Service Modal */}
      <ServiceAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Service Modal */}
      {selectedService && (
        <ServiceEditForm
          open={openEdit}
          serviceId={selectedService?.service_id || 0}
          onCancel={() => {
            setOpenEdit(false);
            setSelectedService(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Service Modal */}
      <ServiceDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        serviceId={selectedService?.service_id || 0}
      />
    </ContentInner>
  );
}
