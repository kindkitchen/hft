import { deleteCookie, setCookie } from "@std/http";
import { Effect } from "effect";
import { Elysia, t } from "elysia";
import { Session } from "../domain/Session.ts";
import { Service_google_oauth20 } from "../google_oauth2.0/Service.ts";
import { URL_elysia_plugin } from "../util/URL_elysia_plugin.ts";

export const define_auth = Effect.gen(function* () {
  const { generate_sign_in_url, parse_code_in_cb } =
    yield* Service_google_oauth20;

  return new Elysia()
    .use(URL_elysia_plugin())
    .get("/sign-in/google", async ({ redirect, query: { state } }) => {
      const sign_in_url = await generate_sign_in_url({
        state,
        scope: ["email"],
      });

      return redirect(sign_in_url);
    }, {
      query: t.Object({
        state: t.String(),
      }),
    })
    .get(
      "/google-callback",
      async ({ query, url, request }) => {
        const headers = new Headers(request.headers);
        const _result = await parse_code_in_cb(query)
          .pipe(
            Effect.map(async ({ info, payload: _p }) => {
              /// create session
              const session = Session({
                email: info.email,
                _id: crypto.randomUUID(),
              });

              /// update session for client
              setCookie(headers, {
                name: "session",
                value: session._id,
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
        headers.set("location", "/");

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
