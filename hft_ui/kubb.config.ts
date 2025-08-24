import { defineConfig } from "@kubb/core";

export default defineConfig(() => {
  return {
    root: ".",
    input: {
      path: "./openapi.json",
    },
    output: {
      path: "./openapi",
    },
    plugins: [],
  };
});
