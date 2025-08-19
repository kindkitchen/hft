import { setCookie } from "@std/http";
import { Effect, Layer } from "effect";
import { db } from "../../../db.ts";
import { Service_google_oauth20 } from "../../../google_oauth2.0/Service.ts";
import { define } from "../../../utils.ts";

const logic = Effect.gen(function* () {
  const { parse_code_in_cb } = yield* Service_google_oauth20;

  return define.handlers({
    async GET(ctx) {
      const url = new URL(ctx.req.url);
      const headers = new Headers();
      const result = await parse_code_in_cb(
        Object.fromEntries(url.searchParams)["code"],
      )
        .pipe(
          Effect.map(async ({ info, payload: _p }) => {
            const session = await db.create_session(info.email);
            setCookie(headers, {
              name: "session",
              value: new URLSearchParams(session).toString(),
              sameSite: "Lax",
              domain: url.hostname,
              path: "/",
              secure: true,
            });

            return "success";
          }),
          Effect.tapError((err) =>
            Effect.sync(() => {
              console.warn("Fail to process google cb data:");
              console.warn(err);
            })
          ),
          Effect.orElse(() => Effect.succeed("fail")),
          Effect.runPromise,
        );

      headers.set("location", "/?" + result);

      return new Response(null, {
        status: 303,
        headers,
      });
    },
  });
});
const requirements = Effect.provide(
  Layer.mergeAll(Service_google_oauth20.Default),
);
const program = logic.pipe(requirements);
export const handler = await Effect.runPromise(program);
