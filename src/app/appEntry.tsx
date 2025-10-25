import "@/app/style/index.css";
import "./i18n";
import "@ant-design/v5-patch-for-react-19";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Providers } from "@/app/providers";
import { AppRouter } from "@/app/routes";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Providers>
      <AppRouter />
    </Providers>
  </StrictMode>,
);
