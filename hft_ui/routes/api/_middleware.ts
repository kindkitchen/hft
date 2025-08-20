import { define } from "../../utils.ts";

export const handler = define.middleware(async (ctx) => {
  const res = await ctx.next();
  if (
    ![
      "/api/auth/sign-in/google",
    ].includes(ctx.url.pathname)
  ) {
    res.headers.append("content-type", "application/json");
  }

  return res;
});
