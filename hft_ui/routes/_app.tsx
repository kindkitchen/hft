import { define } from "../utils.ts";

export default define.page(function App({ Component, state }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>hft</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        {state.session
          ? (
            <div>
              <a href="/api/auth/logout">Logout</a>
            </div>
          )
          : (
            <div>
              <a href="/api/auth/sign-in/google">Login</a>
            </div>
          )}
        <Component />
      </body>
    </html>
  );
});
