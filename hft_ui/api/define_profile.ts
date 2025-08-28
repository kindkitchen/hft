import { Effect } from "effect";
import { Elysia } from "elysia";
import { URL_elysia_plugin } from "../util/URL_elysia_plugin.ts";
import { has_session_id_guard } from "./guard/has_session_id_guard.ts";

export const define_profile = Effect.gen(function* () {
  return new Elysia()
    .use(URL_elysia_plugin())
    .use(has_session_id_guard)
    .post("/gen-pub-key", () => {
      return "TODO: is not implemented yet!";
    });
});
