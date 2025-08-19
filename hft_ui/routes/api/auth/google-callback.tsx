import { Effect, Layer } from "effect";
import { Service_google_oauth20 } from "../../../google_oauth2.0/Service.ts";
import { define } from "../../../utils.ts";

const logic = Effect.gen(function* () {
  const { parse_code_in_cb } = yield* Service_google_oauth20;

  return define.handlers({
    async GET(ctx) {
      const result = await parse_code_in_cb(
        Object.fromEntries(new URL(ctx.req.url).searchParams)["code"] || "",
      )
        .pipe(
          Effect.map(({ info, payload }) => {
            console.log(info);
            console.log(payload);

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

      return ctx.redirect("/?" + result);
    },
  });
});
const requirements = Effect.provide(
  Layer.mergeAll(Service_google_oauth20.Default),
);
const program = logic.pipe(requirements);
export const handler = await Effect.runPromise(program);
