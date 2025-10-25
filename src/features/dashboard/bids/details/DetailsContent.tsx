import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CDetailsHeader } from "@/shared/ui/common";
import { ApplicationDetailsTabs } from "@/features/dashboard/bids/details/DetailsTabs";
import { ApplicationDetail } from "@/features/dashboard/bids/details/index";
import { Form } from "antd";
import { DeleteAction } from "@/shared/ui/common/DeleteAction";

interface Props {
  data: ApplicationDetail;
  isLoading: boolean;
}

export const DetailsContent: FC<Props> = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ApplicationDetail>();

  return (
    <>
      <CDetailsHeader
        title={data?.customer_name}
        onEdit={() =>
          navigate(`/dashboard/bids/edit/${id}`, {
            state: { from: `/dashboard/bids/${id}` },
          })
        }
        onDelete={() => setOpenDelete(true)}
      />

      <Form form={form} layout="vertical">
        <ApplicationDetailsTabs application={data} id={data?.application_id} />
      </Form>

      <DeleteAction
        url="/application"
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        params={{
          id: data?.application_id,
          key: "application_id",
        }}
        submit={() => navigate("/dashboard/bids")}
      />
    </>
  );
};
