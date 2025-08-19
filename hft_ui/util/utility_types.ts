// deno-lint-ignore-file no-explicit-any
export type Tail<T extends any[]> = T extends [infer _first, ...infer Rest]
  ? Rest
  : never;
export type OmitStrict<
  T extends Record<string, any>,
  K extends keyof T,
> = Omit<T, K> & Partial<Record<K, never>>;
export type OmitReplace<
  T extends Record<string, any>,
  U extends Partial<Record<keyof T, any>>,
> = Omit<T, keyof U> & U;

export type AddOrReplace<
  T extends Record<string, any>,
  U extends Record<string, any>,
> = Omit<T, keyof U> & U;

export type MarkRequired<T extends Record<string, any>, K extends keyof T> =
  & Omit<T, K>
  & Required<
    {
      [Key in K]: T[Key];
    }
  >;

export type MarkOptional<T extends Record<string, any>, K extends keyof T> =
  & Omit<T, K>
  & Partial<
    {
      [Key in K]: T[Key];
    }
  >;
