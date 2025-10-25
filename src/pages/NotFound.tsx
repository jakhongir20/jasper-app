import { useNavigate } from "react-router-dom";

import { Button, Icon } from "@/shared/ui";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={"flex h-screen flex-col items-center justify-center"}>
      <p className={"-mt-20 mb-10 h-[400px]"}>
        <img src="/404.svg" alt="404" />
      </p>

      <div className={"text-3xl font-bold"}>
        {t("common.details.pageNotFound")}
      </div>
      <div className={"font-regular mb-8 mt-2 text-xl text-black-100"}>
        {t("common.details.pageNotFoundDetail")}
      </div>

      <div>
        <Button
          color={"primary"}
          icon={<Icon icon={"arrow-left"} color={"text-white"} />}
          type={"link"}
          onClick={() => navigate("/dashboard/bids", { replace: true })}
        >
          {t("common.details.goToHome")}
        </Button>
      </div>
    </div>
  );
}
