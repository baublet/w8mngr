import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "client-build"),
  },
  server: {
    open: true,
    port: 5173,
    proxy: {
      "/graphql": {
        target: "http://127.0.0.1:8787/",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
