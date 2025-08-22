import { load } from "@std/dotenv";
import { App, staticFiles } from "fresh";
import { init_api } from "./api/main.ts";
import { type State } from "./utils.ts";

await load({ export: true });
const api = await init_api({ prefix: "/api" });

export const app = new App<State>()
  .use(({ req, next, url }) =>
    url.pathname.startsWith("/api/") ? api.fetch(req) : next()
  )
  .use(staticFiles())
  .fsRoutes();
