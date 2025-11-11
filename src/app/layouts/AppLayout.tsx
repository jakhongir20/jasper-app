import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AppLoading as Loading } from "@/shared/ui";
import eventBus from "@/shared/utils/eventBus";
import { Header } from "@/widgets";

interface Props {
  from?: "settings" | "main";
}

export const AppLayout = ({ from }: Props) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("collapsed");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleUnauthorized = () => {
      // todo back to previuos version
      window.location.href = "/auth/login";
    };

    const handleCatch500 = () => {
      navigate("/500", { replace: true });
    };

    const handleCatch404 = () => {
      navigate("/not-found", { replace: true });
    };

    eventBus.on("catch500", handleCatch500);
    eventBus.on("unauthorized", handleUnauthorized);
    eventBus.on("catch404", handleCatch404);

    return () => {
      eventBus.off("catch500", handleCatch500);
      eventBus.off("unauthorized", handleUnauthorized);
      eventBus.off("catch404", handleCatch404);
    };
  }, [navigate]);

  return (
    <div className="grid h-screen grid-rows-[auto,1fr]">
      <Header />

      <div
        className={
          "flex-between relative min-h-0 overflow-x-hidden transition-all duration-300 ease-in-out"
        }
      >
        {/*<Sidebar*/}
        {/*  from={from}*/}
        {/*  collapsed={collapsed}*/}
        {/*  setCollapsed={setCollapsed}*/}
        {/*/>*/}

        <main className="relative min-h-0 w-full overflow-y-auto overflow-x-hidden">
          <Loading />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
