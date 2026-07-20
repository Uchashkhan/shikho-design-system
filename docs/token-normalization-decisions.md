# Token Normalization Decisions

Compact implementation-decision doc for `packages/tokens` v0.1. Source: `docs/design-system-audit-summary.md` + all 27 files in `docs/audit/`. This is not a re-audit — it converts existing audit findings into naming/mapping decisions so token *implementation* can start.

**Legend:** ✅ Confirmed value/definition from audit · 🟡 Confirmed to exist, value unresolved (placeholder) · ⚠️ Breaking decision (needs your approval) · 🔗 Safe alias (non-breaking)

---

## 1. Colors (primitives)

**Canonical format:** `color.{ramp}.{step}` — ramp names lowercase-kebab, step = the 11-point scale `50…950`.

| Current Figma name | Canonical name | Status |
|---|---|---|
| `Color/primary` | `color.primary.{50-950}` | ✅ ramp confirmed (11 steps); `primary/500` hex spot-checked |
| `Color/Secondary` | `color.secondary.{50-950}` | ✅ ramp confirmed; casing normalized (🔗 alias) |
| `Color/Shikho AI` | `color.shikho-ai.{50-950}` | ✅ ramp confirmed; slug normalized (🔗 alias) |
| `Color/secondary_2` | `color.secondary-2.{50-950}` | ✅ ramp confirmed — **kept distinct from `secondary`, not merged** (unclear intended relationship; merging would be inventing intent) |
| `Color/info`, `/success`, `/danger`, `/warning` | `color.info.*`, `.success.*`, `.danger.*`, `.warning.*` | ✅ ramps confirmed |
| `Color/gray`, `/vanilla_gray`, `/dark` | `color.gray.*`, `.vanilla-gray.*`, `.dark.*` | ✅ ramps confirmed |
| `Color/black/*`, `Color/white/*` | `color.black.alpha-{pct}`, `color.white.alpha-{pct}` | ✅ `black/50`≈3.9%, `black/950`=100% confirmed. 🟡 middle steps (10 of 12 per ramp) and all of `white/*` unresolved — do not invent an interpolation curve |

**Duplicate/conflicting:** `radius/custom/xl` and `radius/border_radius_lg` both resolve to `16` under Colors' own audit — this is a radius issue surfacing here; resolved in §6, not duplicated here.

---

## 2. Semantic colors

**Canonical format:** `color.semantic.{role}` (e.g. `text.gray-950`, `border.danger`), aliasing a primitive above — never a literal value of its own.

| Current | Canonical | Status |
|---|---|---|
| `Text/Gray 950` | `text.gray-950` → alias of `color.gray.950` | ✅ aliasing pattern confirmed |
| `outline/*` (borders) | `border.{role}` → alias of a primitive | ✅ pattern confirmed, e.g. `outline/gray-100` |
| `elevation/*` (shadow color only) | see §7 Elevation | ✅ single color `#0000000a` used throughout |

**Decision:** keep semantic tokens as pure aliases (no independent value) — this is how the source system already works, so it's a 🔗 safe, non-breaking normalization (rename only).

---

## 3. Alpha / opacity tokens

**The audit found 4+ parallel conventions for "brand color at reduced emphasis":** `_alpha_XX` suffixes, `smoke_*`, `_base`/`_med_em` suffixes, `surface/*`, plus a separate `outline/Black *` / `neutral_transparent_Black/Black *` / `Color/black/*` triple-naming for plain black/white opacity.

⚠️ **Breaking decision — pick one convention:** adopt `tags.md`'s pattern as canonical, since the audit calls it "the cleanest naming pattern found in the entire audit series":

**Canonical format:** `{token}.alpha-{12|20|24}` (percentage suffix, numeric, no other opacity suffix style survives).

| Current | Canonical | Status |
|---|---|---|
| `_alpha_12`, `_alpha_20`, `_alpha_24` (tags.md) | `color.{ramp}.{step}.alpha-{12\|20\|24}` | ✅ confirmed values, becomes the canonical pattern as-is (🔗 safe alias) |
| Alert-style bare `_alpha` (no percentage) | resolve to the percentage actually measured (≈24% in Alert) → `alpha-24` | ⚠️ breaking rename — ambiguous name is retired |
| `outline/Black *`, `neutral_transparent_Black/Black *` | `color.black.alpha-{pct}` (§1) | ⚠️ breaking — three names collapse to one |
| `smoke_*`, `_base`/`_med_em`, `surface/*` | **not merged into alpha convention** | 🟡 kept as a separate, unresolved `surface.*` semantic-emphasis category — these are design *roles* (e.g. "field background"), not raw opacity values; forcing them into `alpha-XX` would be inventing an equivalence the audit never confirmed |

