import { defineConfig } from "@hey-api/openapi-ts";

const clients = {
  // synced objects (ws-sync)
  "http://localhost:8000/ws-sync/BackendState/openapi.json": "src/sync-client",
};

export default defineConfig({
  input: Object.keys(clients),
  output: Object.values(clients).map((output) => ({
    path: output,
    format: "prettier",
    lint: "eslint",
  })),
  plugins: [
    {
      name: "@hey-api/typescript",
      case: "preserve", // preserve the original case of the types
      enums: { mode: "javascript", case: "camelCase" }, // create enums as javascript objects
      exportFromIndex: false, // don't create index file
    },
    { name: "zod", case: "preserve" },
    {
      name: "@hey-api/schemas",
      type: "json",
    },
  ],
});
