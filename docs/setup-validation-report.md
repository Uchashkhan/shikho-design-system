# Setup Validation Report — Monorepo Foundation

This report documents the scaffolding of the pnpm/Turborepo monorepo foundation described in `docs/npm-design-system-implementation-plan.md`. No real tokens, components, or Figma-derived styles were added — this is tooling and package-boundary scaffolding only.

---

## 1. Files and Folders Created

### Root configuration
- `package.json` — root manifest, workspace scripts, shared devDependencies
- `pnpm-workspace.yaml` — workspace globs (`packages/*`, `apps/*`)
- `turbo.json` — Turborepo task graph (`build`, `dev`, `typecheck`, `test`, `lint`, `storybook`)
- `tsconfig.base.json` — shared TypeScript compiler options, extended by every package
- `.gitignore`, `.npmrc`, `.prettierrc.json`, `.prettierignore`, `eslint.config.js`
- `.changeset/config.json`, `.changeset/README.md` — Changesets initialized

### `packages/tokens`
- `package.json`, `tsconfig.json`, `tsup.config.ts`, `README.md`
- `src/index.ts` — placeholder `DesignTokens` shape (empty category objects: color, typography, elevation, radius, spacing)
- `src/index.test.ts` — Vitest smoke test asserting the placeholder shape

