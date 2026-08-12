# Buttons Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Buttons` overview (node `66050:11360`), containing eight sibling button component-set families
- Deep instance audit: `new_blue` / `📐 size=xs, ☘️ type=Primary, 💡 state=Default` (node `66050:8860`)

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection).
Status: **Audit only.** No code, components, or project configuration were generated. No variable or style names were renamed or normalized. The `focus_danger` binding issue is documented, not fixed.

---

## 1. All eight button component-set names

| Component set | Node ID |
|---|---|
| `button_danger` | `66050:6995` |
| `button_success` | `66050:7396` |
| `Greyscale` | `66050:7797` |
| `icon_button` | `66050:8198` |
| `new_blue` | `66050:8479` |
| `new_pink` | `66050:8880` |
| `ai_rounded` | `66050:9281` |
| `ai_regular` | `66050:9682` |

(`button_group`, found via `search_design_system`, is a separate component set and was not part of this selection — not covered here.)

---

## 2. All exposed size, type, and state values

| Set | `size` values | `type` values | `state` values |
|---|---|---|---|
| `button_danger` | xs, sm, md, lg, xl | Secondary, Text, primary, tertiary | default, disabled, focus, hover |
| `button_success` | xs, sm, md, lg, xl | Outline, Secondary, Text, primary | default, disabled, focus, hover |
| `Greyscale` | xs, sm, md, lg, xl | Outline, Secondary, Text, primary | default, disabled, focus, hover |
| `icon_button` | xs, sm, md, lg, xl | neutral, primary, primary_light, quaternary, secondary, tertiary, tertiary_light | default, disabled, focus, hover |
| `new_blue` | xs, sm, md, lg, xxl | Outline, Primary, Secondary, Text | Default, Disabled, Focus, Hover |
| `new_pink` | xs, sm, md, lg, xxl | Outline, Primary, Secondary, Text | Default, Disabled, Focus, Hover |
| `ai_rounded` | xs, sm, md, lg, xxl | Green, Primary, Purple, blue gradient | Default, Disabled, Focus, Hover |
| `ai_regular` | xs, sm, md, lg, xxl | Green, Primary, blue gradient, purple | Default, Disabled, Focus, Hover |

Property names are consistent across all eight sets: `size` (📐), `type` (☘️), `state` (💡). Confirmed present in every set: exactly four states — no more, no fewer were found in the layer names.

---

## 3. Variant counts

| Set | Sizes × Types × States | Total |
|---|---|---|
| `button_danger` | 5 × 4 × 4 | 80 |
| `button_success` | 5 × 4 × 4 | 80 |
| `Greyscale` | 5 × 4 × 4 | 80 |
| `icon_button` | 5 × 7 × 4 | 140 |
| `new_blue` | 5 × 4 × 4 | 80 |
| `new_pink` | 5 × 4 × 4 | 80 |
| `ai_rounded` | 5 × 4 × 4 | 80 |
| `ai_regular` | 5 × 4 × 4 | 80 |

**Total across all eight sets: 700 variants.**

---

## 4. Confirmed naming and capitalization inconsistencies

- **State casing differs by family:** lowercase (`default/disabled/focus/hover`) in `button_danger`, `button_success`, `Greyscale`, `icon_button`; capitalized (`Default/Disabled/Focus/Hover`) in `new_blue`, `new_pink`, `ai_rounded`, `ai_regular`.
- **Type casing is mixed within a single set:** `button_danger` combines `Secondary`/`Text` (capitalized) with `primary`/`tertiary` (lowercase) as sibling values of the same property.
- **Inconsistent type taxonomy across the three "semantic" button families:** `button_danger` has `tertiary` but no `Outline`; `button_success` and `Greyscale` have `Outline` but no `tertiary` — three conceptually parallel sets don't share a common type vocabulary.
- **`ai_rounded` vs. `ai_regular` disagree on case for the same conceptual value:** `Purple` (capitalized, `ai_rounded`) vs. `purple` (lowercase, `ai_regular`).

