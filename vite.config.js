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
    proxy: {
      "/.netlify/functions/graphql": "http://localhost:8081",
    },
  },
});
