import { createDefine } from "fresh";
import { Session } from "./domain/Session.ts";

export interface State {
  session: null | Session;
}

export const define = createDefine<State>();
