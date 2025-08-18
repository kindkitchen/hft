#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { tailwind } from "@fresh/plugin-tailwind";

import { Builder } from "fresh/dev";

const builder = new Builder();
tailwind(builder);
if (Deno.args.includes("build")) {
  await builder.build();
} else {
  const PORT = Number(Deno.env.get("PORT"));
  const options = {
    ...(Number.isInteger(PORT) && { port: PORT }),
  };
  await builder.listen(() => import("./main.ts"), options);
}
