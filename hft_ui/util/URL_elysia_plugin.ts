import { Elysia } from "elysia";

const plugin = new Elysia({ name: "URL_elysia_plugin" })
  .derive(({ request: { url } }) => ({
    url: new URL(url),
  }))
  .as("scoped");

export const URL_elysia_plugin = () => plugin;
