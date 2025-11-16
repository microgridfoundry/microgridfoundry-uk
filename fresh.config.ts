import { defineConfig } from "fresh";

export default defineConfig({
  plugins: [],
  server: {
    hostname: "0.0.0.0",
    port: parseInt(Deno.env.get("PORT") || "8000"),
  },
});
