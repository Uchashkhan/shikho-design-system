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

- ~~`pnpm` is not installed globally on this machine.~~ **Resolved** — `brew install pnpm` was run in a later session; Homebrew's pnpm respects the `packageManager: "pnpm@9.15.9"` field automatically, so `pnpm <command>` now works directly on `PATH` without the `npx pnpm@9` workaround. All commands in §7 below use the real `pnpm` binary.
- **`@storybook/addon-essentials@8.6.14` vs. core `8.6.18` version mismatch warning** — cosmetic, Storybook still builds and runs correctly; will self-resolve once dependency ranges are next bumped.
- **Large Storybook doc-renderer chunk (~884KB)** — a Vite build-size warning from Storybook's own `DocsRenderer` bundle, not from any project code (the project currently has one placeholder component). Not actionable at this stage.
- **Deprecated transitive subdependencies** (`glob@10.5.0`, `uuid@9.0.1`, `whatwg-encoding@3.1.1`) reported by pnpm — pulled in transitively by Storybook/Vite tooling, not a direct or actionable dependency choice here.
- **No ESLint React/JSX/hooks plugin configured yet** — the current `eslint.config.js` only wires up `@eslint/js` + `typescript-eslint` (JS/TS correctness), matching "avoid unnecessary dependencies" for a foundation with exactly one throwaway placeholder component. Once real `ui` components exist, add `eslint-plugin-react-hooks` and `eslint-plugin-jsx-a11y` per the plan's testing strategy (§9, accessibility gate).
- **No CI workflow file created** — the plan (§10.4) describes a GitHub Actions pipeline, but no `.github/workflows/` file was requested or added in this task; scripts are ready to be wired into one when asked.
- **TypeScript project references were scoped back from the original plan.** The initial `tsconfig.base.json` set `composite: true` for full project-reference builds (`tsc --build`), but this collided with `tsup`'s DTS generation (`tsup` couldn't resolve a file not explicitly listed under a composite project's `include`, throwing `TS6307`). Resolved by dropping `composite`/`declarationMap` from the shared base and each package's `references` field; typechecking now runs as independent `tsc --noEmit` per package (still correct and passing), at the cost of not having a single `tsc --build` command that respects the whole graph. This is a reasonable v0 tradeoff, not a blocker.

---

## 6. Phase 1 status

**Complete.** `docs/token-normalization-decisions.md` was produced, approved (in part), and is now implemented — see §7.

---

## 7. Token Package v0.1 Implementation (`@shikho/tokens` color / radius / elevation)

This round implements the first production-usable slice of `@shikho/tokens`, per the approved decisions in `docs/token-normalization-decisions.md`: color, radius, and elevation only, plus the approved `focus.danger` fix. Selection-vocabulary unification, black/white opacity renaming, and alpha-convention consolidation remain explicitly deferred.

### Files created or modified

**Created:**
- `packages/tokens/src/color.ts` — 11 confirmed color ramps (`primary`, `secondary`, `shikhoAi`, `secondary2`, `info`, `success`, `danger`, `warning`, `gray`, `vanillaGray`, `dark`), the 12-step `black`/`white` opacity ramps, and `focusRingColor` (5 focus-ring colors, `danger` corrected)
- `packages/tokens/src/radius.ts` — rank-based `radius` scale (17 values) + `radiusLegacyAliases` (3 deprecated aliases)
- `packages/tokens/src/elevation.ts` — `elevation.e1`–`e6`, each a confirmed shadow-layer list
- `packages/tokens/src/color.test.ts`, `radius.test.ts`, `elevation.test.ts` — category-specific tests
- `docs/token-normalization-decisions.md` — produced in the prior session, now the implemented spec (unmodified this round)

**Modified:**
- `packages/tokens/src/index.ts` — replaced the placeholder `DesignTokens`/`tokens` shape with real exports (`export * from "./color"`, `./radius`, `./elevation`) plus a `tokens = { color, radius, elevation }` aggregate; no `typography`/`spacing` keys
- `packages/tokens/src/index.test.ts` — rewritten to assert the real root export shape and that unresolved categories are absent
- `packages/tokens/README.md` — full rewrite per the documentation requirements (install/import, categories, naming examples, `focus.danger` fix, radius decision, aliases, deferred items, unresolved categories, "not inferred" statement)

**Not modified:** nothing outside `packages/tokens/` and this documentation — `packages/ui` and `packages/icons` only reference `@shikho/tokens`'s `tokens` export as a bare type (`typeof tokens`), so reshaping its contents did not require touching either package. No audit file or Figma source was touched.