---

## 5. The two competing size scales

- **Scale A** (`button_danger`, `button_success`, `Greyscale`, `icon_button`): `xs, sm, md, lg, xl`
- **Scale B** (`new_blue`, `new_pink`, `ai_rounded`, `ai_regular`): `xs, sm, md, lg, xxl`

No set uses both `xl` and `xxl` together — the top step's name depends entirely on which family it belongs to. This is reported as an observation; no versioning or deprecation status is asserted.

---

## 6. Confirmed focus-ring definitions

Retrieved directly from the button subtree (node `66050:11360`):

```
outline/focus_primary     = Effect(type: DROP_SHADOW, color: outline/primary_alpha, offset: (0,0), radius: 0, spread: 3)
outline/focus_secondary   = Effect(type: DROP_SHADOW, color: Color/Secondary/500_alpha_24, offset: (0,0), radius: 0, spread: 3)
outline/focus_danger      = Effect(type: DROP_SHADOW, color: Color/Secondary/500_alpha_24, offset: (0,0), radius: 0, spread: 3)   ← see §13
outline/focus_success     = Effect(type: DROP_SHADOW, color: Color/success/500_alpha_24, offset: (0,0), radius: 0, spread: 3)
outline/focus_gray        = Effect(type: DROP_SHADOW, color: outline/Gray 300, offset: (0,0), radius: 0, spread: 3)
outline/focus_transparent = Effect(type: DROP_SHADOW, color: Color/black/200, offset: (0,0), radius: 0, spread: 3)
```

Every focus ring is structurally identical: a single 0-blur, 3px-spread `DROP_SHADOW` (i.e. a solid-color outline ring), differing only in color. This confirms and resolves geometry that was previously unresolved in the earlier Special Effects audit.

---

## 7. Confirmed button-effect definitions

```
primary_button_effect =
  Effect(type: INNER_SHADOW, color: Color/white/500, offset: (0, 0), radius: 8, spread: -2);
  Effect(type: INNER_SHADOW, color: Color/white/600, offset: (0, 3), radius: 4, spread: -3);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)

secondary_button_effect =
  Effect(type: INNER_SHADOW, color: neutral_transparent_Black/Black 7, offset: (0, -1), radius: 3, spread: -2);
  Effect(type: INNER_SHADOW, color: Color/white/50, offset: (0, 1), radius: 3, spread: -2);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
```

Both are 4-layer composites (2 inner shadows + 2 drop shadows), structurally parallel to each other but with different colors/radii. Also present but **unresolved (empty string)**, consistent with every prior audit: `primary_special_outline`, `secondary_special_outline`, `Gradient/G2`, `Gradient/G3`, `Gradient/G4`, `Gradient/G5`.

---

## 8. Confirmed token bindings for the selected `xs / Primary / Default` button

Node `66050:8860`, within `new_blue`. All values below are exact, bound directly to this instance's subtree:

| Property | Token | Value |
|---|---|---|
| Fill | `Color/primary/500` | `#5468ff` |
| Text color | `Text/White 950` (= `Color/white/950`) | `#ffffff` |
| Radius | `radius/custom/xs` | `6` |
| Icon size | `sizing/icon/14` | `14` |
| Typography | `web/Body/11 Semibold` | see §10 |
| Effect | `primary_button_effect` | see §7 |

Also bound in this instance's subtree but **not confirmed as applied to a specific property**: `outline/Black 150` (`#0000001f`), `outline/Black 300` (`#0000003d`), `elevation/e2` (2-layer drop shadow), `elevation/Black 50` (`#0000000a`), `primary_special_outline` (unresolved/empty), `spacing/0`, `spacing/4`, `spacing/6`.

---

## 9. Confirmed rendered dimensions

From `get_metadata` on node `66050:8860`:
```
x = 40, y = 43, width = 87, height = 24
```
This is the instance's current rendered bounding box on the canvas. Whether this reflects a fixed size, a hug-content result, or a fill-container result is **not confirmed** — see §11.

