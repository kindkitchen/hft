import { createDefine } from "fresh";

export interface State {
  session: null | {
    email: string;
  };
}

export const define = createDefine<State>();
