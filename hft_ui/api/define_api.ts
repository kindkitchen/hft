import { swagger } from "@elysiajs/swagger";
import * as Yaml from "@std/yaml";
import { Effect } from "effect";
import { Elysia } from "elysia";
import { URL_elysia_plugin } from "../util/URL_elysia_plugin.ts";
import { version } from "../utils.ts";
import { define_auth } from "./define_auth.ts";
import { define_profile } from "./define_profile.ts";

export const define_api = (options: {
  prefix: string;
  swagger_path?: string;
}) =>
  Effect.gen(function* () {
    const auth = yield* define_auth;
    const profile = yield* define_profile;
    const {
      prefix,
    } = options;

    const api = new Elysia({
      prefix,
    })
      .use(URL_elysia_plugin())
      .use(swagger({
        documentation: {
          info: { title: "hft API", version },
          externalDocs: {
            url: "/",
            description: "UI",
          },
        },
      }))
      .get("/swagger/yaml", async ({ url }) => {
        const json = await api.handle(
          new Request(`${url.origin}${prefix}/swagger/json`),
        ).then((r) => r.json());

        return Yaml.stringify(json);
      }, {
        detail: {
          hide: true,
        },
      })
      .use(new Elysia({ prefix: "/auth" }).use(auth))
      .use(new Elysia({ prefix: "/profile" }).use(profile));

    return api;
  });
