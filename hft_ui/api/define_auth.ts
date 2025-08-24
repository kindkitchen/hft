import { deleteCookie, setCookie } from "@std/http";
import { Effect } from "effect";
import { Elysia, t } from "elysia";
import { Service_google_oauth20 } from "../google_oauth2.0/Service.ts";
import { URL_elysia_plugin } from "../util/URL_elysia_plugin.ts";
import { db } from "./database/db.ts";

export const define_auth = Effect.gen(function* () {
  const { generate_sign_in_url, parse_code_in_cb } =
    yield* Service_google_oauth20;

  return new Elysia()
    .use(URL_elysia_plugin())
    .get("/whoami", async ({ cookie }) => {
      const session = cookie.session;
      if (!session.value) {
        return {};
      }
      const iam = await db.session_by_id(session.value);
      if (!iam) {
        return {};
      }

      return {
        iam,
      };
    }, {
      response: t.Object({
        iam: t.Optional(t.Any()),
      }),
    })
    .get("/sign-in/google", async ({ redirect }) => {
      const state = crypto.randomUUID();
      await db.save_session_state(state);
      const sign_in_url = await generate_sign_in_url({
        state,
        scope: ["email"],
      });

      return redirect(sign_in_url);
    })
    .get(
      "/google-callback",
      async ({ query, url, request }) => {
        const headers = new Headers(request.headers);
        headers.set("location", "/");

        const res = new Response(null, {
          headers,
          status: 302,
        });

        if (!query.state) {
          console.warn("query[state] is missing");

          return res;
        }

        const saved = await db.has_session_state(query.state);

        console.log(saved);

        if (!saved) {
          console.warn("<state> is not identified");

          return res;
        }

        const _result = await parse_code_in_cb(query)
          .pipe(
            Effect.map(async ({ info, payload: _p }) => {
              const session = await db.create_session(info.email);

              setCookie(headers, {
                name: "session",
                value: session._id,
                sameSite: "Lax",
                domain: url.hostname,
                path: "/",
                // httpOnly: true,
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

        return new Response(null, {
          headers,
          status: 302,
        });
      },
    )
    .get("/logout", ({ url, request, cookie }) => {
      const headers = new Headers(request.headers);

      if (cookie.session.value) {
        deleteCookie(headers, "session", {
          path: "/",
          domain: url.hostname,
        });
      }

      headers.set("location", "/");

      return new Response(null, {
        headers,
        status: 302,
      });
    });
});
