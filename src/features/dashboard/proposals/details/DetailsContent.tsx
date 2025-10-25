import type { FC } from "react";
import { cn } from "@/shared/helpers";
import { CDetailsHeader } from "@/shared/ui/common";
import { useNavigate } from "react-router-dom";
import { DetailsCard, DetailsTabs } from "@/features/purchase/no-ship/details";
import { DeleteAction } from "@/features/purchase/no-ship/ui";
import type {
  PurchaseWithoutDelivery,
  PurchaseWithoutDeliveryList,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { usePWDCargo } from "@/features/purchase/no-ship/model/no-shipment.queries";
import { useToggle } from "@/shared/hooks/useToggle";

interface Props {
  className?: string;
  data: PurchaseWithoutDelivery & PurchaseWithoutDeliveryList;
}

export const DetailsContent: FC<Props> = ({ className, data }) => {
  const { isOpen, toggle } = useToggle();
  const navigate = useNavigate();
  // const { data: cargo } = usePWDCargo(data?.id);

  return (
    <div className={cn(className)}>
      <CDetailsHeader
        title={data?.code || ""}
        status={data?.status}
        onEdit={() =>
          navigate(`/purchase/no-ship/edit/${data.guid}`, {
            state: { from: `/purchase/no-ship/${data.guid}` },
          })
        }
        showEditButton
        onDelete={toggle}
      />
      <DetailsCard data={data} />
      {/*<DetailsTabs dataId={data?.id} cargo={cargo?.results || []} />*/}
      <DetailsTabs dataId={data?.id} />
      <DeleteAction
        open={isOpen}
        closeModal={toggle}
        guid={data?.guid as string}
        submit={() => navigate("/purchase/no-ship")}
      />
    </div>
  );
};
