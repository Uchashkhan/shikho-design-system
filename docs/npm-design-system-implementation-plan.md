# Shikho Design System — npm Monorepo Implementation Plan

**Status:** Planning document only. No code, tokens, or components have been generated. No folders have been created. Audit files under `docs/audit/` are untouched.

**Inputs:** `docs/design-system-audit-summary.md` + all 27 files in `docs/audit/`.

---

## 0. A blocking precondition the audit itself raises

The audit summary's own closing recommendation is explicit and should govern how this plan is read:

> "Treat this summary plus the 27 linked audit files as the baseline design-system documentation until the above cleanup lands — do not begin a token-pipeline or component-library engineering effort against the current naming as-is, since it would encode every inconsistency documented here directly into code."

This plan does not ignore that warning, but it also doesn't block on it. The architecture below is built so the monorepo can be scaffolded and the tooling proven out *now*, while the actual token values and component variant APIs are deliberately deferred to a normalization pass. Concretely:

- **`packages/tokens`** is architected around a **raw → semantic mapping layer** (§5.1), not a 1:1 dump of Figma variable names. This absorbs the radius collisions, the four alpha-naming conventions, and the `focus_danger` bug at the mapping boundary instead of shipping them as public API.
- **Component API design** (when that phase starts) must pick **one** selection-state vocabulary (`checked`/`unchecked` is recommended, matching `aria-checked`/native `<input>` semantics) rather than importing Checkbox's/Radio's/Toggle's/Chip's four divergent vocabularies verbatim.
- This document is the plan for the *foundation* (repo, tooling, package boundaries, contracts). It explicitly stops short of specifying token values or component visual APIs — that is the normalization pass's deliverable, sequenced as Phase 2 below.

---

## 1. Current Repository Analysis

| Aspect | Finding |
|---|---|
| Tracked files | `docs/audit/*.md` (27 files), `docs/design-system-audit-summary.md`, `.claude/` config |
| Package manifests | None — no `package.json` anywhere |
| Workspace config | None — no `pnpm-workspace.yaml`, no `packages/`, no `apps/` |
| Build tooling | None installed — `pnpm` is not even on `PATH` yet |
| Git state | Single commit (`chore: initialize design system repository`), clean, on `main` |
| Source code | None exists — this is a pure greenfield build from audit documentation only |

**Implication:** every task below (workspace root, tsconfig base, lint/format config, CI) is a net-new addition, not a migration. There is no legacy build system to reconcile with, which simplifies sequencing but means nothing can be "incrementally adopted" — the base tooling has to exist before any package can be built.

---

## 2. Component Categorization (from the audit)

The audit's own consolidated summary already classifies every subject into a taxonomy; this section maps that taxonomy onto the three target packages and flags what's out of scope for v1.

### 2.1 `packages/tokens` — Foundations

| Topic | Audit source | Notes for token package |
|---|---|---|
| Color | `colors.md` | 4 brand ramps (primary, Secondary, Shikho AI, secondary_2), functional ramps (info/success/danger/warning), gray/dark/vanilla_gray, black/white opacity ramps, ~35 Subject Colors (only 5 resolved), 6 Gradients (all unresolved) |
| Typography | `typography.md` | 15-step type scale, 2 font-family vars, tracking rule (sm above Heading 3, none below), weight composites, 2 diverging bold weight scales |
| Elevation | `elevations.md` | 6 fully-resolved levels (e1–e6), additive-stacking shadow model (breaks once, e3→e4) |
| Effects | `special-effects.md` | Special outlines (unresolved geometry), 5 focus rings (1 buggy), 2 button effects, input inner shadow, `special_drop` |

**Categorization decision:** all four are foundation-tier and belong in `tokens`, none in `ui`. Gradients and unresolved Subject Colors are **out of scope for v1** — ship the 5 resolved subjects and the confirmed ramps only; add the rest once a follow-up Figma pass resolves them.

### 2.2 `packages/ui` — Components

Using the audit's own primitive/composed/bare/demo buckets:

