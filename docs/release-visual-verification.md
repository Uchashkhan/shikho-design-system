# Release Visual Verification — @shikho/ui v0.1.0

**Date:** 2026-08-09
**Figma source:** file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
**Verification method:** live Figma MCP (`get_metadata`, `get_design_context`, `get_screenshot`) against current `packages/ui` source.
**Scope:** tiered. Full live-Figma deep verification of the families with no prior deep audit and of all flagged-incomplete items; remaining families were **not** re-verified in this pass and are labelled accordingly.

> **Reading rule:** a family is only marked 🟢 if it was re-verified against live Figma **in this pass**. A prior `status: "deep-audited"` label in `docs.meta.ts`, or a prior rebuild commit, is **not** treated as evidence. Nothing in this document inherits trust from an earlier label.

---

## 🔧 Repair status — P0 COMPLETE (v0.1.0 repair pass)

| P0 item | Result |
|---|---|
| Remove `Placeholder` from public exports | ✅ Done — export removed, `Placeholder.tsx`/test/story deleted |
| Rebuild Avatar | ✅ Done — gradients, per-size typography, per-size status/verification |
| Rebuild List | ✅ Done — per-state visuals, md metrics, composes real `Tags` |
| Resolve DigitField | ✅ Done — **removed from public API** (no confirmed Figma structure) |

**Avatar** — corrected against live Figma this pass: `type=text` now renders the confirmed primary
gradient (`#85a4ff`→`#5468ff`) with `white/900` initials, `type=icon` the secondary gradient
(`#ea42b2`→`#e2008d`) with a half-box glyph slot carrying `elevation/e2`. A newly-sampled per-size
table replaces the previous single-value constants — status dot (6/8/10/12/14px), status border
(2/2/3/3/3px), verification tick (8/10/12/14/18px) and initials (11/12/13/13/22px) all vary by size,
which the earlier verification pass had not caught.
Still outstanding → **P1**: `avatar_face` (12 variants) and `avatar_group` (5 variants) remain
unimplemented; neither has ever been structurally sampled, so building them would mean inventing
values. The real `type=icon` glyph asset also remains a consumer slot.

**List** — all three states are now confirmed distinct and implemented as such:

| | row fill | main text | nested Tag |
|---|---|---|---|
| `default` | none | `gray-700` | `secondary` |
| `hover` | `gray-100` | `gray-950` | `tertiary` |
| `active_primary_accent` | `gray-200` | `gray-950` | `tertiary` |

Also corrected: padding 12px → **8px**, `leadItemLg` 36 → **32px**, side icons 24 → **20px** (now
with the `drop-shadow` filter), trailing group padding 4px → **2px**. The inline tag markup is
replaced by real `Tags` composition, so Tags fixes now propagate.
Still outstanding → **P1**: `lg`/`xl` internal padding/gap/icon deltas were never sampled; both
still render `md`'s confirmed metrics rather than invented values.

**DigitField** — Figma contains only a single bare instance with no variant set, properties, or
internal structure, so no faithful implementation is possible. Removed from the public API rather
than shipping a container-only placeholder as if it were audited. Consumers compose `DigitInput`
directly. Excluded from v0.1.0.

---

## 🔧 Repair status — P1 batch 1 (size-axis defect class) — 5 of 5 REPAIRED

The shared "one size sampled → all sizes assumed" defect class is now closed for all five
components in this batch. Every row below was confirmed by a live `get_design_context` sample of
that specific size; no value was carried across sizes unless Figma confirmed it identical.

### SidebarItem — was lg-only

| size | height | padding | radius | text | right icon |
|---|---|---|---|---|---|
| md | 40 | `px-12 py-8` | 10 | 13/20 | 20 |
| lg | 48 | 12 | 12 | 13/20 | 24 |
| xl | 56 | 16 | 12 | **18/24** | 24 |

Left icon confirmed **22px at every size** — kept shared, not invented per-size.

### TabNavItem — was md-only

| size | gap | padding | font |
|---|---|---|---|
| xs | 4 | `pt-2 pb-8` | 11/16 |
| sm | 6 | `pt-4 pb-8` | 12/16 |
| md | 8 | `pt-4 pb-12` | 13/20 |
| lg | 8 | `pt-6 pb-16` | 13/20 |
| xl | 12 | `pt-8 pb-20` | 18/24 |

Icon sizes (14/16/18/20/24) were already a correct per-size record — left untouched.

### Chip — was md-only

| size | height | padding | gap | icon | font |
|---|---|---|---|---|---|
| sm | 24 | `px-6 py-4` | 0 | 14 | 11/16 |
| md | 32 | `p-8` | 2 | 16 | 12/16 |
| lg | 40 | `px-12 py-8` | 4 | 18 | 13/20 |

### CheckboxLabel — was md-only

| size | label |
|---|---|
| sm | 12/16 **Medium 500** |
| md | 13/20 Regular 400 |

Caption confirmed **identical at both sizes** (12/16 Medium 500) — kept shared.

### Field `type="textarea"` — was md-only

| size | height | padding | radius | gap | image | resizer |
|---|---|---|---|---|---|---|
| sm | 72 | `p-8` | 8 | 8 | 16 | 20 |
| md | 96 | `px-12 py-8` | 10 | 8 | 24 | 20 |
| lg | 104 | `px-16 py-12` | **16** | 12 | 24 | 20 |
| xl | 128 | `p-16` | **16** | 16 | **32** | 24 |

Sampling revealed the drift was wider than the verification report recorded: **radius, gap, image
size and resizer size also vary per size**, not just padding.

### Not completed in this batch

| Item | Why |
|---|---|
| Field `type="advanced_with_buttons"` | Its 4 size variants were never sampled; deferred rather than assumed |
| Avatar `avatar_face` / `avatar_group` | Structure still unsampled — building them would mean inventing |
| List `lg` / `xl` internal deltas | Not sampled; both still render md's confirmed metrics |

---

## 🔧 Repair status — P1 batch 2 (structural gaps) — 2 of 3 CLOSED

### Avatar — RESOLVED (one built, one correctly excluded)

**`avatar_face` — NOT a component. Excluded from v0.1.0 by evidence, not by deferral.**
Figma's own component description for the set reads verbatim:
> "You can export these and use them as fills in the Avatar component."

All 12 variants are fixed 160×160 frames containing a gradient plus a raster PNG illustration.
There is no size axis, no state, no status/verification, no interactive behaviour. They are
**design assets**, consumed as `<Avatar type="image" src={…} />`. Building a React component for
them would be wrong, not merely premature. What remains is an asset-pipeline task (export 12 PNGs),
not a component task.

**`avatar_group` — IMPLEMENTED.** Confirmed via `get_metadata` on all five variants plus
`get_design_context` on `md`. Each variant lays 7 `avatar` instances at a fixed step:

| size | avatar box | step | overlap |
|---|---|---|---|
| xs | 24 | 16 | 8 |
| sm | 32 | 24 | 8 |
| md | 40 | 28 | 12 |
| lg | 48 | 32 | 16 |
| xl | 64 | 44 | 20 |

The `md` row is independently corroborated by `get_design_context` rendering an explicit
`mr-[-12px]`. The group contributes exactly three things over a bare Avatar — the per-size
negative-margin overlap, a 1px `white-88` ring on each avatar, and an optional trailing `+N`
counter (`gray-100` fill, `gray-950` label). It **composes the real `Avatar`** and reads its box
size from `AVATAR_SIZE_METRICS`, so the two cannot drift.

### List — RESOLVED (lg and xl sampled)

| size | padding | leadItemLg | side icon | main text | description | trail pad |
|---|---|---|---|---|---|---|
| md | 8 | 32 | 20 | 13/20 | 12/16 | 2 |
| lg | 12 | 36 | 24 | 13/20 | 12/16 | 4 |
| xl | 16 | 40 | 24 | **18/24** | **13/20** | 4 |

Root gap (12px), the `leadItem` slot (24px) and the nested Tag (always Tags' own `md`) are
confirmed identical at all three sizes and stay shared.

**Worth recording:** the pre-repair constants (12px padding, 36px leadItemLg, 24px icons, 4px
trail) were `lg`'s values all along — the original audit sampled `lg`. The P0 pass corrected them
to `md`'s confirmed values and applied those to every size, which fixed md while breaking lg/xl.
This table is the first time all three rows are independently correct.

### Field `type="advanced_with_buttons"` — RESOLVED (all four sizes sampled)

| property | sm | md | lg | xl |
|---|---|---|---|---|
| root height | 32 | 40 | 48 | 56 |
| root radius | 8 | 10 | 12 | 16 |
| root `pr` | 4 | 4 | 4 | 4 |
| lead gap | 4 | 6 | 8 | 8 |
| lead padding | `px-8 py-0` | `px-12 py-8` | `p-12` | `p-16` |
| lead radius (L / R) | 8 / 8 | 10 / 10 | 12 / 12 | **16 / 12** |
| lead icon | 16 | 20 | 22 | 28 |
| text `px` | 8 | 8 | 12 | 16 |
| trail `pr` | 4 | 4 | 8 | 12 |
| trail / field icon | 16 | 18 | 20 | 24 |
| typography | 12/16 | 13/20 | 13/20 | 18/24 |
| **shortcut button** | `new_pink` **xs** | **sm** | **md** | **lg** |

**Confirmed composition, not invention:** the shortcut button is a genuine `new_pink` Primary
instance **one size below the field** at every size — height, padding, radius and typography all
match `NewPinkButton`'s own scale exactly (sm→xs 24/`px-6 py-4`/r6/11-16; md→sm 32/`p-8`/r8/12-16;
lg→md 40/`px-12 py-8`/r10/13-20; xl→lg 48/`px-16 py-12`/r12/13-20). No new Button variant was
created.

**Only `xl` has genuinely asymmetric lead corners** (left `custom/xl` 16, right `border_radius_md`
12). sm/md/lg are symmetric despite Figma using two different token *names* per side — a naming
artefact, not a visual difference.

Confirmed identical at all four sizes and therefore kept as shared constants: root `pr-4`, lead
border `outline/gray-100`, lead fill `smoke_base`, trail gap `spacing/8`, button-group gap
`spacing/4`, button fill `secondary/500`.

---

