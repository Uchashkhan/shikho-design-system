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