**Primitive (build first, no internal DS dependencies beyond tokens/icons):**
Button family (button_danger, button_success, Greyscale, icon_button, new_blue, new_pink, ai_rounded, ai_regular — to be consolidated into one `Button` API, see §6.2), Avatar (avatar, avatar_face, avatar_group), Checkbox, Radio, Toggle, Link, Chip, Tags, Tooltip, Alert*, Toast*, Field/Input family (field, input_field, dropdown, textarea, digit_input, input_label, input_hint), Table Cell, Modal (shell only — header/actions unverified internally).

`*Alert` and `Toast` are primitive at the shell level but have a **confirmed hard dependency on Button** (see §2.4) — they can't be built before Button exists.

**Composed (require another `ui` component to exist first):**
- `ButtonGroup` — composes `Button`
- `List` — composes `Checkbox` (and a shared `Tag` sub-component)
- `NavBarHeader`/`TabNavItem` — composes `TabNavItem` × N
- `Alert`, `Toast` — compose `Button` (danger variant)

**Navigation family (primitive, but share a naming lineage worth preserving):**
`SwitcherItem`/`Switcher`, `SidebarItem`/`SidebarItemCollapsed`, `TopNavItem`, `TabNavItem` — the audit found `TopNavItem`'s type vocabulary is a deliberate superset of `SwitcherItem` + `SidebarItem`. Build these as siblings sharing a common internal variant-typing helper, not as fully independent implementations, to preserve that lineage rather than re-diverging it in code.

**Deferred / needs a follow-up audit before implementation:**
- `DatePicker` — internal day-cell/nav-arrow structure was never inspected (no `get_design_context` used); do not implement from this audit alone.
- `Pagination` — audit explicitly flags this component's single `page` property as overloading scenario+density+breakpoint into one non-orthogonal axis, and recommends splitting into a `PaginationItem` primitive + explicit compositions *before* implementation.
- `Progress` — flagged Critical/High: dimensionally identical to `Pagination`'s `load_more` variant, likely duplicate/copy-paste content. Do not implement until reconciled with Pagination.
- `Modal` internals (`modal_header`, `modal_actions`), `Table` (row/header/toolbar/pagination), `DropMenu`, `DigitField`, the `SideBar`/`sidebar_nav_collapsed` bare instances, `SidebarNav`/`TopNav`/`TabNav` "likely demo" wrappers — all are bare/unexpanded in Figma; build only the confirmed-primitive pieces (`TableCell`, `ModalShell`) and treat the rest as a backlog item pending a deeper Figma audit.

### 2.3 `packages/icons` — Icon System

The audit found **no dedicated icon component library** in Figma — no `Icon/{name}` component set was located anywhere across the 27 files. What exists:
- A `sizing/icon/*` token scale (14, 16, 18, 20, 22, 24, 28px), applied inconsistently per-component.
- A consistent **instance-swap slot pattern** (`selectLeftIcon`/`selectRightIcon`, typed `React.ReactNode | null`) used by Field, Chip, List, Switcher, and SidebarItem — meaning the intended component API already treats icons as swappable, consumer-supplied React nodes, not baked-in glyphs.
- `avatar_face` (12 face variants) is the closest analog to a glyph set, but it's scoped to avatar faces specifically, not general UI iconography.

**Categorization decision:** `packages/icons` cannot be populated from this audit — there is no icon inventory, style (line/filled), or grid spec to extract. Scaffold the package (build tooling, export shape, `sizing/icon/*` size tokens re-exported from `tokens`) but treat actual glyph population as **blocked on a fresh Figma icon-library audit**, out of scope here per the "do not generate icons" constraint anyway.

### 2.4 Confirmed cross-component dependency graph

```
tokens ──> icons ──> ui

Within ui:
  ButtonGroup    ──depends on──> Button
  Alert          ──depends on──> Button (danger variant)
  Toast          ──depends on──> Button (danger variant)
  List           ──depends on──> Checkbox, Tag (shared sub-component)
  SidebarItem    ──depends on──> Tag (same shared sub-component as List)
  NavBarHeader   ──depends on──> TabNavItem (×5, composition)
  TopNavItem     ──shares vocabulary with──> SwitcherItem, SidebarItem (not a runtime dep, a naming lineage)
```

