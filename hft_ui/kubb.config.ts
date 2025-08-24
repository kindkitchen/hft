import { defineConfig } from "@kubb/core";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginOas } from "@kubb/plugin-oas";

export default defineConfig(() => {
  return {
    name: "hft API artifacts",
    root: ".",
    input: {
      path: "./openapi.yaml",
    },
    output: {
      path: "./openapi",
    },
    plugins: [
      pluginOas(),
      pluginTs(),
    ],
  };
});
