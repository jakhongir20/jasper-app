import type { FC } from "react";
import { CInfo, CNotation, ContentInner } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { ApplicationDetail } from "@/features/dashboard/bids/details";

interface Props {
  id: number;
  application: ApplicationDetail;
}

export const ApplicationGeneralInfo: FC<Props> = ({ application }) => {
  const { t } = useTranslation();

  return (
    <ContentInner>
      <div
        className={
          "my-3 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
        }
      >
        <CInfo
          value={t("common.labels.address")}
          subValue={application?.address}
        />
        <CInfo
          value={t("common.labels.clientName")}
          subValue={application?.customer?.name || application?.customer_name}
        />
        <CInfo
          value={t("common.labels.clientNumber")}
          subValue={application?.customer?.phone_number || application?.customer_phone}
        />
        <CInfo
          value={t("common.labels.applicationDate")}
          subValue={dayjs(application?.date).format("DD.MM.YYYY HH:mm")}
        />
        <CInfo
          value={t("common.labels.deliveryDate")}
          subValue={application?.delivery_date ? dayjs(application.delivery_date).format("DD.MM.YYYY") : "-"}
        />
        <CInfo
          value={t("common.labels.measurementNumber")}
          subValue={application?.application_id}
        />
        {/* <CInfo
          value={t("common.labels.category")}
          subValue={application?.category_name}
        /> */}
        <CInfo
          value={t("common.labels.doorLock")}
          subValue={application?.default_door_lock?.name || application?.door_lock?.name}
        />
        <CInfo
          value={t("common.labels.doorHinge")}
          subValue={application?.default_hinge?.name}
        />

        <CInfo
          value={t("common.labels.applicationAuthor")}
          subValue={application?.author?.name}
        />
        <CInfo
          value={t("common.labels.dimensions")}
          subValue={application?.sizes || "-"}
        />
      </div>

      <CNotation label={t("common.labels.additionalInfo")} value={application?.remark || "-"} />
    </ContentInner>
  );
};