---

## 10. Confirmed typography, icon-size, radius, fill, and text-color tokens

**Typography** (bound to the `xs/Primary/Default` instance):
```
web/Body/11 Semibold = Font(family: "Noto Sans Bengali", style: SemiBold,
  size: font/size/caption_1, weight: 600,
  lineHeight: font/line_height/caption_1, letterSpacing: font/letter_spacing/none)

font/size/caption_1 = 11
font/line_height/caption_1 = 16
font/letter_spacing/none = 0
```
This matches "Caption 1" from the Typography audit exactly (11px size / 16px line height / Semibold weight).

**Icon size:** `sizing/icon/14 = 14` — the first size-specific confirmation of which icon-size token maps to the `xs` button step.

**Radius:** `radius/custom/xs = 6`

**Fill:** `Color/primary/500 = #5468ff`

**Text color:** `Text/White 950 = #ffffff` (also present as `Color/white/950 = #ffffff`, same value under two names).

---

## 11. Unresolved padding, gap, layout, icon-slot, and sizing-mode details

The following could **not** be retrieved for the `xs/Primary/Default` instance, or for any of the eight component sets in the overview audit:

- **Internal layer hierarchy** — `get_metadata` returned the instance as a self-closing leaf node with no children (no label frame, icon container, or wrapper exposed).
- **Auto-layout direction** (horizontal/vertical) — not exposed.
- **Alignment rules** (primary/counter axis) — not exposed.
- **Hug / Fill / Fixed sizing behavior** — not exposed; only the current rendered bounding box (§9) is known, not the sizing *mode* that produced it.
- **Horizontal and vertical padding** — three spacing tokens (`spacing/0 = 0`, `spacing/4 = 4`, `spacing/6 = 6`) are bound somewhere in the instance's subtree, but the flat variable export does not attribute any of them to a specific padding side or to the icon/label gap. None has been assigned without confirmation.
- **Gap between icon and label** — not confirmed, same limitation as above. No icon or label child layer was returned, so an icon's presence in this specific instance's structure is not directly confirmed either (only that icon-size tokens exist in the subtree).
- **Icon-position variant mechanism** (leading/trailing/icon-only) — no such variant property was found in any of the eight sets' naming convention; whether this is handled via boolean component properties or instance-swap slots could not be confirmed.
- **Border/stroke application** — `outline/Black 150` and `outline/Black 300` are bound in the instance's subtree, but which (if either) is actually rendered as a stroke on this button is not confirmed.
- **Whether `elevation/e2` is actually applied to this button**, or is incidental spillover from elsewhere in the file (a pattern observed repeatedly across prior audits).
- **Boolean or instance-swap component properties** — none were returned by either tool for this node.
- **Hardcoded (non-variable) values** — cannot be confirmed or ruled out, since internal layer properties were not retrievable.
- **Default variant configuration** for any of the eight component sets — which specific variant combination Figma has marked as the set's default is not exposed by either tool.

---

## 12. MCP limitations

- `get_metadata` does not expose internal layer structure, auto-layout properties, padding, alignment, or sizing modes for a component/symbol node queried directly — it returns only a bounding box for leaf-level component instances.
- `get_variable_defs` returns only a flat `name → value` map of bound variables; it does not attribute a given spacing/color/effect token to the specific property it's applied to (e.g. which of three spacing tokens is horizontal padding vs. vertical padding vs. icon-gap).
- As in every prior audit in this series, some effect/style names resolve to an **empty string** (`primary_special_outline`, `secondary_special_outline`, `Gradient/G2–G5`) — the tool cannot flatten certain effect/gradient types to a scalar.
- No Variable Collection or Mode metadata (e.g. Light/Dark) was retrievable at any point in this audit, consistent with every prior audit in this series.
- Deeper structural data (layer hierarchy, auto-layout, component properties) would require `get_design_context`, which was intentionally not called, per the audit-only, no-code-generation constraint for this task.

