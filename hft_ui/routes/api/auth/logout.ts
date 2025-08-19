import { deleteCookie } from "@std/http/cookie";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const headers = new Headers(ctx.req.headers);

    if (ctx.state.session) {
      deleteCookie(headers, "session", { path: "/", domain: ctx.url.hostname });
    }

    headers.set("location", "/");

    return new Response(null, {
      headers,
      status: 302,
    });
  },
});
