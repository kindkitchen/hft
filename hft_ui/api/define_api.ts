import { swagger } from "@elysiajs/swagger";
import { Effect } from "effect";
import { Elysia } from "elysia";
import { define_auth } from "./define_auth.ts";
import { version } from "../utils.ts";
import { URL_elysia_plugin } from "../util/URL_elysia_plugin.ts";
import * as Yaml from "@std/yaml";

export const define_api = (options: {
  prefix: string;
  swagger_path?: string;
}) =>
  Effect.gen(function* () {
    const auth = yield* define_auth;
    const {
      prefix,
      swagger_path: path,
    } = options;

    return new Elysia({
      prefix,
    })
      .use(URL_elysia_plugin())
      .use(swagger({
        path,
        documentation: {
          info: { title: "hft API", version },
          externalDocs: {
            url: "/",
            description: "UI",
          },
        },
      }))
      .get("/swagger/yaml", async ({ url }) => {
        const json = await fetch(`${url.origin}/api/swagger/json`)
          .then((r) => r.json());

        const yaml_str = Yaml.stringify(json);

        return new Response(yaml_str, {
          headers: {
            "content-type": "text/yaml",
          },
        });
      })
      .use(new Elysia({ prefix: "/auth" }).use(auth));
  });