---

## 13. The confirmed `focus_danger` binding issue

`outline/focus_danger` resolves to:
```
Effect(type: DROP_SHADOW, color: Color/Secondary/500_alpha_24, offset: (0, 0), radius: 0, spread: 3)
```
This is the **exact same color variable** (`Color/Secondary/500_alpha_24` = `#e2008d3d`) used by `outline/focus_secondary`. A parallel `Color/danger/500` (`#f03d3d`) exists elsewhere in the design system and would be the expected source color for a "danger" focus ring, based on the pattern followed by every other focus ring in this set (`focus_primary` → primary color, `focus_success` → success color).

This issue was first suspected during the Special Effects audit (based on a standalone style swatch) and is **now confirmed in an actual button-component-binding context** — the same incorrect color reference appears in the live effect-style definition consumed by the button system, not only in an isolated demo frame. **This has not been fixed or reassigned**, per your instruction.

---

## 14. Deep re-audit addendum (Phase 2 of the Button rebuild)

**Everything below this line was added in a second pass that explicitly *did* call `get_design_context`** — the tool the original audit (§12) deliberately withheld. ~35 `get_metadata`/`get_design_context` calls were made across all 8 families, sampling every family's `Primary`/`primary`-equivalent type at multiple sizes, every scale-B family's 4 types at `xs`, representative `hover`/`focus`/`disabled` states, and 5 of `icon_button`'s 7 types. This is a deep, multi-point re-audit, not an exhaustive 700-variant enumeration — every generalization below is flagged as such where it extrapolates from a sampled point rather than a directly observed one.

### 14.1 Previous implementation gaps

