import { Data } from "effect";

type Scope = "google_oauth2.0";
export class Err_client_getToken
  extends Data.TaggedError("@Err_client_getToken")<
    { err: unknown; scope: Scope }
  > {}

export class Err_no_access_token_in_get_token_response
  extends Data.TaggedError("@Err_no_access_token_in_get_token_response")<{
    scope: Scope;
  }> {}

export class Err_client_getTokenInfo
  extends Data.TaggedError("@Err_client_getTokenInfo")<{
    err: unknown;
    scope: Scope;
  }> {
}
