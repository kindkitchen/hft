import { swagger } from "@elysiajs/swagger";
import { Effect } from "effect";
import { Elysia } from "elysia";
import { define_auth } from "./define_auth.ts";
import { version } from "../utils.ts";
import { URL_elysia_plugin } from "../util/URL_elysia_plugin.ts";

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
      .use(new Elysia({ prefix: "/auth" }).use(auth));
  });
