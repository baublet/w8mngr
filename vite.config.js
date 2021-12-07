import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "client",
  define: {
    "process.env.GRAPHQL_ENDPOINT":
      "'//localhost:8080/.netlify/functions/graphql'",
  },
});
