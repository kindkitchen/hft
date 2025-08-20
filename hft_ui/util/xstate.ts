// deno-lint-ignore-file no-explicit-any require-await
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Effect } from "effect";
import { fromPromise } from "xstate";

export function unary_to_promise_logic<
  T extends (arg: any) => Promise<any>,
>(fn: T) {
  return fromPromise<Awaited<ReturnType<T>>, Parameters<T>[0]>(
    async ({ input }) => {
      return fn(input);
    },
  );
}

export function fn_to_promise_logic<
  T extends (...arg: any[]) => Promise<any>,
>(fn: T) {
  return fromPromise<Awaited<ReturnType<T>>, Parameters<T>>(
    async ({ input }) => {
      return fn(...input);
    },
  );
}

export function effect_to_promise_logic<
  T extends (...arg: any[]) => Effect.Effect<any, any>,
>(fn: T) {
  return {
    logic: fromPromise<
      Effect.Effect.Success<ReturnType<T>>,
      { args: Parameters<T> }
    >(
      ({ input: { args } }) => {
        const effect = fn(args);
        return Effect.runPromise(effect);
      },
    ),
    error_to_effect_exception: (error: unknown) => {
      return error as Effect.Effect.Error<ReturnType<T>>;
    },
  };
}
