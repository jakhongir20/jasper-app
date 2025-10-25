import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { LoginForm } from "@/features/auth/login";
import { cn } from "@/shared/helpers";
import { useToast } from "@/shared/hooks";

interface Props {
  className?: string;
}

export const LoginPage: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("callback") === "currenciesNotFound") {
      toast(t("common.messages.currenciesNotFound"), "warning");

      searchParams.delete("callback");
      setSearchParams(searchParams);
    }
  }, [searchParams, toast, setSearchParams]);

  return (
    <div
      className={cn(
        className,
        "w-full max-w-sm rounded-2xl bg-white bg-[url('/bg.svg')] bg-[length:100%_auto] bg-top bg-no-repeat px-6 pb-8 pt-10",
      )}
    >
      <div className="mb-4 flex flex-col items-center justify-center gap-2.5">
        <div className="rounded-full p-1.5">
          <img
            src="/logo.svg"
            className={"h-16"}
            alt={t("common.alt.dmsLogo")}
          />
        </div>
        <h1 className="text-2xl font-semibold text-black">
          {t("auth.login.title")}
        </h1>
      </div>

      <LoginForm className={"max-w-96"} />
    </div>
  );
};