---

## 4. Typography

**Canonical format:** `font.{family|size|weight|tracking}.{step}` for primitives; `font.composite.{scale-step}.{weight}` for the resolved Text-style objects (e.g. `font.composite.body-13.semibold`).

| Current | Canonical | Status |
|---|---|---|
| `font/family/primary` = "Noto Sans Bengali" | `font.family.primary` | ✅ confirmed |
| `font/family/display` | `font.family.display` → 🔗 alias of `font.family.primary` (resolves identically) | ✅ confirmed identical, safe merge |
| 15-step scale (Display 3/2/1 … Overline) | `font.size.{display-3…overline}` | ✅ step names + sizes confirmed (104px → 11px) |
| Tracking rule | `font.tracking.sm` (−0.8, Display/Heading 6-5-4) / `font.tracking.none` (0, Heading 3 and below) | ✅ confirmed clean threshold |
| `font/weight/default/bold` = 700 | `font.weight.bold` | ✅ confirmed, canonical |
| `font/weight/display/bold` = 800 | **not adopted** | 🟡 unresolved/unused — audit found no consumer of this value; the one Display Bold composite hardcodes literal 700. Do not implement an 800 weight token without a confirmed consumer. |
| `web/Title/13 {Medium,Semibold,Bold}` ≡ `web/Body/13 {Medium,Semibold,Bold}` | `font.composite.title-13.*` = `font.composite.body-13.*` | 🔗 safe alias — audit confirms byte-identical composites, collapse to one |
| `web/Title/104 Semibold` (family field unresolved literal string) | `font.composite.display-104.semibold` | 🟡 flag only — inherits `font.family.display`, but source binding is broken in Figma; do not silently "fix" the family value, ship it pointing at `font.family.display` per its sibling `Medium` variant and note the discrepancy |
| `Body 2`, `Overline`, `Para` | `font.composite.body-2`, `.overline`, `.para` | 🟡 unresolved — no composite Font token exists, only bare size/line-height. `Para` has no dedicated size (borrows Body 1's) — ship `font.size.para` as an 🔗 alias of `font.size.body-1`, not a new value |

---

## 5. Spacing

**Canonical format:** `spacing.{value}` (numeric px, e.g. `spacing.4`).

⚠️ **Scoping note:** there is no dedicated spacing audit file — every spacing value below was an incidental sighting inside a component audit, not a systematic scale.

| Confirmed values | Status |
|---|---|
| `spacing/0`, `/4`, `/6`, `/20`, `/28` | ✅ confirmed (5 values, from Button Group and Tab Navigation audits) |
| Any other step (8, 12, 16, 24, 32…) | 🟡 unresolved — do not invent a full scale; ship only the 5 confirmed values in v0.1 and extend once a dedicated spacing pull happens |

---

## 6. Radius

**This is the audit's #1 Critical finding.** Two parallel systems (`radius/custom/*` and `radius/border_radius_*`) collide on value, not just name.

**Canonical format:** `radius.{semantic-step}`, semantic steps assigned **by confirmed numeric value**, ascending — not inherited from either legacy name, since both legacy naming schemes are internally inconsistent.

| Canonical | Value | Confirmed from | Status |
|---|---|---|---|
| `radius.xs` | 6 | `custom/xs`, `border_radius_xs` (both agree) | ✅ 🔗 safe alias |
| `radius.sm` | 8 | `border_radius_sm` | ✅ 🔗 safe alias |
| `radius.md` | 10 | `custom/md` **and** `border_radius_sm_2` | ⚠️ **breaking** — `border_radius_sm_2` is renamed to `md`, despite its "sm_2" legacy name suggesting it's a small-radius variant |
| `radius.lg` | 12 | `custom/lg` **and** `border_radius_md` | ⚠️ **breaking** — anything currently called `border_radius_md` (=12) is *not* the same as `custom/md` (=10); it is renamed to `lg` |
| `radius.xl` | 16 | `custom/xl` **and** `border_radius_lg` | 🔗 safe alias (both legacy names already agree on 16, just named differently) |
| `radius.2xl` | 20 | `border_radius_xl` | ✅ 🔗 safe alias |
| `radius.3xl` | 24 | `border_radius_xxl` (Date Picker) | ✅ 🔗 safe alias |
| `radius.4xl` | 28 | `border_radius_2xl` (Modal) | ✅ 🔗 safe alias |
| `radius.track` | 100 | `border_radius_100` (Toggle) | ✅ kept as its own one-off token, not folded into the main scale — it's used for one large-track control, not a general step |
| `radius.full` | 1000 | `border_radius_round` (Avatar, Chip, pills) | ✅ 🔗 safe alias |

⚠️ **Breaking decision required:** approve that `custom/*` value-rank wins over `border_radius_*` name-rank wherever they disagree (i.e., "md" and "lg" change meaning for anyone currently reading Figma dev handoff labels literally). This directly implements the plan's §11 recommendation to pick `custom/*` as the more complete/better-scaled system.

---

## 7. Elevation

**Canonical format:** `elevation.e{1-6}` — kept as literal level numbers (no semantic rename), since the audit confirms these are already a clean, fully-resolved additive scale.

| Level | Status |
|---|---|
| `e1` (Table) | ✅ confirmed (resolved last, completes the set) |
| `e2` (2-layer: 3/1 offset) | ✅ confirmed |
| `e3` (Tooltip, 3-layer: 24/3/1) | ✅ confirmed |
| `e4` (Date Picker, 4-layer: 32/6/3/1) | ✅ confirmed — **breaks the additive-stacking pattern** (drops e3's 24, introduces 32 & 6); ship as-is, do not "fix" to fit the pattern — it's the real value |
| `e5` (Button Group/Input, 5-layer: 56/32/6/3/1) | ✅ confirmed |
| `e6` (Modal/Toast, 6-layer: 64/32/12/6/3/1) | ✅ confirmed |

All six use a single shadow color, `#0000000a` (3.9% black) — ship as `elevation.color` (✅ confirmed, one constant, no ramp needed).

---

## 8. Gradients

**Canonical format:** `color.gradient.g{1-6}`.

🟡 **All 6 unresolved.** `Gradient/G1`–`G6` never resolved (empty string) in any of the 27 audits. **Decision:** ship the 6 keys in the type shape (so the API surface is stable for future population) with `value: null` and a `resolved: false` flag — do not fabricate stop colors, positions, or angles. Consumers must treat `null` as "do not use in production."

---

## 9. Subject colors

**Canonical format:** `color.subject.{slug}.{main|dark|light}`.

✅ **5 confirmed triads (15 values):** Bangladesh & Global Studies, General Knowledge, Spoken English, Practical AI, Quarter Final Exam.

🟡 **~30 unresolved subjects.** Their slugs/names were never extracted from Figma in these 27 audits — this is not a placeholder-value problem, it's a placeholder-*existence* problem (we don't know what to name the keys). **Decision:** ship only the 5 confirmed subjects in v0.1; do not stub 30 empty slugs with guessed names. A follow-up Figma pull is required before this category can be more than a stub.

---

## 10. Focus rings

**Canonical format:** `focus.{role}` (primary, secondary, success, danger, gray), all sharing one ring geometry (0-blur, 3px spread).

| Canonical | Status |
|---|---|
| `focus.primary`, `focus.secondary`, `focus.success` | ✅ confirmed, `_alpha_24` pattern, correct color family each |
| `focus.gray` | ✅ confirmed, but **intentionally breaks the alpha convention** — binds to plain opaque `outline/Gray 300` (no alpha, no `/500` reference). Ship as-is; this is a real, confirmed deviation, not a bug to fix. |
| `focus.danger` | ⚠️ **Confirmed bug, breaking fix required.** Currently binds to `Color/Secondary/500_alpha_24` instead of a danger-derived color — reproduced independently in Special Effects, live Button bindings, and live Input bindings (3 independent confirmations). **Decision: remap to `color.danger.500.alpha-24`**, matching the pattern of the other four rings. This changes the rendered color of every danger-state focus ring in the system — flagging for explicit approval since it's a visible behavior change, not just a naming cleanup. |

---

## 11. Selection-state terminology

**The single most significant naming inconsistency in the whole audit:** four different vocabularies for "is this thing selected/on" — `checked`/`unchecked` (Checkbox), `active`/`inactive` (Radio), `switch_ON`/`switch_OFF` (Toggle), `selected`/`unselected` (Chip, as a `type` not `state`), plus `active_primary_accent` used inconsistently as either a `state` (List) or a `type` (Switcher) for a *different* concept (row/nav emphasis, not binary selection).

⚠️ **Breaking decision — adopt a two-vocabulary split, not one universal word,** because the audit shows these aren't actually the same concept everywhere:

**A. Form-control selection** (binary, user-toggleable): canonical = `checked` / `unchecked`.
| Current | Canonical | Status |
|---|---|---|
| Checkbox `checked`/`unchecked` | unchanged | 🔗 already canonical |
| Radio `active`/`inactive` | → `checked`/`unchecked` | ⚠️ breaking rename |
| Toggle `switch_ON`/`switch_OFF` | → `checked`/`unchecked` | ⚠️ breaking rename |
| Chip `selected`/`unselected` (as `type`) | → `checked`/`unchecked` (as `state`, moved off `type`) | ⚠️ breaking — also relocates the prop from `type` to `state` |

**B. Navigation/row emphasis** (not a form value, a visual "which item is highlighted" state): canonical = `active` / `inactive`.
| Current | Canonical | Status |
|---|---|---|
| Switcher/Sidebar/TopNav/TabNav `active_*` type values | → `active` (with the existing sub-variant, e.g. `active-primary-accent`, kept as a *style* modifier, not a separate vocabulary) | 🔗 mostly a rename, not a behavior change |
| List `state=active_primary_accent` | 🟡 flagged, not remapped yet — audit found the fill is plain gray, not primary-branded, i.e. the name doesn't match the visual. **Decision: do not alias this until the Figma name/visual mismatch is fixed at the source** — ship List's row-highlight state under a neutral placeholder name (`emphasis`) rather than propagating a misleading name into code. |

---

## Summary

### Canonical naming rules
1. Dot-delimited, lowercase-kebab segments: `category.subcategory.step` (e.g. `color.primary.500`, `radius.lg`, `focus.danger`).
2. Radius/spacing/elevation steps are named by **rank of confirmed value**, never inherited unmodified from a legacy Figma label that's been shown to be inconsistent.
3. Opacity/alpha is expressed as a `.alpha-{percentage}` suffix — one convention, no exceptions, semantic "surface/emphasis" roles are a separate category and are not coerced into this suffix.
4. Selection state uses **two** vocabularies by domain — `checked`/`unchecked` for form controls, `active`/`inactive` for navigation/row emphasis — not one universal term, because the audit shows they aren't the same concept.
5. Nothing is renamed to "fix" a value that's simply unresolved — unresolved stays unresolved (`null` + `resolved: false`), never interpolated or guessed.

### Counts
- **Confirmed token definitions:** ≈85 (11 color ramps, 2 opacity endpoints, 15 subject-color values, 10 radius values, 6 elevation levels, 5 focus rings [4 correct + 1 confirmed-but-wrong], 5 spacing values, 3 shared effect mechanisms, ~19 typography items [family, tracking, weight, 15 scale steps, confirmed composites])
- **Unresolved (placeholder) tokens:** ≈64 entities (6 gradients, ~30 subject colors, ~20 black/white opacity mid-steps + white endpoints, 3 typography composites, 2 special outlines, 1 partially-resolved button effect, plus the List `active_primary_accent` naming gap)
- **Breaking decisions requiring your approval:** 5
  1. `focus.danger` remap to the danger ramp (visible color change)
  2. Radius rank-based renaming where `custom/*` and `border_radius_*` disagree (`md`/`lg` change meaning)
  3. Two-vocabulary selection-state split, retiring `active`/`inactive` (Radio), `switch_ON`/`switch_OFF` (Toggle), and `selected`/`unselected`-as-`type` (Chip)
  4. Black/white opacity tokens renamed from step-number-based to percentage-based keys
  5. Alpha convention consolidation onto `_alpha_{12|20|24}`, retiring Alert's bare `_alpha` and the `outline/Black *` / `neutral_transparent_Black/*` naming

### Exact first token implementation task
Implement **`packages/tokens/src/color.ts`, `radius.ts`, `elevation.ts`** first (the three categories with zero open naming ambiguity left after this doc: color ramps + the resolved radius rank table + the six elevation levels) — populate `tokens.color`, `tokens.radius`, `tokens.elevation` in the existing placeholder shape (`packages/tokens/src/index.ts`) with the ✅ confirmed values above, leaving `typography`, `spacing`, gradients, and subject colors as explicitly-typed but partially-`null` for a fast, honest v0.1. Do not touch `focus.danger` or the selection-vocabulary rename until the 5 breaking decisions above are explicitly approved.
