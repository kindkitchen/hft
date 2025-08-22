import { createDefine } from "fresh";
import { Session } from "./domain/Session.ts";
import { MarkRequired } from "./util/utility_types.ts";
import deno_json from "./deno.json" with { type: "json" };
export const version = deno_json.version;
export interface State {
  session: null | Session;
}

export const define = createDefine<State>();
export const define_with_session = createDefine<
  MarkRequired<State, "session">
>();

export const gen_auth_guard = (details = "The session is missing") =>
  define.middleware((ctx) => {
    if (!ctx.state.session) {
      return new Response(
        JSON.stringify(
          {
            error: "Unauthorized",
            details,
          },
          null,
          0,
        ),
        { status: 403 },
      );
    }

    return ctx.next();
  });
