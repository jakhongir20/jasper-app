import { useNavigate } from "react-router-dom";

import { Button, Icon } from "@/shared/ui";
import { useTranslation } from "react-i18next";

export default function ServerError() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={"flex h-screen flex-col items-center justify-center"}>
      <p className={"-mt-20 mb-10 h-[400px]"}>
        <img src="/500.svg" alt="500" />
      </p>
      <div className={"text-3xl font-bold"}>
        {t("common.details.serverError")}
      </div>
      <div className={"font-regular mb-8 mt-2 text-xl text-black-100"}>
        {t("common.details.serverErrorDetail")}
      </div>

      <div>
        <Button
          color={"primary"}
          icon={<Icon icon={"arrow-left"} color={"text-white"} />}
          type={"link"}
          onClick={() => navigate("/", { replace: true })}
        >
          {t("common.details.goToHome")}
        </Button>
      </div>
    </div>
  );
}
