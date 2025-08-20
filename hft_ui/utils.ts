import { createDefine } from "fresh";
import { Session } from "./domain/Session.ts";
import { MarkRequired } from "./util/utility_types.ts";

export interface State {
  session: null | Session;
}

export const define = createDefine<State>();
export const define_with_session = createDefine<
  MarkRequired<State, "session">
>();
