import { Elysia } from "elysia";

export const has_session_id_guard = new Elysia({
  name: "active_session_guard",
})
  .guard({
    beforeHandle: ({ cookie, status }) => {
      if (!cookie.session.value) {
        throw status(403, "Forbidden");
      }
    },
  })
  .as("scoped");
