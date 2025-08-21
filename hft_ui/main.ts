import { load } from "@std/dotenv";
import { Elysia } from "elysia";
import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";

await load({ export: true });

const api = new Elysia();
export const app = new App<State>()
  .all("/api/*", async (ctx) => {
    console.log("/api");
    const res = await api.fetch(ctx.req);

    return res;
  })
  .use(staticFiles())
  .fsRoutes();
