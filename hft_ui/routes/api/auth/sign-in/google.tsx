import { Effect, Layer } from "effect";
import { Service_google_oauth20 } from "../../../../google_oauth2.0/Service.ts";
import { define } from "../../../../utils.ts";

const logic = Effect.gen(function* () {
  const { generate_sign_in_url } = yield* Service_google_oauth20;

  return define.handlers({
    async GET(ctx) {
      const sign_in_url = await generate_sign_in_url({
        state: "TODO: " + Date.now(),
        scope: ["openid"],
      });

      return ctx.redirect(sign_in_url);
    },
  });
});
const requirements = Effect.provide(
  Layer.mergeAll(Service_google_oauth20.Default),
);
const program = logic.pipe(requirements);
export const handler = await Effect.runPromise(program);
