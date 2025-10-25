// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/",

  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
    }),
  ],

  preview: {
    allowedHosts: true,
  },

  server: {
    port: 3000,
    hmr: {
      overlay: true, // Enables HMR error overlay (default is true)
    },
    allowedHosts: true,
    open: true,
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
