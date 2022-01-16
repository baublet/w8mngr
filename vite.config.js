import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "client-build"),
  },
  define: {
    "process.env.GRAPHQL_ENDPOINT":
      "'//localhost:8080/.netlify/functions/graphql'",
  },
});