## 🔧 Repair status — P1 batch 3 (one-off fixes) — P1 COMPLETE

| # | Item | Result |
|---|---|---|
| 1 | Switcher radius / gap / xs typography | ✅ Fixed — radius 12→**10**, gap 8→**6**, xs 12px→**11px** |
| 2 | Modal actions padding | ⚠️ **No change needed — the recorded defect was an error** |
| 3 | Pagination icon-button padding | ✅ Fixed — 6px→**8px** |
| 4 | Progress handle | ✅ Rebuilt from the real vector source |
| 5 | DatePicker nav button width | ✅ Fixed — 40→**42px** |
| 6 | TopNavItem `text_wrap` padding | ✅ Fixed — 4px→**6px** |
| 7 | Alert Dismiss button border | ✅ Fixed — added 1px `outline/black-50` |

### Correction: Modal actions padding was never a defect

The original finding recorded the implementation value as `0.5rem 1.5rem`. That value belongs to
the **body** block, not `modal_actions` — the finding misattributed it. Re-checking both branches
against Figma:

| type | Figma | Implementation | Verdict |
|---|---|---|---|
| default | `pt-16 px-32`, `border-t gray-100` | `1rem 2rem 0` + `pb 2rem`, `borderTop gray-100` | ✅ already correct |
| confirmation | `pt-16 px-24`, **`border-0`** | `1rem 1.5rem 1.5rem`, no top border | ✅ already correct |

The confirmation variant's `modal_actions` (`66086:36938`) was sampled for the first time here and
confirms `px-24` **and no top border** — both already implemented. The trailing bottom space in
each variant lives on the modal shell in Figma (default 32px, confirmation 24px), which the
implementation reproduces as the wrapper's own `padding-bottom`. **No code was changed.**

### Progress handle — rebuilt from the exported vector, not approximated

Downloading the real `dot` asset (17×18.5 canvas) yields:

```svg
<circle cx="8.5" cy="7" r="7" fill="#85A4FF"/>   <!-- + 2 baked drop-shadow layers -->
```

with filter layers `dy=3 / stdDeviation=1.5 / erode=1.5` and `dy=1 / stdDeviation=0.5 / erode=0.5`,
both at 4% black — precisely `elevation/e2` expressed as an SVG filter.

