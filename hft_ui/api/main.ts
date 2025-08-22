import { Effect } from "effect";
import { Service_google_oauth20 } from "../google_oauth2.0/Service.ts";
import { define_api } from "./define_api.ts";

type InitApi = typeof define_api;
type ApiRequirements = Effect.Effect.Context<ReturnType<InitApi>>;
export const init_api = (...params: Parameters<InitApi>) =>
  define_api(...params).pipe(
    Effect.provide(Service_google_oauth20.Default),
    Effect.runPromise,
  );
