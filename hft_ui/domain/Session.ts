import { Data } from "effect";

export const Session_tag = "Session" as const;
export type Session = {
  _tag: typeof Session_tag;
  _id: string;
  email: string;
};
export const Session = Data.tagged<Session>(Session_tag);
