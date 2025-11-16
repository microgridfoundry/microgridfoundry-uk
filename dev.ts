#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { tailwind } from "@fresh/plugin-tailwind";
import { Builder } from "fresh/dev";

const port = parseInt(
  Deno.env.get("PORT") || Deno.env.get("APP_PORT") || "8000",
);

const builder = new Builder();
tailwind(builder);

if (Deno.args.includes("build")) {
  await builder.build();
} else {
  await builder.listen(() => import("./main.ts"), { 
    port, 
    hostname: "0.0.0.0" 
  });
}