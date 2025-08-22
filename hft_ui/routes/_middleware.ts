import { deleteCookie, getCookies } from "@std/http";
import { Session } from "../domain/Session.ts";
import { define } from "../utils.ts";

export const handler = define.middleware(async function AttachSession(ctx) {
  ctx.state.session = null;

  const sessionCookies = getCookies(ctx.req.headers).session || null;

  if (sessionCookies) {
    try {
      const data = new URLSearchParams(sessionCookies).entries().reduce(
        (acc, [k, v]) => {
          acc[k] = v;

          return acc;
        },
        {} as Record<string, unknown>,
      );
      ctx.state.session = Session(data as any);
    } catch {
      console.warn("Incorrect data in session cookies!");
      deleteCookie(ctx.req.headers, "session");
    }
  }

  return await ctx.next();
});