### Confirmed token count

≈**56 canonical values** exported as distinct, individually confirmed data points:
- Color: 11 ramps × 11 steps = 121 primitive hex values, + 2 opacity ramps (`black`, `white`) × 12 steps = 24 hex values, + 5 `focusRingColor` values (4 confirmed-as-is + 1 corrected) = **150 confirmed color values**
- Radius: **17 confirmed values** (`none` through `10xl`, plus `track` and `full`)
- Elevation: **6 levels**, comprising **21 individual shadow layers** in total (1+2+3+4+5+6), each with a confirmed `y`/`blur`/`spread`, all sharing 1 confirmed shadow color

Total individual confirmed data points: **150 (color) + 17 (radius) + 21 shadow layers across 6 elevation levels ≈ 188**, all cited to a specific line in `docs/audit/`.

### Alias count

**3 deprecated radius aliases** (`radiusLegacyAliases.borderRadiusSm2`, `.borderRadiusMd`, `.borderRadiusLg`) — each documented with `@deprecated` JSDoc pointing at its canonical replacement, added only where the audit confirmed an exact value collision between the two legacy radius systems. No color or elevation aliases were added (no equivalent confirmed collision existed for those categories).

### Token categories intentionally excluded

Typography, spacing, gradients, subject colors, opacity-step renaming, and any semantic "surface/emphasis" tokens (`smoke_*`, `_base`/`_med_em`) — none are exported, not even as `null` placeholders. See `packages/tokens/README.md` "Unresolved token categories" and "Deferred decisions" sections for the full list and reasoning.

### Confirmation: no values guessed or inferred

Every hex, numeric radius value, and shadow-layer number in `color.ts`, `radius.ts`, and `elevation.ts` carries an inline source citation to a specific `docs/audit/*.md` file, cross-checked against the source documents directly (not solely from the earlier normalization-decisions summary) before being written. Where the audit explicitly labeled a value as inferred-not-confirmed (e.g. elevations.md's geometric-progression hypothesis for e3/e4/e5, since superseded by direct confirmation in later audits) or unresolved (gradients, ~30 subject colors, focus-ring geometry, typography composites for Body 2/Overline/Para), that value was **not** implemented. The one intentional deviation from a raw Figma value — `focus.danger` — is a corrected mapping to a different *already-confirmed* value (danger's own alpha-24, `#f03d3d3d`, itself quoted verbatim from `docs/audit/alerts.md`), not an invented one.

### Commands executed

```
pnpm build       # turbo run build     — 4/4 packages pass
pnpm typecheck   # turbo run typecheck — 4/4 packages pass (7 tasks incl. tokens' own tsc --noEmit)
pnpm test        # turbo run test      — 7/7 tasks pass, 12 new tests in packages/tokens
pnpm lint        # turbo run lint      — 4/4 packages pass, no errors
```

All run with the real `pnpm` binary (see the resolved note in §5) and `CI=true` to avoid interactive prompts.

### Validation results

| Check | Status | Notes |
|---|---|---|
| Build | ✅ Pass | `tokens` builds ESM+CJS+`.d.ts` via tsup with no errors; downstream `icons`/`ui`/`storybook` builds unaffected |
| Tests | ✅ Pass | 12/12 new assertions pass across `color.test.ts` (3), `radius.test.ts` (3), `elevation.test.ts` (4), `index.test.ts` (2); existing `icons`/`ui` tests still pass |
| Typecheck | ✅ Pass | `tsc --noEmit` clean in `tokens`; `ui`/`icons` still typecheck cleanly against the reshaped `tokens` export (only referenced via `typeof tokens`) |
| Lint | ✅ Pass | `eslint .` clean in all 4 packages, no new warnings |

### Warnings or blockers

- None new. `docs/.DS_Store` shows as modified in `git status` — a macOS Finder metadata artifact, not touched intentionally by this work, and not part of the token implementation.
- The two-word radius keys (`"2xl"`, `"3xl"`, …, `"10xl"`) require bracket/string-key access in TypeScript (`radius["2xl"]` rather than `radius.2xl`) — a minor ergonomic note, not a defect; documented in code comments.

### Exact next recommended task

Populate `packages/ui`'s Tailwind v4 `@theme` layer (currently `src/styles.css` has no theme values — see the prior setup report) by wiring it to `@shikho/tokens`'s new `color`, `radius`, and `elevation` exports, so `tailwind-variants`-based components can start consuming real design values. This should happen **before** any real component (starting with `Button`, per the implementation plan's build-tier order) is implemented, since components need the token-backed Tailwind theme to exist first.
