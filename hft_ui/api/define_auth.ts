import { setCookie } from "@std/http";
import { Effect } from "effect";
import { Elysia, t } from "elysia";
import { Session_tag } from "../domain/Session.ts";
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
      detail: {
        responses: {
          200: {
            description:
              "If present - return Session, associated with user, otherwise - empty object",
          },
        },
      },
      response: {
        200: t.Object({
          iam: t.Optional(t.Object({
            _tag: t.Literal(Session_tag),
            _id: t.String(),
            email: t.String(),
          })),
        }),
      },
    })
    .get("/sign-in/google", async ({ redirect }) => {
      const state = crypto.randomUUID();
      await db.save_session_state(state);
      const sign_in_url = await generate_sign_in_url({
        state,
        scope: ["email"],
      });

      return redirect(sign_in_url);
    }, {
      detail: {
        hide: true,
      },
    })
    .get(
      "/google-callback",
      async ({ query, url, cookie, set, status }) => {
        set.headers.location = "/";

        const res = status(302, "Redirect back to UI");

        if (!query.state) {
          console.warn("query[state] is missing");

          return res;
        }

        const saved = await db.has_session_state(query.state);

        if (!saved) {
          console.warn("<state> is not identified");

          return res;
        }

        const _result = await parse_code_in_cb(query)
          .pipe(
            Effect.map(async ({ info, payload: _p }) => {
              const session = await db.create_session(info.email);

              cookie.session.set({
                value: session._id,
                sameSite: "lax",
                domain: url.hostname,
                path: "/",
                httpOnly: true,
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

        return res;
      },
      {
        response: {
          302: t.String(),
        },
        detail: {
          responses: {
            302: {
              description: "Redirect user back to application.",
            },
          },
        },
      },
    )
    .get("/logout", ({ cookie, status }) => {
      cookie.session.remove();

      return status(204, undefined);
    }, {
      response: {
        204: t.Void(),
      },
      mapResponse: /// TODO: check!
        /// Does Elysia solve the problem with really empty body, when `status(204, undefined)`?
        /// because now, the `mapResponse` is aka fix for this problem
        /// (there are any logic, related to application)
        ({ set }) => {
          if (set.status !== 204) return;
          const headers = new Headers(
            Object.fromEntries(
              Object.entries(set.headers).filter(([, v]) => !!v),
            ) as Record<string, string>,
          );

          if (set.cookie) {
            for (const [name, cookie] of Object.entries(set.cookie)) {
              const {
                value,
                sameSite,
                ...rest
              } = cookie;
              if (value) {
                setCookie(headers, {
                  name,
                  ...rest,
                  value: value as string,
                  ...(!!sameSite &&
                    {
                      sameSite: sameSite === "lax"
                        ? "Lax"
                        : sameSite === "none"
                        ? "None"
                        : "Strict",
                    }),
                });
              }
            }
          }

          return new Response(null, {
            status: 204,
            headers,
          });
        },
      detail: {
        responses: {
          204: { description: "Remove session from cookies" },
        },
      },
    });
});