### `packages/icons`
- `package.json`, `tsconfig.json`, `tsup.config.ts`, `README.md`
- `src/types.ts` — `IconProps`/`IconSize` types (size scale 14–28px, per the audit's `sizing/icon/*` findings), imports `@shikho/tokens` to keep the dependency real
- `src/index.ts` — re-exports the types only (no glyphs — see constraints)
- `src/index.test.ts` — Vitest smoke test

### `packages/ui`
- `package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`, `vitest.setup.ts`, `README.md`
- `src/styles.css` — Tailwind v4 entry point (`@import "tailwindcss";` only, no theme values yet)
- `src/Placeholder.tsx` — a single non-design placeholder component proving the `tokens → icons → ui` build chain (uses `clsx`, `tailwind-variants`, and typed references to both `@shikho/tokens` and `@shikho/icons`)
- `src/index.ts` — exports `Placeholder`
- `src/Placeholder.test.tsx` — React Testing Library render test
- `src/vitest.d.ts` — pulls in `@testing-library/jest-dom` matcher types for `tsc --noEmit`

### `apps/storybook`
- `package.json`, `tsconfig.json`
- `.storybook/main.ts` — Storybook 8 + Vite framework config, telemetry disabled
- `.storybook/preview.ts` — imports `@shikho/ui/styles.css`
- `src/Placeholder.stories.tsx` — one story documenting the placeholder component

### Documentation
- `docs/npm-design-system-implementation-plan.md` — read, not modified (pre-existing from prior turn)
- `docs/setup-validation-report.md` — this file

**Not touched:** every file in `docs/audit/` and `docs/design-system-audit-summary.md` — verified via `git status --porcelain` before and after (no changes reported).

---

## 2. Main Dependencies Installed

| Category | Packages |
|---|---|
| Workspace/build orchestration | `turbo`, `typescript`, `@changesets/cli` |
| Lint/format | `eslint`, `@eslint/js`, `typescript-eslint`, `prettier` |
| Package build | `tsup` (tokens, icons, ui) |
| Styling | `tailwindcss` v4, `@tailwindcss/cli`, `tailwind-variants`, `clsx` (ui only) |
| Testing | `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` (ui); `vitest` alone (tokens, icons) |
| Storybook | `storybook`, `@storybook/react`, `@storybook/react-vite`, `@storybook/addon-essentials`, `vite` |
| Framework peers | `react`, `react-dom` (peer in icons/ui; dev+direct dep in the storybook app) |

Total installed: 650 resolved packages, ~272MB in `node_modules` (expected for a Storybook + Vite + Tailwind v4 toolchain).

---

## 3. Commands Executed

```
corepack enable                          # failed: EACCES on this machine (see §4)
corepack prepare pnpm@9 --activate       # failed: same EACCES
npm install -g pnpm                      # failed: EACCES (no write access to /usr/local/lib/node_modules)
npx --yes pnpm@9 install                 # succeeded — used for all subsequent commands
npx --yes pnpm@9 build                   # turbo run build
npx --yes pnpm@9 typecheck               # turbo run typecheck
npx --yes pnpm@9 test                    # turbo run test
npx --yes pnpm@9 lint                    # turbo run lint
npx --yes pnpm@9 exec changeset status --verbose
storybook dev -p 6006 --no-open --quiet  # started, verified HTTP 200, then killed
```

All commands were run with `CI=true` to suppress Storybook's interactive telemetry prompt (non-interactive shell).

---

## 4. Validation Results

| Requirement | Status | Notes |
|---|---|---|
| 1. Repository installs with pnpm | ✅ Pass | via `npx pnpm@9 install` (see warning below re: global `pnpm` binary) |
| 2. Workspace packages resolve correctly | ✅ Pass | `@shikho/tokens`, `@shikho/icons`, `@shikho/ui` all resolve as `workspace:*` across dependents; verified via successful build/typecheck of dependent packages |
| 3. Each package has a minimal valid entry point | ✅ Pass | `tokens`, `icons`, `ui` each build ESM+CJS+`.d.ts` via tsup; `ui` additionally emits `dist/styles.css` |
| 4. Storybook starts successfully | ✅ Pass | `storybook dev` on port 6006 returned HTTP 200; also verified `storybook build` succeeds (static export to `storybook-static/`) |
| 5. Build pipeline runs successfully | ✅ Pass | `turbo run build` — 4/4 packages succeed, correct dependency order (`tokens` → `icons` → `ui` → `storybook`) |
| 6. Type checking runs successfully | ✅ Pass | `turbo run typecheck` — 4/4 packages succeed (0 errors) |
| 7. Testing infrastructure configured | ✅ Pass | Vitest configured in all 3 library packages; 3/3 test files pass (1 test each); storybook app has a no-op `test` script since it holds no unit tests itself |
| 8. Changesets initialized | ✅ Pass | `.changeset/config.json` present, `changeset status` runs cleanly, `@shikho/storybook` excluded from versioning via `ignore` |
| 9. Root scripts (dev/build/typecheck/test/lint/storybook/changeset) | ✅ Pass | All present in root `package.json`, all exercised above except `dev` (persistent watch mode — not run to completion, by design) |

---

## 5. Warnings and Unresolved Issues

- **`pnpm` is not installed globally on this machine.** Both `corepack enable` and `npm install -g pnpm` failed with `EACCES` (no write permission on `/usr/local/lib/node_modules` / `/usr/local/bin` without sudo). I did not run a `sudo` command to fix this, since that's a system-level change outside this task's scope. All commands in this session used `npx --yes pnpm@9 <command>` as a workaround, which works correctly but is slower (re-resolves the pnpm CLI each invocation) and diverges from the `packageManager: "pnpm@9.15.9"` field in `package.json` (which expects a real corepack-managed `pnpm` on `PATH`). **Action needed from you:** either grant write access to `/usr/local` for global npm installs, or run `corepack enable`/`npm install -g pnpm` yourself with elevated privileges, so `pnpm <command>` works directly.
- **`@storybook/addon-essentials@8.6.14` vs. core `8.6.18` version mismatch warning** — cosmetic, Storybook still builds and runs correctly; will self-resolve once dependency ranges are next bumped.
- **Large Storybook doc-renderer chunk (~884KB)** — a Vite build-size warning from Storybook's own `DocsRenderer` bundle, not from any project code (the project currently has one placeholder component). Not actionable at this stage.
- **Deprecated transitive subdependencies** (`glob@10.5.0`, `uuid@9.0.1`, `whatwg-encoding@3.1.1`) reported by pnpm — pulled in transitively by Storybook/Vite tooling, not a direct or actionable dependency choice here.
- **No ESLint React/JSX/hooks plugin configured yet** — the current `eslint.config.js` only wires up `@eslint/js` + `typescript-eslint` (JS/TS correctness), matching "avoid unnecessary dependencies" for a foundation with exactly one throwaway placeholder component. Once real `ui` components exist, add `eslint-plugin-react-hooks` and `eslint-plugin-jsx-a11y` per the plan's testing strategy (§9, accessibility gate).
- **No CI workflow file created** — the plan (§10.4) describes a GitHub Actions pipeline, but no `.github/workflows/` file was requested or added in this task; scripts are ready to be wired into one when asked.
- **TypeScript project references were scoped back from the original plan.** The initial `tsconfig.base.json` set `composite: true` for full project-reference builds (`tsc --build`), but this collided with `tsup`'s DTS generation (`tsup` couldn't resolve a file not explicitly listed under a composite project's `include`, throwing `TS6307`). Resolved by dropping `composite`/`declarationMap` from the shared base and each package's `references` field; typechecking now runs as independent `tsc --noEmit` per package (still correct and passing), at the cost of not having a single `tsc --build` command that respects the whole graph. This is a reasonable v0 tradeoff, not a blocker.

---

## 6. Exact Next Recommended Task

**Phase 1 — Token normalization**, per `docs/npm-design-system-implementation-plan.md` §0 and §11: produce the raw-Figma-name → canonical-token-name mapping doc (radius collisions, alpha/opacity convention, the `focus_danger` binding fix, and the single selection-state vocabulary decision for Checkbox/Radio/Toggle/Chip). This mapping doc — not code — is the explicit prerequisite the audit itself calls out before any real values are written into `packages/tokens`.
