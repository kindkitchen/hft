import { define } from "../utils.ts";

export default define.layout(({ Component, state }) => {
  return (
    <>
      {state.session
        ? (
          <div class="flex flex-row-reverse pr-4">
            <a href="/api/auth/logout">Logout</a>
          </div>
        )
        : (
          <div>
            <a href="/api/auth/sign-in/google">Login</a>
          </div>
        )}
      <Component />
    </>
  );
});