This graph directly determines the build order in §7 and the internal package dependency rules in §5.3.

---

## 3. Monorepo Architecture

### 3.1 High-level shape

```
shikho-design-system/
├── packages/
│   ├── tokens/       — design tokens: color, type, elevation, effects, spacing, radius
│   ├── icons/         — icon components + icon sizing (scaffolding only for v1)
│   └── ui/            — React components (tailwind-variants + clsx), consumes tokens + icons
├── apps/
│   └── storybook/     — Storybook app documenting/testing all `ui` components
├── docs/               — existing audit + this plan (untouched by this build)
├── pnpm-workspace.yaml
├── package.json        — root: workspace scripts, shared devDependencies
├── tsconfig.base.json   — shared compiler options, extended by each package
├── .changeset/          — release tooling (see §11)
└── turbo.json / nx.json — task graph runner (see §9.4 for the recommendation)
```

### 3.2 Why this shape

- **`tokens` has zero runtime dependencies on React** — it must be consumable by non-React consumers (Tailwind config, Figma tooling, potentially a future mobile/RN package) without pulling in a UI framework.
- **`icons` sits between `tokens` and `ui`** because icon components need sizing tokens but `ui` components need to render icons (Button's icon slot, Field's `leftIcon`, etc.) — enforcing this order at the package-dependency level prevents accidental circular imports later.
- **`ui` is the only package with a peerDependency on React** — keeping React out of `tokens`/`icons`' dependency trees keeps them lightweight and framework-agnostic where possible (icons technically needs React for the component wrapper, but not for anything else).
- **`apps/storybook` is an app, not a package** — it is never published to npm, never imported by another workspace package, and is free to depend on all three packages plus dev-only tooling (MDX docs, addons) without those dependencies leaking into published package.json files.

### 3.3 Workspace tooling choices (rationale)

