import { SECOND } from "@std/datetime";
import { Effect, Layer } from "effect";
import { define_with_session } from "./utils.ts";
import { toy_db } from "./toy_db.ts";

const logic = Effect.gen(function* () {
  yield* Effect.succeed("TODO");
  return define_with_session.handlers({
    async GET(ctx) {
      const { privateKey, publicKey } = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: "SHA-256" },
        },
        true,
        ["encrypt", "decrypt"],
      );
      const public_key_to_export = await crypto.subtle.exportKey(
        "jwk",
        publicKey,
      );
      const id = await toy_db.save<
        {
          privateKey: CryptoKey;
          publicKey: JsonWebKey;
          id: string;
        }
      >(
        "encrypt",
        [
          {
            publicKey,
            privateKey,
          },
        ],
        "id",
        { ttl: SECOND * 10 },
      );

      return new Response(
        JSON.stringify(
          {
            public_key: public_key_to_export,
            id,
          },
          null,
          0,
        ),
        {
          status: 200,
        },
      );
    },
  });
});

const requirements = Effect.provide(Layer.mergeAll(Layer.empty));
const program = logic.pipe(requirements);
export const handler = await Effect.runPromise(program);
