import { Config, Effect } from "effect";
import { OAuth2Client } from "google-auth-library";
import {
  Err_client_getToken,
  Err_client_getTokenInfo,
  Err_no_access_token_in_get_token_response,
} from "./err.ts";

export class Service_google_oauth20
  extends Effect.Service<Service_google_oauth20>()("@Service_google_oauth20", {
    effect: Effect.gen(function* () {
      const clientId = yield* Config.string("GOOGLE_OAUTH_CLIENT_ID");
      const clientSecret = yield* Config.string("GOOGLE_OAUTH_CLIENT_SECRET");
      const API_HOST = yield* Config.string("API_HOST");
      const GOOGLE_OAUTH_CALLBACK_ENDPOINT = yield* Config.string(
        "GOOGLE_OAUTH_CALLBACK_ENDPOINT",
      )
        .pipe(Config.withDefault("/api/auth/google-callback"));
      const redirectUri = `${API_HOST}${GOOGLE_OAUTH_CALLBACK_ENDPOINT}`;
      const google_oauth2_client = new OAuth2Client({
        clientId,
        clientSecret,
        redirectUri,
      });

      return {
        _google_oauth2_client: google_oauth2_client,
        generate_sign_in_url: (
          params: {
            scope: string[];
            state: string;
            login_hint?: string;
            include_granted_scopes?: boolean;
            access_type?: "offline";
          },
        ) => {
          const uri = google_oauth2_client.generateAuthUrl({
            include_granted_scopes: true,
            prompt: "consent",
            ...params,
          });

          return uri;
        },
        parse_code_in_cb: (code: string) =>
          Effect.gen(function* () {
            const payload = yield* Effect.tryPromise({
              try: () =>
                google_oauth2_client
                  .getToken(code),
              catch: (err) =>
                new Err_client_getToken({
                  err,
                  scope: "google_oauth2.0",
                }),
            });

            if (!payload.tokens.access_token) {
              yield* Effect.fail(
                new Err_no_access_token_in_get_token_response({
                  scope: "google_oauth2.0",
                }),
              );
            }

            const info = yield* Effect.tryPromise({
              try: () =>
                google_oauth2_client.getTokenInfo(
                  payload.tokens.access_token!,
                ),
              catch: (err) =>
                new Err_client_getTokenInfo({
                  err,
                  scope: "google_oauth2.0",
                }),
            });

            return {
              payload,
              info,
            };
          }),
      };
    }),
  }) {}
