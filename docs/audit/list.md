# List Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `List items` overview (node `66064:21283`), containing the `list` component set and a `drop_menu` instance
- Deep instance audit: `list` / `📐 size=lg, 💡 state=active_primary_accent` (node `66064:21367`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Overview: component sets and node IDs

*(Source: `get_metadata`)*

| Name | Node ID | Type |
|---|---|---|
| `list` | `66064:21301` | component set |
| `drop_menu` | `66064:21419` | single instance (not expanded — no variant structure visible) |

(Plus an unrelated `overview_sheet_sidebar` instance, `66064:21284`.)

---

## 2. Exposed properties and variant values

*(Source: `get_metadata`)*

`list` exposes exactly two: **`size`** (md, lg, xl) and **`state`** (default, hover, active_primary_accent). No `type` property exists.

**9 total variants** (3 sizes × 3 states). `drop_menu` has 0 confirmed variants — it's a bare instance in this metadata.

Heights per size confirmed from bounding boxes: md=52, lg=60, xl=76 (width constant 432px, a demo-layout artifact).

**State coverage:** confirmed sparser than other component families — only `default/hover/active_primary_accent`, no `disabled`, `selected`, `error`, or `focus`.

---

## 3. Typography tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium, web/Title/18 Medium, web/Title/13 Medium,
web/Body/13 Medium, web/Body/12 Medium, web/Body/11 Semibold
```
As in every prior audit, 22/76/32/18 more plausibly belong to unrelated sidebar/heading labels; 13/12/11 are more plausible candidates for actual list-item text — **confirmed genuinely applied** in the deep audit (§7).

---

## 4. Spacing, radius, border, elevation, and effect tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
spacing/0, 2, 4, 6, 8, 10, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20
radius/border_radius_xs = 6        ← value matches radius/custom/xs (6) from the Buttons audit; new name
radius/border_radius_lg = 16
radius/border_radius_5xl = 40
radius/border_radius_8xl = 64
radius/border_radius_0 = 0         (confirmed previously in the Button Group audit)
radius/custom/sm = 8     radius/custom/md = 10     radius/custom/lg = 12

outline/Black 50 = #0000000a     outline/Black 100 = #00000012
outline/Gray 100 / 200 / 300 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
special_drop = (confirmed 2-layer, identical to the Input audit — now confirmed genuinely applied, §7)
input_inner_shadow = (confirmed, identical to the Input audit's definition)
secondary_special_outline = ""   ← still unresolved, consistent with every prior audit
```

---

## 5. Color and semantic tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
Text/Gray 400 / 600 / 700 / 950
Text/Primary 500 = #5468ff
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a     Color/white/950 = #ffffff
Color/Gray 100 = #f4f4f6      Color/gray/100 = #f4f4f6        Color/Gray (unnumbered) = #ebecf0
Color/smoke_med = #f4f4f6     Color/smoke_base = #ffffff      Color/smoke_low = #f9f9fa
Color/black/50 = #0000000a
Color/inverse_black_neutral = #ffffff
neutral_transparent_Black/Black 4 / 7
```
The `smoke_*` family (flagged as a duplicate-naming issue in the Input audit) is bound in this subtree too, reinforcing broader reuse than just Input fields.

---

## 6. Duplicated, suspicious, and naming inconsistencies (overview-level)

*(Source: `get_metadata` / `get_variable_defs`, overview)*

- **Sparse state coverage:** only 3 states for `list`, notably fewer than Input's 7 or Buttons' 4 — flagged as an observation, not a claim about intended scope.
- **`active_primary_accent` is a uniquely verbose, compound state name** — every other component set audited (Buttons, Inputs) uses simple single-word states.
- **`radius/border_radius_xs` (6) duplicates `radius/custom/xs` (6)** from the Buttons audit — another entry in the ongoing `custom/*` vs. `border_radius_*` naming-family duplication.
- **`Color/Gray` (unnumbered, `#ebecf0`) reappears** alongside `Color/gray/100` and `Color/smoke_med` (both `#f4f4f6`, a different value) — continuing the multi-named-neutral-color pattern from prior audits.
- **`drop_menu` is present only as a single instance**, not an expanded component set — unaudited here.

---

## 7. Deep audit: `list` / size=lg, state=active_primary_accent (node `66064:21367`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66064:21367  "list" (root)
├─ 156:475  Checkbox instance (nested component — shape="square", size="sm", state="unchecked")   [rendered — leadIcon=true]
│  └─ 156:458  "checkbox/theme_light/sm/square/unchecked/default" (20×20)
│     └─ 156:459  "checkbox"
│        └─ 156:460  "base" (16×16)
├─ 66064:21369  "token" (36×36)     [NOT rendered — leadItemLg=false]
├─ 66064:21370  "token" (24×24)     [rendered — leadItem=true]
├─ 66064:21371  "left_icon" (24×24) [rendered — leftIcon=true, selectLeftIcon=null]
│  └─ I66064:21371;29:307   "vector"
├─ 66064:21372  "text_group"        [rendered — textGroup1=true]
│  ├─ 66064:21373  <text> "List item"     [rendered — text=true]
│  └─ 66064:21374  <text> "Description"   [rendered — description1=true]
├─ 66064:21375  "tags"              [rendered — tag=true]
│  ├─ I66064:21375;16712:80998   "test_wrap"   ← literal layer name, likely a typo for "text_wrap"
│  │  └─ I66064:21375;69:3529   <text> "Tag"
│  └─ (absolute inset overlay — inner-shadow layer, no separate node-id given)
├─ 66064:21376  "text_group" (second instance)   [rendered — textGroup2=true]
│  ├─ 66064:21377  <text> "List item"     [rendered — trailText=true]
│  └─ 66064:21378  <text> "List item"     [rendered — description2=true — same placeholder text as trailText]
└─ 66064:21379  "right_icon" (24×24)      [rendered — rightIcon=true, selectRightIcon=null]
   └─ I66064:21379;29:307   "vector"
```

### Confirmed facts
- **Boolean properties (12):** `description1`, `description2`, `leadIcon`, `leadItem`, `leadItemLg`, `leftIcon`, `rightIcon`, `tag`, `text`, `textGroup1`, `textGroup2`, `trailText` — all at their component defaults in this instance (no overrides applied).
- **Instance-swap properties (2):** `selectLeftIcon`, `selectRightIcon` (both `React.ReactNode | null`), same pattern confirmed previously on `field`.
- **Nested component dependency — first confirmed cross-component-family nesting in this series:** a full **Checkbox** component (`shape="square"`, `size="sm"`, `state="unchecked"`) is embedded via the `leadIcon` boolean. **Naming mismatch:** the boolean is named `leadIcon` despite actually controlling a checkbox, not an icon.
- **Multiple leading elements can render simultaneously:** in this instance, Checkbox + 24px token + left_icon all render together — not mutually exclusive.
- **Avatars/badges/radios not confirmed:** the "token" slots are plain `<img>` layers (no `I<parent>;<id>` reference), not confirmed nested Avatar instances; no radio component or explicit "badge" layer exists anywhere in this variant.
- **Layout:** root `flex items-center justify-center` (horizontal); `text_group1` (left) `flex-col items-center justify-center`, `flex-[1_0_0]` (Fill/grow); `text_group2` (right) `flex-col items-end justify-center text-right`; `tags` and its `test_wrap` both `flex items-center justify-center`.
- **Sizing:** root `w-[432px]` (Fixed, demo width), **no explicit height class** — the confirmed 60px is a Hug result (12px padding ×2 + content), not hardcoded. Checkbox/tokens/icons all Fixed-size; `text_group1` Fill/grow with `min-w-px`; `text_group2` Hug; `tags` `h-[24px]` Fixed, width Hug.
- **Padding/gaps:** root `p-[spacing/12, 12px]` uniform, `gap-[spacing/12, 12px]` between top-level children; `text_group1`/`text_group2` internal `gap-[spacing/0, 0px]`; `text_group2` additionally `pr-[spacing/4, 4px]`; `tags` `px-[spacing/6, 6px] py-[spacing/4, 4px]`; `tags`' `test_wrap` `px-[spacing/4, 4px]`.
- **Typography:** main text → `body_1`/`para` (13px/20px), Medium, `Text/Gray 950`. Descriptions (both) → `caption_2` (12px/16px), Medium, `Text/Gray 600`. Trailing text → same scale as main text but `Text/Gray 700` (confirmed different color). Tag text → `caption_1` (11px/16px), **SemiBold**, `Text/Gray 700`. **Confirmed placeholder-text inconsistency:** the right-side description literally reads "List item" (matching its sibling trailText) rather than "Description."
- **Border, radius, fill:** root fill `Color/Gray` (`#ebecf0`); root border is **bottom-only** (`border-b`), color `outline/Gray 100` (`#f4f4f6`) — a divider line, confirmed (§ dividers). **Root has no corner radius at all** — a confirmed absence, unlike every Button/Input/Avatar component audited so far. Checkbox `base`: white fill, 2px `Text/gray-400` border, `radius/border_radius_xs` (6px). `tags`: `outline/black-50` border, `Color/white/950` fill, `radius/custom/sm` (8px), plus an inset shadow **exactly matching the confirmed `special_drop` definition** — resolving that token's application into a concrete, confirmed usage.
- **Elevation/effect:** icons carry `elevation/e2`-matching drop-shadows; **no elevation/effect token applies to the root row itself.**
- **State-name/fill discrepancy, flagged:** the state is named `active_primary_accent`, but the only confirmed background fill is `Color/Gray` — a plain neutral gray, **not** a primary-blue-tinted color. No primary-brand color token appears anywhere in this instance's confirmed bindings.
- **Dividers:** confirmed — bottom-edge-only border via `outline/Gray 100`.
- **Overrides:** none — every prop is at its plain component default.

### Not confirmed / unresolved
- Whether `default`/`hover` states share this same structure with only color differences, or diverge structurally — out of scope, no sibling inference performed.
- Whether the "primary accent" implied by the state name manifests elsewhere (e.g. only visible when compared to sibling states) — not confirmed.
- Whether `test_wrap` is a genuine typo for "text_wrap" or an intentional internal name.
- The real icon/token/checkbox glyph content beyond placeholder asset URLs.

---

## 8. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2` (icon drop-shadows, consistent across every prior audit); `special_drop` (fully resolved in the Input audit, **now confirmed genuinely applied** to the `tags` element here); `radius/custom/sm` (Buttons/Input audits); `radius/border_radius_xs` (this overview audit, now confirmed applied on the Checkbox's `base` layer); `spacing/0, 4, 6, 8, 12` (consistent across every prior audit); `Text/Gray` family, `Color/white/950/50` (Colors audit); `web/Body/11 Semibold`, `web/Title/13 Medium`, `web/Body/12 Medium` (Typography, Input, Buttons audits); `Color/Gray` unnumbered (Elevations, Special Effects, Buttons, and this overview audit — same recurring duplicate-naming pattern); `neutral_transparent_Black/Black 4` (Input audit's `special_drop` definition); the Checkbox component itself — first confirmed inter-family component nesting in this audit series.

---

## 9. Anything MCP cannot retrieve

- Whether leading icons/avatars/checkboxes/radios/tags/descriptions/badges/trailing actions exist identically across `default`/`hover` states or the `md`/`xl` sizes — out of scope, no sibling inference.
- `drop_menu`'s own variant structure — appears only as a bare instance in the overview metadata.
- Whether the "token" slots are genuine nested Avatar component instances (not confirmed — they render as plain image layers here) or standalone assets elsewhere in the file.
- Whether a Radio variant exists anywhere in the List system.
- The reconciling explanation for the `active_primary_accent` state name vs. its plain-gray confirmed fill.
- Real icon/token/checkbox glyph content beyond placeholder asset URLs.
- Default variant configuration for `list`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