The original `packages/ui/src/components/button/` implementation (pre-rebuild) was built entirely from §1–§13 above — i.e. from metadata and one single confirmed binding (`new_blue/xs/Primary/Default`'s fill/text/radius/icon-size/typography). Because `get_design_context` was never called, the following were **invented, not derived**, and are corrected by this pass:

1. **No button ever rendered a border, shadow, or inset effect.** `primary_button_effect`/`secondary_button_effect` (§7) were documented as confirmed tokens but explicitly *not implemented* ("not implemented in `@shikho/tokens` yet... this component uses only `@shikho/tokens` exports"). The deep re-audit shows every single button in every family renders a border (or explicitly no border, itself a confirmed per-type fact) **and** a 2-part shadow construction (an outer `box-shadow` + an inset overlay `div`) on `Primary`/`Secondary`/`Outline`-equivalent types. Shipping with zero shadows/borders was a materially incomplete visual — not a simplification.
2. **The `soft`/`outline`/`text` emphasis mappings (`emphasisStyle` in `shared.ts`) were invented from whole cloth.** The real construction is: `Primary`→solid ramp[500] fill + `black-150` border + full effect; `Secondary`→ramp[200] fill + `primary/500@12%` border + partial (e1) shadow + secondary-effect inset; `Outline`→white fill + solid ramp[500] border + same partial treatment as Secondary; `Text`→no fill, no border, no shadow at all. The old code's guessed step choices (ramp[100]/[50]/[300]/[600]/[700] in various combinations) do not match any of these.
3. **`icon_button`'s `secondary` type was mapped to `color.secondary` (the pink brand ramp).** It is not. The confirmed fill is a **neutral `color.gray[100]`**, with no border at all — completely unrelated to the pink brand ramp. This was a plausible-sounding but wrong guess driven by name-matching (`secondary` type → `secondary` ramp), the exact failure mode this rebuild was commissioned to catch.
4. **`Greyscale`'s `primary` type was mapped to `color.gray[500]`.** The confirmed fill is **`color.black[900]`** (`rgba(0,0,0,0.88)`, i.e. near-black), identical in kind to `icon_button`'s `neutral` type and to `Switcher`'s `active_neutral` treatment elsewhere in this system — not a mid-gray.
5. **`ai_rounded`/`ai_regular`'s color-named types (`Primary`, `Green`, `Purple`/`purple`, `blue gradient`) were all implemented as solid ramp fills**, with `blue gradient` explicitly falling back to solid `color.primary` because `Gradient/G1`–`G6` "never resolve to stop/color data in any audit." **This is now corrected: all four types in both `ai_rounded` and `ai_regular` are real gradients**, and their exact stop colors/angles are now confirmed directly from the rendered instance's CSS (`get_design_context` renders the actual computed `backgroundImage`, which resolves even where `get_variable_defs` still reports the named `Gradient/G2`–`G5` tokens as unresolved). See §14.3.
6. **Hover was implemented as a single ramp step darker** (`ramp[600]` from a `ramp[500]` default). The confirmed hover step for solid (`Primary`) types is **`ramp[700]`**, skipping `600` entirely. Soft/outline hover moves fill from `ramp[200]`→`ramp[300]` and border alpha from `12%`→`20%` simultaneously — a two-property shift, not a single fill change.
7. **Focus was implemented as the default style plus an added ring** (`isFocusVariant ? { boxShadow: ... } : {}` layered on top of the base `emphasisColor`). The confirmed real behavior is that focus **replaces** the entire border/shadow/effect construction — no border, no button-effect, ring only — not an additive combination.
8. **Disabled was implemented as a straight opacity-50 filter** (`disabled:opacity-50` in `buttonBaseClassName`) applied uniformly to whatever the type's normal style was. The confirmed real behavior is an explicit, opaque **recolor**: a very light tinted fill (the ramp's own `100`/`50` step, or plain `gray/100` for `button_success`), a light text color (the ramp's `300` step), a downgraded single-layer (e1) outer shadow, and the *secondary*-style inset overlay regardless of the button's own type — not a CSS opacity filter over the original colors.
9. **Padding/gap were an invented placeholder scale** (§11 of the original audit explicitly disclaimed this). The deep re-audit confirms real per-size padding, root-level flex `gap`, and a *second*, additive gap contributed by the label's own wrapping `<div>` padding — a two-part gap mechanism, not a single value.
10. **`icon_button`'s icon size was assumed to equal the general `sizing/icon/*` ramp uniformly.** The confirmed construction nests a smaller icon inside a larger fixed square button (e.g. 16px icon inside a 24px button at `xs`) — the button's own footprint and its icon size are two independent, both-confirmed numbers, not one and the same.

### 14.2 Confirmed visual mappings

All values below were read directly from rendered `get_design_context` output (Tailwind arbitrary-value classes and inline `style` attributes on the actual instance), not inferred from token names.

**Structure (universal across all 8 families):** a root row (`display:flex; align-items:center; justify-content:center`) containing an optional `left_icon`/`right_icon` (or single `icon` for `icon_button`) slot, a `text_wrap` label div, and — only on types that have a shadow/effect — a second, absolutely-positioned `inset-0` overlay div carrying the inset-shadow layers. Each icon slot is a fixed square (`size-[Npx]`) with `filter: drop-shadow(0 1px 0.5px elevation.Black50) drop-shadow(0 3px 1.5px elevation.Black50)` (the same icon-shadow filter pattern already used system-wide, e.g. Sidebar/Switcher/Top Navigation).

**Confirmed size ramp** (all 8 families use these exact pixel values; `button_danger`/`button_success`/`Greyscale`/`icon_button`'s `xl` step is pixel-identical to `new_blue`/`new_pink`/`ai_rounded`/`ai_regular`'s `xxl` step):

| size (A/B) | height | padding | root gap | label-wrap padding | icon size | radius (scale families) | typography |
|---|---|---|---|---|---|---|---|
| xs | 24 | 6px h / 4px v | 0 | 4px each side | 14 | `radius.xs` (6) | caption_1 11/16 |
| sm | 32 | 8px uniform | 2 | 4px each side | 16 | `radius.sm` (8) | caption_2 12/16 |
| md | 40 | 12px h / 8px v | 4 | 4px each side | 18 | `radius.md` (10) | body_1 13/20 |
| lg | 48 | 16px h / 12px v | 4 | 4px each side | 20 | `radius.lg` (12) | body_1 13/20 (labeled "Title/13", a confirmed duplicate per `typography.md`) |
| xl / xxl | 56 | 16px uniform | 6 | 6px each side | 24 | `radius.lg` (12) — **same as `lg`, not a bigger step** | title_2 18/24 |

`icon_button` reuses the same height values as its own fixed width×height (square), but its own icon size is a fully independent, per-step-confirmed number, not shared with the text families at all. **Corrected (2026-08-12) — the xs-only sample above was previously (mis)read as "icon_button = next text-family step's iconSize" and never actually implemented as its own table; the real implementation just reused the generic `iconSize` from the size-ramp table above (18 at `md`) for every family including `icon_button`.** Sampled every step directly (node `66050:8198`'s `icon` child instance size at xs/sm/md/lg/xl): **16 / 18 / 22 / 24 / 28** in a 24/32/40/48/56 button — a distinct progression that does NOT match the text families' 14/16/18/20/24 at the same steps (`iconButtonIconSize()` in `shared.ts`).

Separately, the confirmed Figma structure always centers the icon inside its slot via a symmetric inset regardless of the icon's own size (e.g. `inset-[12.5%]` on the vector within its `size-[22px]` slot) — the pre-fix `ButtonShell` icon wrapper had no `display:flex`/centering of its own, so any icon that doesn't already fill 100% of the slot (e.g. the docs playground's small `dot` preview glyph) rendered pinned to the slot's top-left corner via plain block layout instead of centered. Fixed by giving the wrapper `display:flex; align-items:center; justify-content:center`.

**Confirmed type-emphasis construction**, demonstrated on `new_blue` (identical structure independently confirmed on `new_pink`/`ramp=secondary`, `button_danger`/`ramp=danger`, `button_success`/`ramp=success`; `Greyscale`'s `primary` uses `color.black[900]` instead of a ramp — see §14.1 point 4):

| type | fill | border | text | outer shadow | inset overlay |
|---|---|---|---|---|---|
| `Primary`/`primary` | `ramp[500]` | `1px solid color.black[100]` (`outline/Black 150`) | `color.white[950]` | full `elevation.e2` (2-layer) | `primary_button_effect`'s 2 inner-shadow layers: `inset 0 0 8px -2px white/500, inset 0 3px 4px -3px white/600` |
| `Secondary` | `ramp[200]` | `1px solid ramp[500]@12%` | `ramp[600]` | `elevation.e1` (1-layer only) | `secondary_button_effect`'s 2 inner-shadow layers: `inset 0 1px 3px -2px white/50, inset 0 -1px 3px -2px black/7%` |
| `Outline` | `color.white[950]` | `1px solid ramp[500]` (solid) | `ramp[600]` | `elevation.e1` | same as `Secondary` |
| `Text` | `color.white[950]` | none | `ramp[600]` | none | none |

**Confirmed `hover` deltas** (sampled on `Primary` and `Secondary`): `Primary` fill jumps `ramp[500]`→`ramp[700]` (not `[600]`); `Secondary`/`Outline` fill jumps `ramp[200]`→`ramp[300]` and border alpha `12%`→`20%` simultaneously; the rest of each type's construction (border style, shadow, effect) is unchanged from `Default`.

**Confirmed `focus` behavior** (sampled on `Primary` and `Outline`): the button-effect (both outer shadow layers and the inset overlay div) is **removed entirely** and replaced with a single outer ring, `0 0 0 3px <focusRingColor>` — geometry and 6 colors already confirmed in §6. `Primary`'s border is also removed at focus; `Outline` keeps its border. No family/type combination showed an additive ring-plus-effect construction.

**Confirmed `disabled` behavior** (sampled on `new_blue Primary`/`Outline`, `button_success primary`): fill drops to the ramp's own `100` step (`Primary`) or `50` step (`Outline`) — **except `button_success`, whose `disabled` fill is a flat neutral `color.gray[100]`, not a tinted success value**, a genuine family-specific exception, not a sampling error (re-confirmed via a second, independent fetch). Text drops to the ramp's `300`/`400` step. The outer shadow always downgrades to single-layer `elevation.e1`, and the inset overlay always uses `secondary_button_effect`'s inner-shadow layers, **regardless of the button's own default type** — i.e. a `Primary` button's `Disabled` state borrows `Secondary`'s inset treatment, not its own.

**Confirmed `icon_button` per-type mapping** (5 of 7 types sampled directly; `primary_light`/`tertiary_light` are extrapolated from the confirmed `_light`-suffix pattern seen system-wide and are marked derived in §14.4):

| type | fill | border | shadow/effect |
|---|---|---|---|
| `primary` | `color.primary[500]` | `1px solid black/100` | full `primary_button_effect` |
| `neutral` | `color.black[950]` (pure black, not the 88%-alpha `black[900]`) | `1px solid black/100` | full `primary_button_effect` |
| `secondary` | `color.gray[100]` | none | `elevation.e1` + `secondary_button_effect` inset |
| `tertiary` | `color.white[950]` | `1px solid black/50` (`outline/Black 50`) | `elevation.e1` + `secondary_button_effect` inset |
| `quaternary` | transparent | none | none (bare icon, no container styling at all) |

**Confirmed `ai_rounded` vs. `ai_regular` radius difference:** `ai_rounded`'s radius is a true pill at every size (`12` at `xs` = exactly half its `24` height; `24` at `lg` = exactly half its `48` height) — confirmed via two independent size samples, not assumed from the family name. `ai_regular` uses the ordinary scale radius (`6` at `xs`, matching `radius.xs`) — i.e. not a pill at all, despite sharing the same gradient definitions as `ai_rounded` (§14.3).

### 14.3 Family-specific differences — the `ai_rounded`/`ai_regular` gradients

All four `type` values in both families render as **real CSS gradients**, confirmed by inspecting the rendered instance's computed `backgroundImage`, not by resolving the named `Gradient/G2`–`G5` tokens (which still report empty via `get_variable_defs`, exactly as every prior audit found). This directly overturns §7/§11's "falls back to a solid `color.primary` fill" placeholder.

- **`Primary`** (both `ai_rounded` and `ai_regular` — identical stops in both families, only the container radius differs): `linear-gradient(67.34deg, rgb(255,55,223) 0.54%, rgb(110,0,255) 99.41%)` — pink to violet. Bound to `Gradient/G2`.
- **`blue gradient`**: `linear-gradient(42.88deg, rgb(74,37,225) 0.88%, rgb(123,90,255) 91.67%)` — indigo to periwinkle. Bound to `Gradient/G3`.
- **`Green`**: `linear-gradient(223.88deg, rgb(189,219,121) 3.93%, rgb(48,138,79) 96.62%)` — light yellow-green to forest green. Bound to `Gradient/G5`.
- **`Purple`/`purple`**: **not a linear gradient** — a 6-stop **radial** gradient rendered via an inline SVG data URI, with an affine `gradientTransform` (an elliptical, rotated radial gradient), stops `rgba(167,136,253,1)` → `rgba(135,104,220,1)` → `rgba(102,72,186,1)` → `rgba(70,40,153,1)` → `rgba(54,24,136,1)` → `rgba(37,8,120,1)` at offsets `0, 0.25, 0.5, 0.75, 0.875, 1`. Bound to `Gradient/G4`. **Corrected (2026-08-12) — was previously a CSS `radial-gradient()` circular approximation, flagged as non-pixel-exact; the user reported it visibly didn't match Figma.** Re-sampled the raw `gradientTransform` matrix at two different rendered sizes (`ai_rounded xxl` node `66050:9322`, viewBox 167×56; `ai_regular md` node `64699:8498`, viewBox 122×40) and found the matrix's x-column coefficients scale exactly linearly with the instance's pixel width, and its y-column coefficients scale exactly linearly with its pixel height — i.e. the transform is a fixed fraction of the element's own bounding box. Implementation now reproduces Figma's literal inline SVG (same `cx=0 cy=0 r=10` circle, same 6 stops), using `gradientUnits="objectBoundingBox"` with that one size-independent matrix so it's pixel-accurate at any button size or content width, not just the sampled ones (`purpleGradientSvg` in `shared.ts`).

All four types' `hover`/`focus` gradient variants were not independently sampled (out of scope for this pass); the existing confirmed non-gradient state-transition patterns (§14.2) are applied as the nearest confirmed analogue and flagged as derived in §14.4.

**`disabled` WAS independently sampled in a later pass** (2026-08-12, every `Disabled` variant in both component sets — node `66050:9281` `ai_rounded` / `66050:9682` `ai_regular` — sampled at `md`), and is genuinely type-specific, not the uniform neutral-gray recipe originally guessed: `Primary` disabled is a flat, muted recolor (solid `secondary/100` fill, `secondary/200` text, no border, single-layer e1 shadow, the secondary inset — matching the non-gradient families' §14.2 disabled recipe exactly). `Green`, `blue gradient`, and `Purple` instead keep their own gradient fill washed toward white with a uniform 72%-opacity white overlay layer, white text, a light `black/50` border, and the FULL e2 shadow + primary inset. Figma's own `Purple`/`Disabled` swatch literally reuses `blue gradient`'s exact RGB stops — a copy-paste artifact in the file, not a real Purple sample — so the implementation applies Purple's own confirmed default gradient under the same wash recipe instead of reproducing that anomaly.

### 14.4 Unresolved values (honest gaps remaining after this deep re-audit)

- **`ai_rounded`/`ai_regular` gradient behavior at `hover`/`focus`** was not independently sampled. This implementation darkens/lightens the gradient via a CSS `filter: brightness()` adjustment on hover and applies the confirmed generic ring-only focus treatment used by the non-gradient families — an extrapolation, not a confirmed binding. (`disabled` WAS independently sampled — see §14.3.)
- **`icon_button`'s `primary_light` and `tertiary_light` types** were not independently fetched. They are implemented as a lighter tint of their non-`_light` sibling (`primary_light` → `color.primary[100]` fill, no border; `tertiary_light` → transparent, no border, no shadow), following the same `_light`-suffix-as-tint pattern already confirmed elsewhere in this system (e.g. Tags' `primary_light` type) — a derived, not independently confirmed, mapping.
- **`new_pink`/`ai_rounded`/`ai_regular`/`button_danger`/`Greyscale`'s own `Secondary`/`Outline`/`Text` (or `tertiary`) hover/focus/disabled transitions** were not independently re-sampled type-by-type in every family — the confirmed `new_blue` transition deltas (§14.2) are applied uniformly across all scale-A and scale-B families sharing that type vocabulary, since no family-specific divergence was found in any of the samples that *were* taken (`button_success`'s disabled-fill divergence, §14.2, is the one confirmed exception found).
- **`button_danger`'s `tertiary` type** (the one type value with no direct counterpart in any other family) was not independently sampled; it is implemented using the confirmed `Outline`-shape construction (transparent fill, solid ramp-colored border) as the closest structural analogue, flagged as derived.
- **Padding at `icon_button`'s non-`xs` sizes** was not independently re-sampled; the `xs`-confirmed pattern (padding equals half the icon-to-button size difference) is applied by rank across `sm`–`xl`.
- Every gap already listed in §11 that this pass did not touch (default variant configuration, whether `elevation/e2` bindings are incidental, hardcoded non-variable values inside the vector icon subtree) remains unresolved, unchanged from the original audit.