| Concern | Choice | Why |
|---|---|---|
| Package manager | pnpm workspaces | Already specified; strict node_modules isolation catches undeclared cross-package deps early — valuable given `ui`'s hard dependency on `tokens`/`icons` must be explicit, not accidental via hoisting |
| Build orchestration | Turborepo | Lightest-weight task graph runner that understands pnpm workspaces natively, caches per-package build/test/lint outputs, and requires minimal config for a 3-package + 1-app monorepo. (Nx is a reasonable alternative but its plugin surface is overkill at this scale.) |
| Language | TypeScript, project references | `tsconfig.base.json` at root; each package extends it and declares `references` matching the dependency graph in §2.4, so `tsc --build` respects package build order automatically |
| Styling | Tailwind CSS v4 + tailwind-variants + clsx | Tailwind v4 lives in `ui` (and possibly a shared preset in `tokens` — see §5.1); `tailwind-variants` defines each component's variant API in code (replacing Figma's inconsistent variant property names with one normalized vocabulary per component); `clsx` for conditional class composition inside components |
| Component build | tsup | Fast esbuild-based bundler, outputs ESM + CJS + `.d.ts` per package with minimal config — appropriate for library packages that don't need a dev server (that's Storybook's job) |
| Component dev/preview | Vite (via Storybook 8's Vite builder) | Fast HMR for the Storybook app; Vite is not used to build the publishable packages themselves (tsup owns that), only to run the Storybook app |
| Testing | Vitest | Shares config/transform pipeline with Vite-based Storybook, fast, ESM-native — one test runner across all three packages plus interaction tests inside Storybook |
| Docs | Storybook (MDX + autodocs) | Component docs live next to stories in `apps/storybook`; token docs live in `packages/tokens` README + a dedicated Storybook "Foundations" section |

---

## 4. Package Responsibilities

### 4.1 `packages/tokens`
**Responsibility:** the single source of truth for every design decision that isn't a component: color, typography, spacing, radius, elevation/shadow, motion (if/when audited), and the Tailwind v4 theme configuration derived from them.

**Explicitly responsible for:**
- Normalizing the audit's raw Figma variable names into one canonical naming convention (radius, alpha/opacity, selection-state where token-relevant).
- Providing token values as both a TypeScript object (for JS consumers, e.g. `tailwind-variants` config, icon sizing) and a Tailwind v4 `@theme` CSS layer (for utility class generation).
- Documenting every deliberate deviation from the raw Figma name (mapping table), so the normalization is traceable back to source.

**Explicitly NOT responsible for:**
- Any React component or JSX.
- Resolving the ~30 unconfirmed Subject Colors or the 6 unresolved Gradients — flagged as a v2/backlog item, not a blocker for v1 token package structure.

### 4.2 `packages/icons`
**Responsibility:** a thin, tree-shakeable set of icon React components plus the icon-sizing scale, consumed by `ui` components' icon slots.

**Explicitly responsible for:**
- Re-exporting the `sizing/icon/*` scale from `tokens` as typed size props (`14 | 16 | 18 | 20 | 22 | 24 | 28`).
- Establishing the component shape (SVG wrapper, size/color prop contract) that a future glyph-population pass will fill in.

**Explicitly NOT responsible for (v1):**
- Populating actual glyphs — blocked on a Figma icon-library audit that doesn't exist yet (§2.3). The package ships scaffolding + build config only until that audit lands.

### 4.3 `packages/ui`
**Responsibility:** every audited component, built against `tokens` and `icons`, using `tailwind-variants` for variant APIs and `clsx` for conditional composition.

**Explicitly responsible for:**
- Defining one normalized variant/state vocabulary per component family (collapsing the audit's divergent Checkbox/Radio/Toggle/Chip selection-state names into one shared pattern — see §0).
- Consuming `tokens` exclusively through the public token API (never hardcoding a color/radius/shadow value inline).
- Consuming `icons` exclusively through the instance-swap-style prop pattern the audit already found evidence for (`leftIcon`/`rightIcon` as `ReactNode`, not baked-in glyph names) — this is a rare case where the audit's own findings directly validate a code-level API decision.

**Explicitly NOT responsible for:**
- Page-level layout, routing, or app shell concerns (the "likely demo composition" components like `SidebarNav`/`TopNav`/`TabNav` are out of scope for `ui` — they belong, if built at all, in a future `packages/patterns` or in consuming apps).

### 4.4 `apps/storybook`
**Responsibility:** the visual documentation, manual QA, and (via interaction/accessibility addons) test surface for every `ui` component and every `tokens` foundation.

**Explicitly responsible for:**
- One story file per component covering every normalized variant/state combination.
- A "Foundations" section documenting color/type/elevation/spacing tokens visually (swatches, type specimens, shadow previews) generated from `packages/tokens`, not hand-authored duplicates.
- Accessibility checks (via `@storybook/addon-a11y`) as a gate before a component is considered "done," given how many audited components (Link, TabNavItem outline types, ToggleOFF-focus) have confirmed missing focus states.

---

## 5. Package Exports

### 5.1 `@shikho/tokens`

```
@shikho/tokens                → JS/TS object export: { color, typography, elevation, radius, spacing, effects }
@shikho/tokens/tailwind        → Tailwind v4 @theme CSS entry point (import "@shikho/tokens/tailwind" in consuming CSS)
@shikho/tokens/css             → raw CSS custom-properties fallback (non-Tailwind consumers)
```

- Root export is framework-agnostic JSON/TS — safe for `icons`, `ui`, or any non-React tool to import.
- `/tailwind` subpath is the only Tailwind-coupled export, kept separate so `tokens`' root import doesn't force a Tailwind dependency on unrelated consumers.

### 5.2 `@shikho/icons`

```
@shikho/icons                  → named exports per icon component, e.g. `import { ChevronDownIcon } from "@shikho/icons"`
@shikho/icons/types             → shared `IconProps` type (size, color, className) for `ui` components to type their icon slots against
```

### 5.3 `@shikho/ui`

```
@shikho/ui                      → all components, named exports (tree-shakeable): Button, Checkbox, Radio, Toggle, Chip, Tag, ...
@shikho/ui/styles.css            → compiled Tailwind output for consumers not running their own Tailwind build
```

- No default export, no barrel-of-barrels per component family — flat named exports at the package root, matching how the audit's own naming lineage work (TopNavItem/SwitcherItem/SidebarItem) suggests these are meant to be used side by side, not nested namespaces.
- Sub-components created purely by composition (e.g. the shared `Tag` used inside `List`/`SidebarItem`) are exported too, since the audit found them structurally real, reusable pieces, not private internals.

### 5.4 Internal package dependency rules (enforced, not just documented)

- `tokens`: no workspace dependencies.
- `icons`: depends on `tokens` only.
- `ui`: depends on `tokens` and `icons`.
- `apps/storybook`: depends on all three; never the reverse.

These rules should be enforced via each package's `package.json` `dependencies` field (pnpm will fail resolution on violations) and optionally double-checked with an ESLint import-boundary rule (e.g. `eslint-plugin-boundaries`) once component code exists.

---

## 6. Dependency Relationships

### 6.1 External dependencies per package

| Package | Runtime deps | Peer deps | Dev deps (build-relevant) |
|---|---|---|---|
| `tokens` | — | — | tsup, typescript, tailwindcss (v4, for the `/tailwind` export generation) |
| `icons` | `@shikho/tokens` | `react` | tsup, typescript, svgr or equivalent (once glyphs exist) |
| `ui` | `@shikho/tokens`, `@shikho/icons`, `tailwind-variants`, `clsx` | `react`, `react-dom` | tsup, typescript, tailwindcss v4, vitest, @testing-library/react |
| `apps/storybook` | `@shikho/tokens`, `@shikho/icons`, `@shikho/ui` | — | storybook, vite, @storybook/addon-a11y, @storybook/addon-interactions |

React is a **peer dependency**, never a direct dependency, in `icons` and `ui` — this is standard for publishable component libraries and avoids duplicate React copies in consumer apps.

### 6.2 Internal component-to-component dependencies (build order implication)

Derived directly from §2.4's confirmed graph, translated into a required implementation order within `packages/ui`:

1. **Tier 0 (no internal deps):** Button (consolidating the 8 audited button sets into one variant-driven `Button` + separate `IconButton`), Avatar, Checkbox, Radio, Toggle, Link, Chip, Tags, Tooltip, Field/Input family, TableCell, Modal shell, SwitcherItem, SidebarItem, TopNavItem, TabNavItem.
2. **Tier 1 (depend on Tier 0):** ButtonGroup (→ Button), Alert (→ Button), Toast (→ Button), List (→ Checkbox + shared Tag), NavBarHeader (→ TabNavItem × N).
3. **Tier 2 (shared sub-component extraction):** the `Tag` element used inside both List and SidebarItem should be built once as an internal shared primitive before either List or SidebarItem is finalized, to avoid the audit's confirmed duplication risk (List/SidebarItem currently only "suggestively" share it in Figma — code should make that sharing explicit and real).

This tiering is the authoritative build sequence referenced in §7.2.

---

## 7. Documentation Strategy

### 7.1 Layers of documentation

1. **Token documentation** — lives in `packages/tokens/README.md` plus a generated Storybook "Foundations" section. Every normalized token name must document its raw Figma source name(s) it replaces (the mapping table from §0), so a designer or engineer can trace "why does `radius.md` = 10px" back to which of the audit's colliding raw values won.
2. **Component documentation** — Storybook autodocs (generated from TypeScript prop types + JSDoc) as the primary source, supplemented by MDX pages only where a component's behavior needs prose beyond prop tables (e.g. Modal's focus-trap behavior, Field's label/hint association rules).
3. **Architecture documentation** — this document (`docs/npm-design-system-implementation-plan.md`) plus a living `docs/decisions/` log (ADR-style) for any decision that deviates from or supersedes something written here (e.g. the eventual selection-state vocabulary decision, the Pagination/Progress reconciliation outcome).
4. **Package-level READMEs** — each of `tokens`, `icons`, `ui` gets a README covering: install, quick usage example, link to the relevant Storybook section, and a scope statement (what's intentionally NOT included, e.g. icons' "no glyphs yet" caveat).

### 7.2 Traceability requirement

Every component's Storybook docs page must link back to its source audit file (e.g. Button's docs page links to `docs/audit/buttons.md`) so any future discrepancy between shipped code and the original Figma audit is easy to trace and re-verify, rather than requiring a fresh archaeology pass.

---

## 8. Build Strategy

### 8.1 Per-package build

- **`tokens`, `icons`, `ui`:** built with **tsup**, each producing:
  - `dist/index.js` (ESM)
  - `dist/index.cjs` (CJS, for consumers not yet on ESM-only tooling)
  - `dist/index.d.ts` (types, generated via `tsup`'s `dts: true` or a separate `tsc --emitDeclarationOnly` step if generation gets slow)
  - `ui` additionally emits `dist/styles.css` (Tailwind-compiled output) as a separate build step (Tailwind v4 CLI or PostCSS, run alongside tsup, not through it — tsup doesn't process CSS/Tailwind directives natively).
- **`apps/storybook`:** built with Storybook's Vite builder for local dev (`storybook dev`) and static output (`storybook build`) for deployment/preview — not published to npm, so no dts/CJS concerns.

### 8.2 Cross-package build orchestration

- **Turborepo** task graph, with `build` in `ui` depending on `build` in `tokens` and `icons` (`"dependsOn": ["^build"]` in `turbo.json`), so `pnpm build` at the root always builds in the correct order (`tokens` → `icons` → `ui` → storybook) regardless of invocation order, and caches unchanged packages' outputs between runs.
- **TypeScript project references** mirror the same order (`ui/tsconfig.json` references `tokens` and `icons`), so `tsc --build` and editor tooling (go-to-definition across packages) stay consistent with the Turborepo graph — the two shouldn't be allowed to drift into different orderings.

### 8.3 Tailwind v4 specifics

- Tailwind v4's CSS-first configuration (`@theme` directive, no `tailwind.config.js` required) fits the `tokens` → `ui` boundary well: `tokens` ships a `@theme` block generated from the same TS token object used elsewhere, and `ui`'s Tailwind entry point simply `@import`s it — one generation step, two consumption formats (JS object + CSS `@theme`), no hand-maintained duplication between them.
- `tailwind-variants` is used inside each `ui` component to define the variant/slot API; it consumes Tailwind utility classes built from the same `@theme` tokens, keeping variant definitions and raw token values from diverging.

---

## 9. Testing Strategy

### 9.1 Test types by package

| Package | Test type | Tooling |
|---|---|---|
| `tokens` | Value/shape assertions (e.g. "every color ramp has exactly 11 steps," "no two normalized radius tokens resolve to the same raw value unintentionally") | Vitest |
| `icons` | Render smoke tests (icon renders, accepts size/color props) once glyphs exist | Vitest + @testing-library/react |
| `ui` | Unit/render tests per component (variant → expected class/attribute), interaction tests (keyboard nav, focus states — directly targeting the audit's confirmed focus-state gaps in Link/TabNavItem/Toggle), accessibility tests | Vitest + @testing-library/react + Storybook interaction tests + addon-a11y |
| `apps/storybook` | Visual regression (optional, v2) | Chromatic or Storybook Test Runner, not required for v1 |

### 9.2 Priority order for test coverage (mapped to audit-flagged gaps)

Given the audit's own State Coverage Matrix findings, test suites should explicitly assert the *intended* (normalized) state coverage per component, since the raw Figma coverage was inconsistent:
1. Focus-state presence/keyboard-operability for every interactive component (Link and TabNavItem's outline types had **zero** confirmed focus coverage in Figma — code must not repeat that gap).
2. The `focus_danger` token must resolve to a danger-derived color in a token-level test, guarding against reintroducing the confirmed Figma binding bug during token normalization.
3. Selection-state components (Checkbox/Radio/Toggle/Chip) get one shared test suite asserting the **normalized** vocabulary end-to-end (props in → correct `aria-checked`/`aria-pressed`/class out), rather than four independently-invented test patterns.

### 9.3 Coverage gates

- Every `ui` component requires: render test, all-variants snapshot or prop-matrix test, one accessibility assertion (axe via addon-a11y or `vitest-axe`).
- No numeric coverage percentage gate is recommended initially (premature for a from-scratch build); revisit once the component count is large enough for a percentage target to be meaningful rather than arbitrary.

### 9.4 Where tests run

- Locally: `pnpm test` at root, Turborepo-orchestrated per package (`test` depends on nothing else, can run in parallel across packages unlike `build`).
- CI: same command, gated on PR before merge (see §11 CI notes).

---

## 10. Release Strategy

### 10.1 Versioning model

- **Changesets** (`@changesets/cli`) for independent semver versioning of `@shikho/tokens`, `@shikho/icons`, `@shikho/ui` — appropriate because these packages will not always move in lockstep (a tokens-only fix shouldn't force a `ui` version bump, and vice versa).
- `apps/storybook` is never versioned/published — it's excluded from the changesets config entirely.

### 10.2 Publish sequencing

Matches the dependency order already established in §2.4/§6.2: a release that touches `tokens` must publish `tokens` first (or in the same changeset batch with correct internal version-range bumps) before `ui`'s dependent release goes out, so `ui`'s `package.json` never points at an unpublished internal version. Changesets' `linked`/`fixed` config is not needed since the packages are intentionally independent — plain automatic dependency-range bumping (Changesets does this automatically when a dependency package's version changes) is sufficient.

### 10.3 Pre-1.0 phase

Given the audit's explicit warning against building on unnormalized names/tokens, the recommended initial published version for all three packages is **`0.x`** (not `1.0.0`), with an explicit note in each README that breaking changes are expected until:
1. The token-normalization pass (§0) lands and is confirmed against a re-run of the affected audits (per the summary's own recommendation).
2. The Pagination/Progress reconciliation is resolved.
3. A single selection-state vocabulary is chosen and applied across Checkbox/Radio/Toggle/Chip/List/Switcher.

Only after those three land should `1.0.0` be considered for `ui`; `tokens` and `icons` can mature independently on their own timelines.

### 10.4 CI/CD

- CI (GitHub Actions, matching a typical pnpm+Turborepo setup): install → lint → typecheck → test → build, all Turborepo-cached, on every PR.
- Release: Changesets' GitHub Action (`changesets/action`) opens/updates a "Version Packages" PR automatically when changesets are present on `main`; merging that PR triggers `pnpm publish` per changed package. No manual `npm publish` steps.

---

## 11. Sequencing Summary (implementation phases)

This plan intentionally separates **foundation work** (this document's scope) from **content work** (tokens/components themselves), per the constraints given. Recommended phase order for when content work begins:

1. **Phase 0 — Foundation (this plan's deliverable):** repo scaffolding, tooling config, package boundaries, CI — no token values, no components.
2. **Phase 1 — Token normalization:** resolve the radius collisions, pick one alpha convention, fix `focus_danger`, decide the selection-state vocabulary — a naming/mapping decision pass, output is a mapping doc, not code.
3. **Phase 2 — `tokens` package content:** implement the normalized tokens against the Phase 1 mapping.
4. **Phase 3 — `ui` Tier 0 components:** per §6.2's build order, starting with Button (the most-depended-on primitive).
5. **Phase 4 — `ui` Tier 1/2 components:** composed components, once their dependencies exist.
6. **Phase 5 — `icons` glyph population:** blocked on a separate Figma icon-library audit not yet performed.
7. **Phase 6 — Storybook + docs completion, 1.0 readiness review.**

This document covers Phase 0 architecture only, as scoped by the request.