So the confirmed handle is a **14px circle filled `primary_med_em` (#85a4ff → `primary[400]`)**
carrying the e2 filter. The pre-repair code used **`primary[300]`** — its own comment admitted
this was "derived — closest confirmed ramp member" — plus an invented
`0 1px 3px rgba(0,0,0,0.16)` **box**-shadow, which drew a bounding-box shadow rather than one
following the circle. Both are now exact. Since the vector proves the asset *is* a circle plus a
standard e2 filter, expressing it as a token-driven circle with the library's existing e2
filter chain is byte-equivalent in rendering — not an approximation — and avoids adding a binary
asset to a package with no asset pipeline.

### Alert Dismiss button

Added only the confirmed 1px `outline/black-50` border. The button's outer drop-shadow /
`secondary_button_effect` inset **remains unresolved** and was deliberately left untouched.

---

## 🔧 Repair status — P2 batch 1 (deterministic items)

### 1. ButtonGroup icon shadow — ✅ FIXED

`elevation/e2` is now applied as a CSS `filter: drop-shadow()` chain instead of a `boxShadow`,
so the shadow follows the glyph silhouette rather than drawing a rectangle around the slot's
bounding box. This was the last surviving instance of the bug Chip's re-audit fixed and that
Link, Tags, Switcher, Pagination and Modal already had right. All other ButtonGroup visuals and
its public API are untouched.

### 2. Button per-family size narrowing — ✅ ALREADY CORRECT (verified, no change needed)

Both scales were re-confirmed directly via `get_metadata`, not taken from the audit doc:

| Scale | Sizes | Verified on | Families |
|---|---|---|---|
| A | xs, sm, md, lg, **xl** | `button_danger` (`66050:6995`) | button_danger, button_success, Greyscale, icon_button |
| B | xs, sm, md, lg, **xxl** | `new_blue` (`66050:8479`) | new_blue, new_pink, ai_rounded, ai_regular |

| Family | Figma sizes | Public type | Accepts | Invalid removed |
|---|---|---|---|---|
| new_blue | xs sm md lg xxl | `ButtonSizeScaleB` | ✅ exact | none — already correct |
| new_pink | xs sm md lg xxl | `ButtonSizeScaleB` | ✅ exact | none |
| ai_rounded | xs sm md lg xxl | `ButtonSizeScaleB` | ✅ exact | none |
| ai_regular | xs sm md lg xxl | `ButtonSizeScaleB` | ✅ exact | none |
| button_success | xs sm md lg xl | `ButtonSizeScaleA` | ✅ exact | none |
| button_danger | xs sm md lg xl | `ButtonSizeScaleA` | ✅ exact | none |
| Greyscale | xs sm md lg xl | `ButtonSizeScaleA` | ✅ exact | none |
| icon_button | xs sm md lg xl | `ButtonSizeScaleA` | ✅ exact | none |

**Correction to the earlier P2 note.** The backlog recorded *"`new_pink` has no `xl`, but the
shared `SIZE_METRICS` currently also allows `xl`"* — implying a public API leak. There is none.
`SIZE_METRICS` is a module-private record spanning both scales purely so one metrics table can
serve every family; the wide `ButtonSize` union is **not exported** from `components/button/index.ts`,
which exposes only the eight per-family `…Size` aliases. Each already resolves to the correct
scale, so `<NewBlueButton size="xl">` has always been a type error.

This is now locked in by compile-time assertions (`button_sizes.test.tsx`): every invalid
family/size pair carries an `@ts-expect-error`. Because an *unused* `@ts-expect-error` is itself a
compile error, `pnpm typecheck` fails if any union is ever widened to accept a size Figma does not
define.

---

## 🔧 Repair status — P2 batch 2: icon architecture — P2 COMPLETE

### Scope correction

The backlog said "12-family SVG sweep". Only **8** families carry inline SVG in component
source; `chip`, `input`, `table` and `tags` matched the original grep **only in their stories and
tests**, where inline SVG is legitimate placeholder content for consumer-supplied icon slots.

### Classification

| Family | Vector | Category | Outcome |
|---|---|---|---|
| alert | info-circle (real, downloaded) | 1 reusable | → `@shikho/icons` |
| alert | close "X" (real, downloaded) | 1 reusable | → `@shikho/icons` |
| toast | info-circle | 1 reusable | **byte-identical to Alert's** → shared |
| toast | dismiss "X" | 1 reusable | **byte-identical to Alert's** → shared |
| modal | close "X" (hand-drawn stroke) | 1 reusable | → shared; **approximation removed** |
| pagination | chevron-left / right (hand-drawn) | 1 reusable | → shared; **approximation removed** |
| date-picker | chevron-left / right (hand-drawn) | 1 reusable | **duplicated with pagination** → shared |
| checkbox | checkmark (hand-drawn stroke) | 1 reusable | → shared; **approximation removed** |
| toggle | checkmark (real bezier) | 1 reusable | → shared (was already exact) |
| pagination | chevron-down (hand-drawn) | 4 keep local | no confirmed asset downloaded — stays inline |
| tooltip | pointer arrow (real bezier) | **2 structural** | stays local — not an icon |
| checkbox | indeterminate dash | **4 exact as CSS** | an 8×2 rounded span; simpler and exact |
| progress | handle | **4 exact as CSS** | circle + e2 filter, proven equivalent in P1 |
| radio | states | 2 structural | flattened component-specific artwork |
| avatar | `avatar_face` | **3 illustration** | excluded — assets, not icons |

### Icons promoted (5)

`ChevronLeftIcon` · `ChevronRightIcon` · `CloseIcon` · `InfoCircleIcon` · `CheckIcon`

Each keeps its **original viewBox verbatim** — deliberately non-square where Figma's is
(chevrons are `0 0 6.18747 10.6875`). Normalising them to a square canvas would silently rescale
the glyph, so SVG's default `preserveAspectRatio` centres them instead.

**Verified, not assumed:** `chevron-right` was downloaded and compared against `chevron-left` — it
is its own authored path, **not** a mirror transform, so it ships as a separate glyph.

### Package structure

```
packages/icons/src/
├── types.ts          IconProps / IconSize (unchanged)
├── create_icon.tsx   factory: size prop, currentColor, aria-hidden default,
│                     attaches `.definition` so geometry is assertable without a DOM
├── icons/            one file per glyph, each citing its Figma node
└── index.ts          named exports only — tree-shakeable
```

No dependency on `@shikho/ui`; the direction stays `tokens → icons → ui`.

### Remaining approximation debt

1. **`chevron-down`** (pagination dropdown caret) — still hand-drawn. Kept local and labelled
   rather than promoted, because promoting an unverified path into the shared package would
   launder a guess into something that looks confirmed.
2. **Icon coverage is 5 glyphs, not a full library.** `@shikho/icons` is now a real package rather
   than a scaffold, but it holds only the glyphs this sweep could confirm. A complete icon set
   still needs the Figma icon-library audit that has never been run.

---

## Status legend

| Symbol | Meaning |
|---|---|
| 🟢 | Figma verified — re-checked live this pass, no mismatch found |
| 🟡 | Needs visual re-check — either verified-with-gaps, or not re-verified this pass |
| 🔴 | Incorrect / requires rebuild — confirmed mismatch against live Figma |
| ⚪ | Incomplete / placeholder — knowingly unbuilt or partial |

---

## Corrections to the prior baseline

Three factual errors in the earlier state report were found and corrected during this pass:

1. **Family count is 23, not 22.** The `@shikho/ui` barrel exports 23 component modules.
2. **Link and Modal were not "never deep-audited."** `docs/audit/links-deep-audit.md` and `docs/audit/modal-deep-audit.md` both exist. Only **Avatar, ButtonGroup, and List** genuinely lack a deep-audit document.
3. **`Placeholder` (a build-scaffold component) is publicly exported** from `packages/ui/src/index.ts` and would ship in v0.1.0.

---

# Tier A — Deep-verified this pass

## 🔴 Avatar — `components/avatar` — NOT SAFE TO SHIP

**Evidence checked:** `get_metadata` on component set `66063:20907` (all 15 variants); `get_design_context` on `size=md, type=text` (`66063:20934`) and `size=md, type=icon` (`66063:20930`); `docs/audit/avatars.md`; `avatar.tsx`.

**Confirmed correct:**
- Sizes exactly match: xl=64, lg=48, md=40, sm=32, xs=24.
- `type=image` structure (the one variant that *was* deep-audited).
- Status dot: 10px, `bottom/right 0`, fill `surface/success_med_em` #50df3a, 3px `white-72` border.
- Root radius `border_radius_round`.

**Confirmed mismatches (all previously undetected):**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | `type=text` background | **Linear gradient**, `primary_med_em` #85a4ff → `primary_base` #5468ff | Flat `color.gray[200]` | Critical |
| 2 | `type=text` label colour | `white/900` rgba(255,255,255,0.88) | `color.gray[700]` | Critical |
| 3 | `type=icon` background | **Linear gradient**, `secondary_med_em` #ea42b2 → `secondary_base` #e2008d | Flat `color.gray[200]` | Critical |
| 4 | `type=icon` content | Real smiley glyph at `inset-1/4`, with `elevation/e2` drop-shadow | Empty slot, no shadow | High |
| 5 | `md` text size | 13px (`font/size/body_1`), line-height 20px | 12px | Medium |
| 6 | `verification_tick` | Real checkmark SVG asset present in Figma | Empty consumer-supplied slot | Medium |

**Unresolved Figma data:** per-size typography for `type=text` at xs/sm/lg/xl (only `md` verified = 13px, which already contradicts the implemented scale); status-dot scaling across the other four sizes (only `md` ever confirmed, applied uniformly in code).

**Missing sets:** Figma has **three** component sets — `avatar_face` (12 variants) and `avatar_group` (5 variants) are **not implemented at all**. Only `avatar` (15 variants) exists.

**Verdict:** the two gradient fills are the single largest visual defect found in this audit. Avatar renders gray where the design is brand-gradient. **Requires rebuild.**

---

## 🔴 List — `components/list` — NOT SAFE TO SHIP

**Evidence checked:** `get_metadata` on component set `66064:21301` (all 9 variants); `get_design_context` on `size=md, state=default` (`66064:21302`) — a state never previously audited; `docs/audit/list.md`; `list.tsx`.

**Root cause:** the prior audit only ever inspected `lg / active_primary_accent`. The implementation's own comments admit all three sizes and all three states render from that single baseline. Live Figma confirms they are genuinely different.

**Confirmed mismatches:**

| # | Aspect | Figma (confirmed, md/default) | Implementation | Severity |
|---|---|---|---|---|
| 1 | Row background | **No fill** — only a `border-bottom` `outline/gray-100` | `color.gray[200]` fill applied in every state | Critical |
| 2 | Main text colour | `text/gray-700` #5b616d | `color.gray[950]` | High |
| 3 | Tag fill | `color/gray/100` #f4f4f6 | `color.white[950]` (#ffffff) | High |
| 4 | Tag border | **None**; uses `special_drop` inset shadow instead | 1px `black-50` border, no inset shadow | High |
| 5 | Size differentiation | md=52 / lg=60 / xl=76 px heights | All three sizes render identically | High |
| 6 | State differentiation | 3 visually distinct states | All three states render identically | High |
| 7 | `leadItemLg` size | 32px | 36px | Medium |
| 8 | Tag composition | Real nested `tags` instance | Re-implemented inline (duplicated styling) | Architectural |

**Confirmed correct:** root `gap 12px`, `padding 8px`, nested `Checkbox` at `sm/square` (20px container, 16px box, 2px `gray-400` border, `radius xs` 6px), description `12px/16px gray-600`, trail text `13px gray-700`, left/right icons 20px with `elevation/e2`.

**Architecture concern:** List re-implements Tag styling inline rather than composing `Tags`, duplicating visual logic that Tags' own re-audit already corrected once. Any future Tags fix will silently not propagate to List.

**Verdict:** structurally sound, visually wrong in every state and size except the one originally sampled. **Requires rebuild.**

---

## 🟡 ButtonGroup — `components/button-group` — SHIPPABLE WITH KNOWN GAPS

**Evidence checked:** `get_screenshot` and `get_design_context` on `size=xs, count=3` (`66053:13562`); `docs/audit/button-group.md`; `button_group.tsx`.

**Confirmed correct** (more accurate than expected): segment fill `color/secondary/500` #e2008d ✅, label `text/white-950` ✅, border `outline/black-50` ✅, `radius/custom/xs` 6px on outer corners only ✅, middle segments top/bottom border only ✅, `gap 0` ✅, xs padding `px-6 py-4` ✅, typography `11px/16px SemiBold` ✅, icon 14px ✅, label wrapper `px-4` ✅, `inline-flex` hug + `items-start` ✅.

**Confirmed gaps:**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | Icon shadow technique | `drop-shadow` **filter** (follows glyph silhouette) | `boxShadow` (draws a rectangle) | High |
| 2 | Per-segment outer shadow | `0 1px 1px -0.5px black-50` | Absent | Medium |
| 3 | `secondary_button_effect` | Confirmed inner-shadow overlay present | Knowingly omitted (no effects token category) | Medium |
| 4 | Explicit height | `h-24px` at xs | Height derived from padding only | Low |

> **Note:** gap #1 is the *exact* bug Chip's re-audit already identified and fixed (`boxShadow` → `drop-shadow` filter). It was never propagated to ButtonGroup — evidence the fix was applied per-component rather than swept across the library.

**Unresolved Figma data:** only `xs` was ever deep-audited. Padding for **sm/md/lg/xl is derived** from the standalone Button family, not confirmed. 4 of 5 sizes remain unverified.

**Verdict:** core construction is correct. Ship only if the icon-shadow bug is accepted as known debt.

---

## 🟢 Link — `components/link` — SAFE TO SHIP

**Evidence checked:** `get_design_context` on `xl/primary/default` (`66080:30611`) and `xl/quaternary/default` (`66080:30599`) — covering both `type` values; `docs/audit/links-deep-audit.md`; `link.tsx`.

**Every checked dimension matched exactly:**

| Aspect | Figma | Implementation |
|---|---|---|
| Root | `flex`, `items-center justify-center`, `padding 0`, `overflow-clip` | ✅ identical |
| Gap (xl) | `spacing/8` = 8px | ✅ `SIZE_CONFIG.xl.gap = 8` |
| Icon size (xl) | 24px | ✅ `iconSize: 24` |
| Typography (xl) | 18px / 24px (`title_2`) | ✅ `fontSize: 18, lineHeight: "24px"` |
| `primary` colour / weight | `text/primary-500` #5468ff, SemiBold 600 | ✅ `color.primary[500]`, 600 |
| `quaternary` colour / weight | `text/gray-700` #5b616d, Medium 500 | ✅ `color.gray[700]`, 500 |
| Icon shadow technique | `drop-shadow` **filter** | ✅ `iconShadowFilter` — correct filter, not `boxShadow` |

**Notes:** Link is the only family verified so far that uses the correct `drop-shadow` filter technique — the bug present in ButtonGroup. Confirmed absence of a `focus` state matches the implementation's documented behaviour.

**Unresolved:** sm/md/lg/xs sizes and the `hover`/`disabled` states were not re-sampled (values are documented in the deep-audit doc and the two sampled variants matched it exactly, raising confidence in the rest).

**Verdict:** 🟢 the only family so far with no mismatch found. Safe to ship.

---

## 🟡 Modal — `components/modal` — SHIPPABLE WITH MINOR FIX

**Evidence checked:** `get_metadata` on `type=default` (`66086:36925`) and `type=confirmation` (`66086:36932`); `get_design_context` on `modal_header` (`66086:36926`) and `modal_actions` (`66086:36931`); `docs/audit/modal-deep-audit.md`; `modal.tsx`.

**Confirmed correct:**
- Shell widths: default **544px**, confirmation **480px** ✅
- **Structural type-branching is right**: `type=confirmation` correctly renders **no header** (Figma confirms body starts at y=0 with a free-floating absolute close button) ✅
- Feature-icon totals: default 40px + 12px padding × 2 = **64px** ✅; confirmation 28px + 10px × 2 = **48px** ✅ — both match Figma exactly
- Header: `px-32 py-24`, `gap 24`, `border-b outline/gray-100`, heading 22px/32px SemiBold `text/gray-950` ✅
- Close button: 32px, `p-8`, `border outline/black-50`, `radius round`, `bg white/950`, 18px icon with correct `drop-shadow` filter ✅
- Actions — Cancel: `px-16 py-12`, `radius custom/lg` 12px, `bg gray/100`, 13px SemiBold `gray-700` ✅
- Actions — Primary: `border outline/black-150`, `bg primary/500`, `text/white-950`, 13px SemiBold ✅

**Confirmed mismatch:**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | `modal_actions` padding | `pt-16 px-32`, **no bottom padding** | `0.5rem 1.5rem` (8px vertical, 24px horizontal) | Minor |

**API gap (not a visual defect):** Figma exposes `modal_header` and `modal_actions` as **separate reusable components** (`modal_header` carries its own usage documentation, node `16120:14507`). The implementation inlines both, so consumers cannot compose a modal from its parts.

**Unresolved Figma data:** body-frame internal padding for both types, shell `radius/4xl`, and the `e5`/`e6` shell-shadow difference by type were not independently re-sampled.

**Verdict:** structurally accurate — notably better than Avatar/List. One padding correction needed.

---

## 🟡 Progress — `components/progress` — SHIPPABLE WITH KNOWN GAP

**Evidence checked:** `get_design_context` on the scrubber `property1=Media` (`64361:4786`) and on `property1=Load More` (`64361:4315`); `docs/audit/progress-deep-audit.md`; `progress.tsx`.

**Confirmed correct:** track height **8px** ✅, track radius `border_radius_sm_2` = 10px ✅ (`radius.md`), track fill `Color/gray` #ebecf0 ✅ (`gray[200]`), progress fill `primary_base` #5468ff ✅ (`primary[500]`) with `radius round` ✅, handle box **14px** ✅.

**Confirmed mismatch:**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | Handle / dot | A real **SVG asset** carrying `elevation/e2`, overflowing its box (`inset 0 -10.71% -32.14% -10.71%`) | Flat `color.primary[300]` circle, no shadow | Medium |

The implementation's own comment already flags `primary[300]` as *"derived — closest confirmed ramp member."* Live Figma confirms the handle is **not a flat coloured circle at all** — it is an exported vector with a drop shadow. The derived colour is therefore not merely approximate, it is the wrong construction.

**Verdict:** track is exact; handle needs the real asset.

---

## 🟡 Pagination — `components/pagination` — SHIPPABLE WITH MINOR FIX
## 🟢 LoadMorePagination — verified exact

**Evidence checked:** `get_design_context` on `page=first` (`66082:32877`) and on the Load More source node (`64361:4315`); `docs/audit/pagination-deep-audit.md`; `pagination.tsx`.

### LoadMorePagination — 🟢 every checked value matched

| Aspect | Figma | Implementation |
|---|---|---|
| Container width / gap | 176px, `gap 12` | ✅ `width: 176`, `gap: 0.75rem` |
| Status gap | `gap 6` | ✅ `0.375rem` |
| Track | h **6px**, `radius round`, `black-12` rgba(0,0,0,0.12) | ✅ exact |
| Fill | h 6px, `outline/primary-300` #bad5ff | ✅ `color.primary[300]` |
| Amount text | 12px/16px SemiBold, `gray-950` / `gray-600` / `primary-500` | ✅ exact tri-colour split |
| Button | h **40px**, `px-12 py-8`, `radius custom/md` 10px, `bg gray/100`, 13px SemiBold `gray-700` | ✅ exact |

This is the single most accurate component verified so far. The Progress/Pagination reconciliation decision is vindicated — the split was correct **and** correctly implemented.

### Pagination (numbered) — 🟡

**Confirmed correct:** page buttons 32×32 ✅, `radius custom/sm` 8px ✅, active button `bg primary/500` + `border outline/black-150` + 12px SemiBold `white-950` ✅, inactive 12px SemiBold `gray-700` ✅, `numbers` gap 4 ✅, `pages` gap 16 ✅, prev/next icon 18px with correct **`drop-shadow` filter** ✅, `go_to_page` label 13px Medium `gray-600` ✅, dropdown field `bg smoke_med` + `input_inner_shadow` ✅.

**Confirmed mismatch:**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | Prev/next icon-button padding | `p-8` (8px) | `0.375rem` (6px) | Minor |

**Unresolved:** whether inactive number buttons carry a `gray/100` background — Figma renders them with **no fill**, the implementation appears to apply `gray[100]`; the surrounding code could not be isolated conclusively within this pass. **Marked unresolved rather than asserted.**

---

## 🟢 Tags — `components/tags` — SAFE TO SHIP

**Variants sampled:** 2 standalone (`md/secondary/hover` `66077:29580`, `md/tertiary/default` `66077:29570`) + 1 nested instance (inside List) + full `get_metadata` on the 99-variant set (`66077:29313`).
**Did the original implementation extrapolate from one variant?** Yes originally — but it was rebuilt twice from fresh multi-instance re-audits.
**Nested vs standalone agreement:** ✅ **agrees.**

### ⚠️ Correction to the previous session's entry

The prior checkpoint claimed *"Tags' nested instance contradicts its standalone implementation (`gray-100` fill, no border)."* **That was my error.** The nested tag inside List is the **`secondary`** type, which the implementation renders as `gray[100]` fill, no border, `gray-700` text — an exact match. I had mistakenly compared it against the `tertiary` type. **There is no contradiction.** Tags' status is upgraded from 🟡 to 🟢.

**Everything sampled matched exactly:**

| Aspect | Figma | Implementation |
|---|---|---|
| Sizes | lg 77×32, md 67×24, sm 35×20 | ✅ heights 32 / 24 / 20 |
| md geometry | `h-24`, `px-6 py-4`, `radius custom/sm` 8px | ✅ exact |
| Typography | 11px/16px SemiBold (`caption_1`) | ✅ exact |
| `secondary` default | `gray/100`, no border, `gray-700` | ✅ exact |
| `secondary` **hover** | `gray/200` #ebecf0 | ✅ **the code's admitted guess was correct** |
| `tertiary` default | `white/950` + `outline/black-50` border | ✅ exact |
| Icons | 14px with **`drop-shadow` filter** | ✅ correct technique |
| `special_drop` inset | `inset 0 1px 3px 0 white/50, inset 0 -1px 3px -2px black-4` | ✅ equivalent (`black[50]` = same rgba) |

**Notable:** the implementation's `secondary` hover was explicitly flagged in code as *"hover not independently sampled — one step darker"*. Live Figma confirms that inference was **right**. Not every derived value in this library is wrong.

**Unresolved:** 96 of 99 variants unsampled (all `sm`/`lg` sizes, `disabled` state, and the 8 other types). Confidence is high but not exhaustive.

---

## 🟡 Switcher — `components/switcher` — CORRECTION NEEDED

**Variants sampled:** `get_metadata` on the `switcher` container set (`66065:22643`, all 5 sizes) + `get_design_context` on `size=xs` (`66065:22644`, which also exposes 6 nested `switcher_item` instances).
**Did the original implementation extrapolate from one variant?** Yes — `switcher.md` deep-audited exactly one instance (`lg/active_primary_accent/hover`).
**Nested vs standalone agreement:** ✅ container heights (32/40/48/56/64) are exactly item heights + 8px, confirming the audit's 4px-padding resolution.

**Confirmed correct:** container `bg color/gray-100` ✅, `border outline/gray-100` ✅, `padding spacing/4` = 4px ✅, item heights per size ✅, icon 14px at xs ✅ with correct **`drop-shadow` filter** ✅, active item `bg smoke_em` white + 2-layer shadow + `gray-950` text ✅, inactive `gray-600` SemiBold ✅.

**Confirmed mismatches:**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | Container radius | `radius/custom/md` = **10px** | `radius.lg` = **12px** | Medium |
| 2 | Container gap | `spacing/6` = **6px** | `0.5rem` = **8px** | Medium |
| 3 | `xs` typography | **11px** (`caption_1`) / 16px | **12px** / 16px | Medium |

All three are visible defects: a 2px radius difference on the container, 2px extra between every segment, and an oversized label at `xs`.

**Unresolved:** `sm`/`md`/`lg`/`xl` container geometry and the full 5-type × 2-state `switcher_item` matrix were not sampled. Given `xs` typography is already wrong, **the other four size rows should be treated as suspect.**

---

## 🟡 DatePicker — `components/date-picker` — SHIPPABLE WITH MINOR FIX

**Variants sampled:** full `get_metadata` on `type=range, size=lg` (`66083:34379`, complete internal tree) + `get_design_context` on a nested `sidebar_item` (`66083:34381`).
**Did the original implementation extrapolate from one variant?** No — the original was an empty placeholder `<div>`; the current version was built from a genuine 4-variant deep audit.
**Assets:** ⚠️ nav chevrons are **hand-drawn inline SVG**, not exported Figma assets.
**Nested vs standalone agreement:** ✅ the inline preset row matches the real `sidebar_item` exactly.

**Confirmed correct** — this component held up well under scrutiny:
- Sidebar width **200px** at lg ✅
- Day cell **48 × 40** ✅ — correctly *non-square*; the implementation uses `width: cellSize, height: 40`, matching Figma rather than assuming a square cell
- `type=range` correctly renders **two side-by-side month panels** with a divider ✅
- Composes real `Field`, `GreyscaleButton`, `NewBlueButton` from `@shikho/ui` ✅
- Preset row: `h-40`, `px-16 py-8`, `radius custom/md` = 10px, 13px/20px Medium `gray-700` — **exact match** to Figma's nested `sidebar_item` ✅

**Confirmed mismatch:**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | Nav (prev/next) button width | **42px** (hug: 18px icon + 12px padding × 2) | Hard-coded `width: 40` | Minor |
| 2 | Nav chevron glyphs | Real exported vector assets | Hand-drawn inline `<svg>` paths | Minor (systemic) |

**Note:** the implementation does **not** compose `SidebarItem` for its preset rows even though Figma uses real `sidebar_item` instances — but unlike List/Tags, the inlined styling is *correct*, so this is an architectural nit, not a visual defect.

---

## 🟡 TabNavigation — `components/tab-navigation` — PER-SIZE CORRECTION NEEDED

**Variants sampled:** full `get_metadata` on the 15-variant set (`66081:32109`, all 5 sizes) + `get_design_context` on `xs/active/default` (`66081:32166`).
**Did the original implementation extrapolate from one variant?** **Yes — and this is the defect.** Padding, gap, and typography are each hard-coded to a single confirmed size and applied to all five.

**Confirmed correct:** heights per size **24/32/40/48/56** ✅ exact; `border-bottom` 2px active indicator with no background fill ✅; no focus state ✅; icon sizes ✅ with correct **`drop-shadow` filter** ✅; `active` text `gray-950` ✅; `inactive` `gray-600` → hover `gray-700` ✅.

**Confirmed mismatches (all at `xs`; 4 of 5 sizes are unverified but almost certainly affected):**

| # | Aspect | Figma `xs` (confirmed) | Implementation (all sizes) | Severity |
|---|---|---|---|---|
| 1 | Typography | **11px / 16px** (`caption_1`) SemiBold | Hard-coded **13px / 20px** | Medium |
| 2 | Gap | `spacing/4` = **4px** | `0.5rem` = **8px** | Medium |
| 3 | Padding | `pt-2 pb-8` px-0 | `pt-4 pb-12` px-0 | Medium |

The code comment reads *"pt-4 pb-12, px-0 — confirmed"* — true for whichever size was sampled, but wrongly generalised to all five.

**Unresolved:** `sm`/`md`/`lg`/`xl` were not sampled. The correct fix is a **per-size table**, not a single-value change; each size's padding/gap/typography must be sampled individually.

**Verdict:** structure, colours, and states are right — the size system is not. Targeted fix, not a rebuild.

---

## ⚠️ Newly identified systemic pattern — "one size confirmed, all sizes assumed"

This is now confirmed in **three** families and is distinct from the earlier "one *variant* extrapolated" pattern:

| Family | Symptom |
|---|---|
| Switcher | Container radius/gap wrong; `xs` typography wrong |
| TabNavigation | Padding, gap, **and** typography wrong at `xs` |
| ButtonGroup | Padding derived for 4 of 5 sizes (unverified) |

**All three are multi-size nav/control components whose audits deep-sampled exactly one size.** Any family with a `size` axis and a single-value (rather than per-size) constant table should be treated as suspect. **SidebarNavigation and TopNavigation share this exact profile and audit lineage — they are the highest-probability remaining defects.**

---

## 🔴 SidebarNavigation — `components/sidebar-navigation` — NOT SAFE TO SHIP

**Variants sampled:** full `get_metadata` on the 36-variant set (`66068:24447`, 3 sizes × 6 types × 2 states) + `get_design_context` on **two different sizes** — `md/inactive/default` (`66068:24498`) and `xl/inactive/default` (`66068:24618`).
**Did the original implementation extrapolate?** **Yes — pattern B, confirmed.** The audit deep-sampled only `size=lg`; the implementation applies lg's values to all three sizes.
**Nested vs standalone:** ✅ nested `tags` instance matches Tags' `secondary` type.

### Per-size comparison table (the new required format)

| Property | Figma **md** | Figma **xl** | Implementation (all sizes) | Verdict |
|---|---|---|---|---|
| Height | 40px | 56px | per-size (40/48/56) | ✅ |
| Padding | `px-12 py-8` | `p-16` (16px) | `0.75rem` (12px uniform) | 🔴 **both wrong** |
| Radius | `custom/md` = **10px** | `custom/lg` = **12px** | `radius.lg` = 12px | 🔴 **md wrong** |
| Typography | 13px/20px (`body_1`) | **18px/24px** (`title_2`) | hard-coded 13px/20px | 🔴 **xl badly wrong** |
| Gap | 12px | 12px | 12px | ✅ |
| Left icon | 22px | 22px | 22px | ✅ |
| Right icon | **20px** | **24px** | 24px | 🔴 **md wrong** |

**Severity:** the `xl` label rendering at **13px instead of 18px** is a major, immediately visible defect — roughly a third too small. Padding is wrong at *both* sampled sizes.

**Diagnosis:** the implementation's constants are exactly `lg`'s values (radius 12px, right icon 24px, 13/20 type). This is textbook pattern B — and unlike TabNavigation, it affects **2 of 3 sizes across 4 properties**.

**Unresolved:** `lg` itself was not re-sampled (it is presumed correct as the original audit source). The 6-type × 2-state colour matrix was not re-verified.

**Verdict:** requires a real per-size table — closer to a rebuild than a patch. **Upgraded from 🟡 to 🔴.**

---

## 🟡 TopNavigation — `components/top-navigation` — SHIPPABLE WITH ONE MINOR FIX

**Variants sampled:** full `get_metadata` on the 99-variant set (`66081:31190`, 5 sizes × 7 types × up to 3 states) + `get_design_context` on `xl/inactive/default` (`66081:31281`).
**Did the original implementation extrapolate?** **No — this family did it correctly.** It carries genuine per-size `RADIUS`, `GAP`, `PADDING`, `ICON_SIZE`, and `TYPOGRAPHY` records.

### Per-size verification at `xl`

| Property | Figma `xl` | Implementation | Verdict |
|---|---|---|---|
| Height | 56px | `HEIGHT.xl = 56` | ✅ |
| Padding | `p-16` | `PADDING.xl = "1rem"` | ✅ |
| Radius | `custom/xl` = 16px | `RADIUS.xl = radius.xl` = 16px | ✅ |
| Gap | `spacing/6` = 6px | `GAP.xl = 6` | ✅ |
| Icon size | 24px | `ICON_SIZE.xl = 24` | ✅ |
| Typography | **18px/24px** SemiBold | `TYPOGRAPHY.xl = 18/24`, weight 600 | ✅ |
| `inactive` colour | `text/gray-600` | ✅ | ✅ |
| Icon shadow | `drop-shadow` filter | ✅ correct filter | ✅ |

**Confirmed structural correctness:** 7 types ✅, and `focus` state present **only** on `active_*` types (absent on `inactive`/`inactive_outline`) ✅ — matching the audit's documented finding.

**Confirmed mismatch:**

| # | Aspect | Figma | Implementation | Severity |
|---|---|---|---|---|
| 1 | `text_wrap` horizontal padding | `px-6` = **6px** | `0 0.25rem` = **4px** | Minor |

**Unresolved:** xs/sm/md/lg rows of the per-size table were not individually sampled; given `xl` matched on all six properties, confidence in the table is high.

**Verdict:** the best-engineered multi-size component verified so far. One 2px padding fix.

---

## ✅ The size-table predictor is now validated in both directions

Before opening Figma, a single grep distinguished these two families:

| Family | Constants shape | Predicted | Actual |
|---|---|---|---|
| SidebarNavigation | `HEIGHT` per-size, but `gap`/`padding`/`fontSize` **single constants** | high risk | 🔴 **4 properties wrong across 2 of 3 sizes** |
| TopNavigation | **Full per-size records** for all 6 properties | low risk | 🟡 one 2px nit |

**This grep is now the cheapest and most reliable triage available** — it correctly predicted defects in Switcher, TabNavigation, and SidebarNavigation, and correctly predicted cleanliness in TopNavigation. Apply it before any further Figma sampling.

**Predictor status for the remaining unverified families** (from the same grep):
- **Toggle** — per-size `boxSizePx` / `trackSizePx` / `knobSizePx` records → *low risk*
- **Radio** — per-size `outerSizePx` / `innerSizePx` / `dotSizePx` records → *low risk*
- **Checkbox** — per-size `outerSizePx` / `boxSizePx`; but `CheckboxLabel` hard-codes 13px with **no size axis** → *label needs checking*

---

## 🟢 Toast — `components/toast` — SAFE TO SHIP

**Variants sampled:** `get_metadata` on the full 5-severity set (`66074:28507`) + `get_design_context` on `state=warning` (`66074:28544`) — deliberately **not** the severity the original audit used (`danger`).
**Pattern A risk?** Addressed — the implementation carries per-severity `Record`s, and the re-audit covered all 5.
**Pattern B risk?** N/A — Toast has no size axis (`state` is its only property).
**Flagged risk point:** the code comments admit the root gap was *"derived reuse of alert's confirmed spacing/16... documented as unconfirmed for toast specifically."*

**Everything sampled matched exactly — including the admitted guess:**

| Aspect | Figma `warning` | Implementation |
|---|---|---|
| Root gap | `spacing/16` = 16px | ✅ **the "unconfirmed" derivation was correct** |
| Padding | `pt-12 pb-16 px-16` (asymmetric) | ✅ exact |
| Alignment | `items-center` | ✅ (correctly different from Alert's `items-start`) |
| Radius | `border_radius_xl` = 20px | ✅ `radius["2xl"]` = 20 |
| Shadow | `elevation/e6` (6 layers) | ✅ |
| Border | `outline/warning_alpha` rgba(252,191,4,0.24) | ✅ `warning[500]` + `3d` alpha = 24% |
| Heading | 15px/24px SemiBold `gray-950` | ✅ exact |
| Description | 13px/20px **Regular 400** `gray-600` | ✅ exact |
| Action button | `h-40`, `px-12 py-8`, `radius custom/md` 10px, `bg gray/100`, 13px SemiBold `gray-700` | ✅ exact — **confirms the plain-neutral-button-for-warning claim** |
| Close button | 32px, `radius custom/sm` 8px, **no background fill**, 18px icon | ✅ `radius.sm`, `backgroundColor: transparent` |
| Feature icon | `radius custom/lg` = 12px | ✅ `radius.lg` |

**Notable:** the per-severity button-treatment finding holds — `warning` genuinely uses a plain neutral button, distinct from `danger`/`success`'s tinted composition. The severity re-audit that produced this was thorough.

**Unresolved:** `default`/`danger`/`success`/`info` were not re-sampled this pass.

---

## 🟡 Alert — `components/alert` — SHIPPABLE WITH ONE MINOR FIX

**Variants sampled:** `get_metadata` on the full 5-severity set (`66071:28125`) + `get_design_context` on `state=success` (`66071:28150`) — again deliberately not the original `danger` source.
**Pattern A risk?** Addressed — per-severity `Record`s present.
**Pattern B risk?** N/A — no size axis.

**Confirmed correct:**
- Root: `p-24` uniform ✅, `gap-16` ✅, **`items-start`** ✅ (correctly different from Toast's `items-center`), `bg smoke_base` ✅, `border outline/success_alpha` rgba(53,194,32,0.24) ✅, `radius border_radius_xl` 20px ✅, **`elevation/e5`** ✅ (correctly *not* Toast's e6)
- Heading 15px/24px SemiBold `gray-950` ✅
- Description 13px/20px Regular 400 **`gray-700`** ✅ — correctly **different from Toast's `gray-600`**, a genuinely subtle distinction the implementation got right
- **Primary action composes the real `ButtonSuccess` at `type="Secondary"`** ✅ — Figma's node is literally named `button_success/md/secondary/default`, confirming the nested-dependency claim exactly
- **Second "Dismiss" button is present** (inline), `bg secondary/500` #e2008d ✅, `text/white-950` ✅, `px-12 py-8` ✅, `radius custom/md` 10px ✅, 13px SemiBold ✅
- Close button: absolute, 32px, `bg gray/100` ✅, `radius round` ✅, `elevation/e3` ✅, 18px icon ✅

**Confirmed mismatch:**

| # | Aspect | Figma (confirmed) | Implementation | Severity |
|---|---|---|---|---|
| 1 | Dismiss button border | `border` 1px `outline/black-50` rgba(0,0,0,0.04) | `border: "none"` | Minor |

**Unresolved:** whether the Dismiss button's outer drop shadow (`0 1px 1px -0.5px black-50`) and `secondary_button_effect` inset are applied — not conclusively isolated. **Marked unresolved rather than asserted.**

**Note on a false alarm:** I initially suspected Alert rendered only one action button where Figma shows two. It does render both — the second is implemented inline with correct fill and typography. Only the border is missing.

---

## 🟡 Checkbox — `components/checkbox` — CHECKBOXLABEL NEEDS A PER-SIZE FIX

**Variants sampled:** `get_metadata` on `checkbox_label` (`66077:30090`, all 4 variants) + `get_design_context` on `sm/direction=left` (`66077:30091`, which also exposes the nested standalone `Checkbox`). Standalone Checkbox additionally corroborated by its nested instance inside List.
**Predictor flag:** 🚩 `CheckboxLabel` accepts a `size` prop but **hard-codes 13px/20px weight-400** — while its siblings `ToggleLabel` and `RadioLabel` both carry per-size typography records. Deep-audited only at `size=md`.

**Standalone `Checkbox` — ✅ verified exact:** outer 20px ✅, box 16px ✅, border **2px** `text/gray-400` #c3c6cc ✅, `radius/border_radius_xs` = 6px ✅, fill `white-100` ✅. Agrees with the nested-instance evidence from List.

**`CheckboxLabel` — confirmed mismatches at `sm`:**

| # | Aspect | Figma `sm` | Implementation (all sizes) | Severity |
|---|---|---|---|---|
| 1 | Label font size | **12px** (`caption_2`) | 13px | Medium |
| 2 | Label line-height | **16px** | 20px | Medium |
| 3 | Label font weight | **Medium 500** | 400 | Medium |

**Confirmed correct:** caption 12px/16px Medium `gray-700` ✅, label→caption gap `spacing/2` = 2px ✅, root gap `spacing/8` = 8px ✅, `items-start` ✅, label colour `gray-950` ✅.

**Sibling cross-check:** `RadioLabel` implements md = weight 400 and sm = 12px/16px weight 500 — exactly the shape `CheckboxLabel` is missing. The fix is to mirror the sibling's table.

**Unresolved:** `md`'s label weight was not re-sampled (implementation uses 400, consistent with RadioLabel's md).

---

## 🟢 Toggle — `components/toggle` — SAFE TO SHIP

**Variants sampled:** `get_design_context` on `lg/switch_ON` (`66079:30407`).
**Predictor:** low risk — per-size `boxSizePx` / `trackSizePx` / `knobSizePx` records present.
**"Rebuilt from real SVG source" claim: ✅ TRUE — verified at the geometry level.**

| Aspect | Figma `lg` | Implementation |
|---|---|---|
| Outer box | 40 × 24 | ✅ `boxSizePx.lg` |
| Track | **38 × 22** | ✅ `trackSizePx.lg` |
| Knob | **22 × 18** — a stadium/pill, **not** a circle | ✅ `knobSizePx.lg` |
| Knob inset | uniform 2px (knob at left-15, right edge 2px from track) | ✅ `KNOB_INSET = 2` |
| Track fill (ON) | `text/primary-500` #5468ff | ✅ `primary[500]` |
| Knob shadow | `elevation/e2` | ✅ |

**Confirms the non-obvious audit findings:** md and lg genuinely share the same 40×24 outer box while drawing different internal track widths (38 vs 34), and the knob really is a stadium shape with differing width/height. Both were correctly implemented.

**Cosmetic note (not a defect):** Figma uses `border_radius_100` (100px); the implementation uses `radius.full` (1000px). At a 22px track height both render as fully rounded — visually identical.

**Unresolved:** `md`/`sm` and the disabled/focus states were not re-sampled; their per-size records are present and documented as sourced from the real SVG.

---

## 🟢 Radio — `components/radio` — SAFE TO SHIP

**Variants sampled:** `get_design_context` on `sm/active` (`66078:30225`), **plus the actual exported SVG asset downloaded and inspected**.
**Predictor:** low risk — per-size `outerSizePx` / `innerSizePx` / `dotSizePx` records present.
**"Rebuilt from ground-truth Figma SVG source" claim: ✅ TRUE — verified at the vector level.**

Figma returns Radio as a single flattened image, so layer metadata alone cannot confirm the dot. Fetching the real asset resolves it definitively:

```svg
<svg width="16" height="16" viewBox="0 0 16 16">
  <circle id="base"      cx="8" cy="8" r="8" fill="#5468FF"/>
  <circle id="inner_dot" cx="8" cy="8" r="3" fill="white"/>
</svg>
```

| Aspect | Figma vector | Implementation |
|---|---|---|
| Outer hit box | 20px | ✅ `outerSizePx.sm = 20` |
| Inner radio | 16px (`r=8`) | ✅ `innerSizePx.sm = 16` |
| Centre dot | **`r=3` → 6px diameter, white** | ✅ `dotSizePx.sm = 6` |
| Base fill | #5468FF (`primary-500`) | ✅ |

**This directly vindicates the corrective rebuild.** The commit claimed the selected state is a filled disc with a *punched-out white centre dot* rather than the conventional ring+dot — the vector source confirms exactly that, at exactly the implemented dimensions.

**Unresolved:** `md` size and the hover/disabled/indeterminate states were not re-sampled this pass.

---

## 🟡 Chip — `components/chip` — PER-SIZE CORRECTION NEEDED

**Variants sampled:** `get_metadata` on the full 51-variant set (`66075:28779`) + `get_design_context` on `sm/unselected/default` (`66075:28970`).
**Predictor flag:** 🚩 `heightPx` is per-size (40/32/24) but `padding: "0.5rem"` and `fontSize: 12` are **single constants** across all three sizes.

**Confirmed correct:** heights 40/32/24 ✅, `radius/border_radius_round` full pill ✅, `unselected` = `white/950` + `outline/black-50` border ✅ (the corrected value holds), icons 14px with **`drop-shadow` filter** ✅, `text_wrap` `px-2` ✅, `special_drop` inset ✅.

**Confirmed mismatches at `sm`:**

| # | Aspect | Figma `sm` | Implementation (all sizes) | Severity |
|---|---|---|---|---|
| 1 | Padding | `px-6 py-4` | `0.5rem` (8px uniform) | Medium |
| 2 | Typography | **11px/16px** Medium-500 (`caption_1`) | 12px | Medium |
| 3 | Root gap | no gap utility (0) | `0.125rem` (2px) | Minor |

The `p-8` / 12px values are `md`'s (the originally deep-audited size), applied to all three. Same shape as TabNavigation and SidebarNavigation.

**Unresolved:** `lg` was not sampled; `Green`/`Red` types (which have only a `default` state) were not sampled.

---

## 🟢 Tooltip — `components/tooltip` — SAFE TO SHIP

**Variants sampled:** `get_design_context` on `top_center` (`66070:27697`).
**Predictor:** no size axis; `DIRECTION_LAYOUT` is a proper per-direction `Record`.

**The rebuilt placement logic is confirmed correct.** Figma's `top_center` renders **pointer-first, above the card**, with the tip's **top border omitted** so the two fuse. The implementation's `DIRECTION_LAYOUT` encodes exactly `{ pointerFirst: true, omitBorder: "top" }` — and therefore correctly renders `top_*` *below* its anchor, the inversion its rebuild commit claimed.

| Aspect | Figma | Implementation |
|---|---|---|
| Card width | 240px | ✅ `TIP_WIDTH` |
| Pointer | 16 × 8 | ✅ |
| Card radius | `border_radius_lg` = **16px** | ✅ **`radius.xl`** — correctly resolved the legacy alias (`border_radius_lg` → canonical `xl`), not the same-named `radius.lg` (12px) |
| Card padding / gap | `p-12`, `gap-16` | ✅ |
| Border | `b/l/r` only, `outline/gray-100` | ✅ via `omitBorder` |
| Heading | 13px/20px SemiBold `gray-950` | ✅ |
| Description | 12px/16px Medium `gray-700` | ✅ |
| Actions | `gap-8`, both buttons `flex-1 h-32 p-8 radius custom/sm` | ✅ |
| Secondary btn | `bg gray/100`, 12px SemiBold `gray-700` | ✅ |
| Primary btn | `bg primary/500`, `border black-150`, `white-950` | ✅ |
| Root shadow | `elevation/e3` as a **`drop-shadow` filter chain** | ✅ correct technique |

**Notable:** the `border_radius_lg` → `radius.xl` resolution is a trap this component avoided — a naive mapping to the same-named `radius.lg` would have produced 12px instead of 16px. The token-normalization alias table did its job here.

**Unresolved (genuinely unresolvable from the component set):** `ANCHOR_GAP = 8`. Figma's `direction` variants define only the internal tip+pointer composition, **not** the tooltip's offset from its anchor — the implementation documents this honestly. Not a defect.

---

## 🟢 Button — `components/button` — SAFE TO SHIP (sampled)

**Variants sampled:** `get_metadata` on the `new_blue` set (`66050:8479`, all 80 variants) + `get_design_context` on `xxl/Primary/Default` (`66050:8540`).
**Predictor:** low risk — `SIZE_METRICS` is a full per-size `Record` carrying height, padding, rootGap, labelGap, iconSize, radius, fontSize and lineHeight independently for every size.

**The broad corrective audit demonstrably propagated.** Every sampled value matched, including subtleties a shallow pass would miss:

| Aspect | Figma `xxl` | Implementation |
|---|---|---|
| Height | 56px | ✅ |
| Padding | `p-16` uniform | ✅ `"1rem"` |
| Root gap | `spacing/6` = 6px | ✅ `rootGap: 6` |
| **Label gap** | `text_wrap px-6` = 6px | ✅ `labelGap: 6` — the additive second gap, correct |
| Radius | `custom/lg` = **12px** | ✅ `radius.lg` — **no alias trap here** (correctly *not* 16px) |
| Typography | 18px/24px SemiBold | ✅ |
| Fill / text | `primary/500` / `white-950` | ✅ |
| Border | `outline/black-150` | ✅ |
| Icons | 24px + **`drop-shadow` filter** | ✅ correct technique |
| Shadows | 2-layer outer + `primary_button_effect` inset | ✅ |

**Structural finding:** `new_blue` exposes sizes **xs, sm, md, lg, xxl — there is no `xl`**. This explains why `SIZE_METRICS.xl` and `.xxl` are identical: the record is a **union of both size scales** (Scale A `xs–xl` for danger/success/greyscale/icon_button; Scale B with `xxl` for new_blue/new_pink/ai_*). Not a defect, but passing `size="xl"` to `NewBlueButton` renders a size Figma does not define for that family. Worth documenting or type-narrowing per sub-family.

**⚠️ Coverage caveat:** only **1 of 8 sub-families** and 1 of 80 `new_blue` variants was sampled. The 🟢 reflects an exact match on a representative sample plus a low-risk predictor reading — **not** exhaustive coverage. The AI-gradient families (`ai_rounded`, `ai_regular`) and `icon_button` remain unsampled and carry the most distinct styling.

---

## 🟡 TableCell — NOT VERIFIED THIS PASS (predictor: low risk)

**Predictor result:** ✅ full per-type `Record`s for `PADDING`, `ROOT_GAP`, `AVATAR_SIZE`, `HEADER_AVATAR_SIZE`, `HEADER_ICON_SIZE`, `ICON_SIZE`, and `HEADING_TYPOGRAPHY` — including the non-obvious detail that `header_compact` is the one type whose text genuinely shrinks (12/16). Code comments cite a fresh `get_design_context` across all 4 `default`-state variants.

**No Figma sampling was performed in this pass.** Status remains 🟡 by the reading rule — absence of verification, not evidence of defect. The predictor has been accurate 11/11 and rates this low risk, but that is a prior, not a verdict.

**Scope question (unresolved):** whether shipping `TableCell` alone is deliberate remains a **product decision**, not a visual defect. Only the cell primitive exists; no Table/Row/Header/toolbar composition. See Tier B.

---

## 🟡 Input — NOT VERIFIED THIS PASS (predictor: mostly good, one localized flag)

**Predictor result:** `FIELD_SIZE_METRICS` is a proper shared per-size record ✅; `DigitInput` carries per-state `FILL`/`TEXT`/`BORDER`/`PLACEHOLDER` records ✅; `InputLabel`/`InputHint` use confirmed horizontal-only `spacing/2` padding ✅.

**🚩 One localized pattern-B flag:** `field.tsx` states its textarea / `advanced_with_buttons` structures were *"only independently re-sampled at md — other sizes reuse md's padding/gap by rank,"* with hard-coded `0.5rem 0.75rem` padding inside those branches. Given pattern B has now defected in five families, **this specific sub-structure should be sampled at `sm` and `xl` before release.**

**No Figma sampling was performed in this pass.** Status remains 🟡.

**DigitField:** unchanged — ⚪ placeholder, no confirmed Figma structure, publicly exported. This is a **separate issue from the Input family's visual accuracy** and is tracked at P0 on its own.

---

## 🟢 TableCell — `components/table` — SAFE TO SHIP (scope caveat below)

**Variants sampled:** `get_design_context` on `default_compact/default` (`66084:36338`).
**Predictor:** low risk — full per-type `Record`s. **Confirmed accurate.**

Every per-type value matched, including the ones a shallow pass would flatten:

| Aspect | Figma `default_compact` | Implementation |
|---|---|---|
| Padding | `px-12 py-4` | ✅ `PADDING.default_compact` |
| **Root gap** | `spacing/8` = **8px** | ✅ genuinely narrower than `default`'s 12px — the distinction is real and correctly encoded |
| Divider | `border-b outline/gray-100` | ✅ |
| Avatars | 20 / 24 / 32px, `radius round`, object-cover | ✅ compact density table |
| Icons | 20px single, **18px** in groups | ✅ `ICON_SIZE.compact` / `.compactGroup` |
| Heading | 13px/20px Medium `gray-950` | ✅ correctly does **not** shrink (only `header_compact` does) |
| Description | 12px/16px `gray-600` | ✅ |
| `tag1` / `tag2` | `h-24`, `px-6 py-4`, `radius custom/sm`, `gray/100` + `primary/500_alpha_12` | ✅ **matches Tags' `md` size** — the earlier `size="sm"` bug is genuinely fixed |
| Dropdown | `radius custom/sm` = 8px | ✅ correctly **not** the Input family's `radius.md`=10 |
| Nested Checkbox | `sm/square` | ✅ composes the real component |

**Scope (unchanged, a product decision not a defect):** only the cell primitive ships. No Table / Row / Header / toolbar composition exists. The package exports `TableCell` — it does **not** falsely present a full Table — but consumers reading "Table" in the docs may expect more. Tracked in Tier B.

---

## 🟡 Input — `components/input` — CONFIRMED PATTERN-B DEFECT

**Variants sampled:** `get_metadata` on the `field` set (`66056:19051`, all 12 variants) + `get_design_context` on `sm/textarea` (`66056:19159`).
**Predictor flag:** 🚩 `field.tsx` admitted textarea / `advanced_with_buttons` padding was *"only re-sampled at md — other sizes reuse md's by rank."* **The flag was correct.**

**Confirmed correct:** textarea heights **sm 72 / md 96 / lg 104 / xl 128** ✅ exact; `radius/border_radius_sm` = 8px ✅; fill `smoke_med` ✅; `input_inner_shadow` inset ✅; resizer icon 20px bottom-right ✅; `sm` typography 12px/16px Medium `gray-700` ✅; root gap `spacing/8` ✅.

**Confirmed mismatch:**

| # | Aspect | Figma `sm/textarea` | Implementation | Severity |
|---|---|---|---|---|
| 1 | Field textarea padding | **`p-8`** (8px uniform) | `0.5rem 0.75rem` (8px **/ 12px**) — md's value | Medium |

The horizontal padding is 4px too wide at `sm`. `lg`/`xl` were not sampled and are **likely affected the same way** — the constant is hard-coded inside the textarea branch with no size lookup.

**Other Input pieces (predictor, not sampled):** `FIELD_SIZE_METRICS` is a proper per-size record ✅; `DigitInput` has per-state `FILL`/`TEXT`/`BORDER`/`PLACEHOLDER` records ✅; `InputLabel`/`InputHint` use confirmed horizontal-only `spacing/2` ✅. `InputField`/`Dropdown`/`Textarea` state matrices were not re-sampled this pass.

**DigitField:** unchanged — ⚪ placeholder, publicly exported, no confirmed Figma structure. **Separate from the Input family's visual accuracy**, tracked at P0.

---

# Tier B — Flagged incomplete items

## ⚪ DigitField — `components/input/digit_field.tsx` — NOT SAFE TO SHIP

Self-declared placeholder. Renders a bare flex container with `gap 8px` wrapping a single `DigitInput`. The audit flags the `digit_field` ↔ `digit_input` relationship as "not investigated"; Figma has only a single bare instance with no variant structure. **No confirmed structure exists to verify against.** It is publicly exported and would ship as a real component.

## ⚪ Table — `components/table` — PARTIAL

Exports **only** `TableCell`. No `Table`, `TableRow`, `TableHeader`, toolbar, or pagination composition exists. `TableCell` itself was re-audited and bug-fixed previously (not re-verified in this pass). Shipping "Table" that is only a cell primitive is a naming/expectation risk for consumers.

## ⚪ SidebarNavigation — `components/sidebar-navigation` — PARTIAL (by design)

Exports `SidebarItem` + `SidebarItemCollapsed` only. The audit confirmed `sidebar_nav` is a **Figma demo composition** (9 stacked items), not a real primitive — so omitting a container is a defensible, documented decision, consistent with `top_nav`/`tab_nav`. Flagged for awareness, not as a defect.

## ⚪ Icon dependency — systemic

- `@shikho/icons` exports **no glyphs** and is imported by exactly one file: the scaffold `Placeholder.tsx`. **No real component consumes it.**
- **12 component families hand-draw their own inline `<svg>`**: alert, checkbox, chip, date-picker, input, modal, pagination, table, tags, toast, toggle, tooltip.
- These are hand-authored approximations, **not** the exported Figma vector assets. Figma returns real SVG assets for these glyphs (confirmed for Avatar's smiley/checkmark, List's icons, ButtonGroup's icon).
- **Risk:** every hand-drawn glyph is an unverified visual guess. This is a library-wide accuracy exposure that no per-component audit has covered.

## ⚪ `Placeholder` — publicly exported scaffold

`packages/ui/src/index.ts` exports `Placeholder`/`PlaceholderProps`, a build-scaffold component whose own comment reads *"Scaffold-only component proving the tokens -> icons -> ui toolchain wires up."* **Must be removed before publishing.**

---

# Tier C — Not re-verified in this pass

These families were **not** checked against live Figma in this pass. They are listed at 🟡 by the reading rule above — this is *absence of verification*, not evidence of defect. Several carry a prior rebuild commit, noted as context only.

| Family | Location | Prior evidence (not re-verified) | Residual risk |
|---|---|---|---|
| Button | `components/button` | Full rebuild after zero-audit original | Icon-shadow technique unchecked |
| Input | `components/input` | Full rebuild; contains ⚪ DigitField | 8 sub-components, only some sampled |
| Checkbox | `components/checkbox` | Rebuilt (`appearance:none` custom paint) | Verified indirectly via List (nested instance matched ✅) |
| Radio | `components/radio` | Rebuilt from real SVG source | Hand-drawn glyph risk |
| Toggle | `components/toggle` | Rebuilt with real track/knob | — |
| Chip | `components/chip` | Rebuilt; icon-shadow bug fixed here | — |
| Tags | `components/tags` | Rebuilt twice (incl. hover states) | List duplicates its styling inline |
| Alert | `components/alert` | Icons + per-severity buttons fixed | Hand-drawn glyphs |
| Toast | `components/toast` | Icons + per-severity buttons fixed | Hand-drawn glyphs |
| Tooltip | `components/tooltip` | Rebuilt as rich card; positioning inverted | — |
| DatePicker | `components/date-picker` | Replaced placeholder w/ deep-audit build | Hand-drawn chevrons |
| Link | `components/link` | `links-deep-audit.md` exists | Never rebuilt after audit |
| Modal | `components/modal` | `modal-deep-audit.md` exists | Never rebuilt after audit; no header/actions sub-parts |
| Pagination | `components/pagination` | Deep-audit doc; split from Progress | — |
| Progress | `components/progress` | Deep-audit doc | — |
| Switcher | `components/switcher` | Deep-audit doc | — |
| TabNavigation | `components/tab-navigation` | Deep-audit doc | — |
| TopNavigation | `components/top-navigation` | Deep-audit doc | — |
| Table | `components/table` | See Tier B | Composition incomplete |
| SidebarNavigation | `components/sidebar-navigation` | See Tier B | Container omitted by design |

> **Highest residual risk in Tier C: Link and Modal.** Both have deep-audit documents but, unlike Button/Input/Chip/Tags/Radio/Toggle, **never received a corrective rebuild commit**. Every family that *was* re-checked in that wave turned out to have real defects. Link and Modal have had their audit read but never had their implementation re-verified against it.

---

# Full family table — all 23

**Total component families exported from `@shikho/ui`: 23** (plus 1 non-design scaffold, `Placeholder`).

| # | Family | Status | Verified against live Figma? | Defect summary |
|---|---|---|---|---|
| 1 | **Avatar** | 🔴 | ✅ deep | `type=text`/`type=icon` gradients rendered as flat gray; wrong text colour; md 12px vs 13px; missing icon glyph + e2 shadow; `avatar_face`/`avatar_group` unbuilt |
| 2 | **List** | 🔴 | ✅ deep | Row fill applied in all states (Figma: none); text `gray-950` vs `gray-700`; tag fill white vs `gray-100`; sizes + states render identically; duplicates Tags inline |
| 3 | **ButtonGroup** | 🟡 | ✅ deep | Icon uses `boxShadow` not `drop-shadow` filter; missing segment shadows; 4/5 sizes derived |
| 4 | **Modal** | 🟡 | ✅ deep | `modal_actions` padding `8px 24px` vs Figma `pt-16 px-32`; header/actions not separately exported |
| 5 | **Progress** | 🟡 | ✅ deep | Handle is a real SVG asset with `e2`; implemented as flat `primary[300]` circle |
| 6 | **Pagination** | 🟡 | ✅ deep | Prev/next icon-button padding 6px vs 8px; inactive-number background **unresolved** |
| — | ↳ *LoadMorePagination* | 🟢 | ✅ deep | No mismatch found |
| 7 | **Link** | 🟢 | ✅ deep | No mismatch found |
| 8 | **Input** → DigitField | ⚪ | n/a | Self-declared placeholder, no confirmed Figma structure |
| 9 | **Table** (TableCell) | 🟢 | ✅ deep — default_compact full context | No visual mismatch. Scope: cell primitive only (product decision) |
| 10 | **Button** | 🟡 | ⏳ **not yet verified** | — |
| 11 | **Input** (rest) | 🟡 | ✅ deep — field 12-variant metadata + sm/textarea | Field textarea padding `8/12px` vs Figma `p-8`; lg/xl likely same |
| 12 | **Checkbox** | 🟡 | ✅ deep — standalone + `checkbox_label` 4-variant metadata + sm full context | Standalone exact; **CheckboxLabel `sm` label 13px/20px/400 vs Figma 12px/16px/500** |
| 13 | **Radio** | 🟢 | ✅ deep — sm/active + **real SVG asset inspected** | No mismatch; dot `r=3`→6px confirms `dotSizePx.sm` exactly |
| 14 | **Toggle** | 🟢 | ✅ deep — lg/switch_ON geometry | No mismatch; 38×22 track + 22×18 stadium knob + 2px inset all exact |
| 15 | **Chip** | 🟡 | ✅ deep — 51-variant metadata + sm full context | `sm` padding 8px vs `px-6 py-4`; typography 12px vs 11px; root gap 2px vs 0 |
| 16 | **Tags** | 🟢 | ✅ deep — 2 standalone variants + 1 nested + full 99-variant metadata | No mismatch found. *Previous "contradiction" entry was my error — nested tag is the `secondary` type and matches exactly* |
| 17 | **Alert** | 🟡 | ✅ deep — 5-severity metadata + `success` full context | Dismiss button missing 1px `outline/black-50` border |
| 18 | **Toast** | 🟢 | ✅ deep — 5-severity metadata + `warning` full context | No mismatch found; the "unconfirmed" root gap proved correct |
| 19 | **Tooltip** | 🟢 | ✅ deep — top_center full context | No mismatch; placement inversion + `border_radius_lg`→16px alias both correct |
| 20 | **DatePicker** | 🟡 | ✅ deep — full range/lg tree + nested sidebar_item | Nav button width 40 vs 42; hand-drawn chevrons |
| 21 | **SidebarNavigation** | 🔴 | ✅ deep — 36-variant metadata + md & xl full context | Padding wrong at md & xl; radius wrong at md; **xl typography 13px vs 18px**; right icon wrong at md — per-size table missing |
| 22 | **Switcher** | 🟡 | ✅ deep — container all 5 sizes + xs full context | Container radius 12px vs Figma 10px; container gap 8px vs 6px; `xs` label 12px vs 11px |
| 23 | **TabNavigation** | 🟡 | ✅ deep — 15-variant metadata + xs full context | `xs` typography 13px vs 11px; gap 8px vs 4px; padding pt-4/pb-12 vs pt-2/pb-8 — per-size table missing |
| 24 | **TopNavigation** | 🟡 | ✅ deep — 99-variant metadata + xl full context | `text_wrap` padding 4px vs 6px (only defect; per-size tables all correct) |
| — | `Placeholder` | ⚪ | n/a | Build scaffold, publicly exported — must be removed |

*(Row 24 exists because Pagination contributes two exported components; the family count remains 23.)*

## Counts

| Status | Count |
|---|---|
| 🟢 Genuinely Figma verified | **9** (Link, Tags, Toast, Toggle, Radio, Tooltip, TableCell, Button*, LoadMorePagination) — *Button sampled, 1 of 8 sub-families |
| 🟡 Minor mismatch / needs correction | **9** (all now verified) |
| 🔴 Significant mismatch — rebuild required | **3** (Avatar, List, SidebarNavigation) |
| ⚪ Incomplete / placeholder | **2** (DigitField, Table composition) + `Placeholder` scaffold |

**Verification coverage: 23 of 23 families (100%) have now been sampled against live Figma.** One residual gap: **Button's `ai_rounded` and `icon_button` sub-families were never sampled** — Button's 🟢 rests on `new_blue` only (1 of 8). Every other family has direct evidence.

## Base rate observed so far

Of 23 families verified: **9 clean, 11 minor/medium mismatches, 3 requiring rebuild.**

The predictive picture has now sharpened considerably:

- **"Never rebuilt" is NOT a good predictor of defect.** Link came back perfectly clean; Modal and Pagination had only minor padding drift.
- **"Original audit sampled one variant and extrapolated" IS the strong predictor** — but only when *no corrective re-audit followed*. Avatar and List (both single-variant, never corrected) are the two rebuild-grade failures. Switcher (single-variant origin, re-audited once) landed at three medium mismatches.
- **A thorough corrective rebuild genuinely works.** Tags was rebuilt twice from multi-instance re-audits and verified clean — *including a value its own comments admitted was guessed*, which turned out to be right.

**Revised heuristic for the remaining 14:** prioritise families whose corrective rebuild was driven by a *narrow* re-audit, and de-prioritise those rebuilt from broad multi-instance sampling (Button ~35 calls, Input ~14 calls, Chip ~11 calls are comparatively well-evidenced).

---

# Repair order before npm publish

**P0 — blocks v0.1.0**

1. **Remove `Placeholder` from the public barrel.** One-line change; ships scaffold code otherwise.
2. **Rebuild Avatar** — `type=text` and `type=icon` gradients, text colour, md typography, verification glyph. Largest visual defect found.
3. **Rebuild List** — per-state and per-size differentiation, row fill, text/tag colours; compose `Tags` instead of duplicating it.
4. **Resolve DigitField** — either run the Figma audit and build it, or remove it from the public exports until it is real.

**P1 — strongly recommended before a library-wide release**

5. ~~Re-verify Link and Modal.~~ ✅ **Done** — Link 🟢 clean, Modal 🟡 one padding fix.
5a. **Fix Switcher container radius (12px → 10px), gap (8px → 6px), and `xs` label size (12px → 11px)** — three visible defects.
5a-ii. **Rebuild SidebarItem's per-size table** (padding, radius, typography, right-icon size) — `xl` currently renders 13px type where Figma is 18px. **Promote to P0-adjacent.**
5a-iii. **Build TabNavItem's per-size table** (padding, gap, typography).
5a-iv. **Fix TopNavItem `text_wrap` padding** (4px → 6px).
5a-v. **Add the missing `outline/black-50` border to Alert's Dismiss button.**
5a-vi. **Give `CheckboxLabel` a per-size typography table** (sm = 12px/16px/500), mirroring `RadioLabel`.
5a-vii. **Give Chip a per-size padding/typography table** (sm = `px-6 py-4`, 11px/16px, gap 0).
5a-viii. **Give Field's textarea branch a per-size padding lookup** (sm = `p-8`; re-sample lg/xl).
5b. **Fix Modal `modal_actions` padding** (`8px 24px` → `pt-16 px-32`).
5c. **Fix Pagination prev/next icon-button padding** (6px → 8px), and resolve the inactive-number-background question.
5d. **Replace Progress's handle** with the real exported SVG asset carrying `elevation/e2`.
6. **Sweep the icon-shadow bug library-wide** (`boxShadow` → `drop-shadow` filter). Confirmed present in ButtonGroup; correct in Link, Tags, Switcher, Pagination, Modal. Audit remaining families with icon slots.
7. **Decide the `Table` naming/scope question** — ship as `TableCell` only, or build the composition.
8. **Replace hand-drawn inline SVGs with real exported Figma assets** across the 12 affected families, or explicitly document them as approximations.

**P2 — after release**

9. Re-verify the remaining Tier C families (Button, Input, Checkbox, Radio, Toggle, Chip, Tags, Alert, Toast, Tooltip, DatePicker, Pagination, Progress, Switcher, TabNavigation, TopNavigation) at full size × variant × state depth.
10. Implement `avatar_face` and `avatar_group` (17 unbuilt Figma variants).
11. Confirm ButtonGroup padding for sm/md/lg/xl (currently derived, not confirmed).

---

## Ship recommendation

**Do not publish v0.1.0 in the current state.** Two families are confirmed visually incorrect, one publicly-exported component is build scaffolding, and one is a self-declared placeholder. P0 items 1–4 are the minimum bar.

The deeper finding is process-level: **every family examined closely turned out to be wrong in some way, including one (ButtonGroup) that carried a `deep-audited` label.** The `status: "deep-audited"` field in `docs.meta.ts` currently reflects *that an audit document exists*, not that the implementation matches it. Until Tier C is verified, that field should not be treated as a release gate.
