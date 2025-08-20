import { gen_auth_guard } from "../../../utils.ts";

export const handler = gen_auth_guard(
  "Without session generation of the public keys are not allowed",
);
