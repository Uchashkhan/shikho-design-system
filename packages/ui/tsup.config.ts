import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  // Not `clean: true` — that runs on every watch rebuild, not just the first, and wipes the
  // whole dist/ directory including dist/styles.css (owned by the separate `build:css`/tailwind
  // watcher below, not tsup). The two watchers raced: tsup deleted the file on each JS rebuild,
  // and tailwind's watcher only reacts to its own input changing, so it never noticed and never
  // restored it. `pnpm build` does its own `rm -rf dist` up front instead, so a full clean still
  // happens for real production builds.
  clean: false,
  sourcemap: true,
  external: ["react", "react-dom"],
});
