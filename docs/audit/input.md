# Input Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Input fields` overview (node `66056:16144`), containing seven component sets + one bare instance
- Deep instance audit: `input_field` / `💡 state=active` (node `66056:19197`), via `get_design_context`
- Deep instance audit: `field` / `📐 size=md, ☘️ type=default` (node `66056:19116`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for both deep instance audits. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Overview: component sets and node IDs

*(Source: `get_metadata`)*

| Name | Node ID | Type |
|---|---|---|
| `input_label` | `66056:19033` | component set |
| `input_hint` | `66056:19042` | component set |
| `field` | `66056:19051` | component set |
| `input_field` | `66056:19180` | component set |
| `dropdown` | `66056:19209` | component set |
| `textarea` | `66056:19282` | component set |
| `digit_input` | `66056:19311` | component set |
| `digit_field` | `66056:19326` | single instance (not a variant set) |

---

## 2. Exposed properties and variant values per set

*(Source: `get_metadata`)*

| Set | Properties | Values |
|---|---|---|
| `input_label` | `size` | sm, md |
| `input_hint` | `size` | sm, md |
| `field` | `size`, `type` | size: xl, lg, md, sm — type: default, textarea, advanced_with_buttons |
| `input_field` | `state` | default, default_dark, hover, filled, active, error, disabled |
| `dropdown` | `state`, `auto_layout` | state: naked, disabled, error, active, brand, active_no_focus, hover, default_dark, default — auto_layout: TRUE, FALSE |
| `textarea` | `state` | default, default_dark, hover, filled, active, error, disabled |
| `digit_input` | `state` | default, default_dark, hover, filled, active, error, disabled |

**Structural note:** unlike Buttons (where `size`/`type`/`state` all live on one set), sizing/style (`field`) and interaction state (`input_field`, `textarea`, `digit_input`, `dropdown`) are split across separate component sets.

---

## 3. Variant counts

*(Source: `get_metadata`)*

| Set | Count |
|---|---|
| `input_label` | 2 |
| `input_hint` | 2 |
| `field` | 12 (4 sizes × 3 types) |
| `input_field` | 7 |
| `dropdown` | 18 (9 states × 2 auto_layout) |
| `textarea` | 7 |
| `digit_input` | 7 |

**Total: 55 variants** across the seven component sets (`digit_field` excluded, being a single instance).

---

## 4. Sizes, states, types — confirmed coverage

*(Source: `get_metadata`)*

- **Sizes:** `field` supports xl/lg/md/sm; `input_label`/`input_hint` support only sm/md — a **confirmed coverage gap**: no label/hint styling exists for `lg` or `xl` inputs. `input_field`/`textarea`/`dropdown`/`digit_input` expose no `size` property at all.
- **States:** `input_field`/`textarea`/`digit_input` share an identical 7-state set (default, default_dark, hover, filled, active, error, disabled). `dropdown` uses a **different 9-state vocabulary** (naked, disabled, error, active, brand, active_no_focus, hover, default_dark, default) — no `filled`, and three states (`naked`, `brand`, `active_no_focus`) found nowhere else.
- **No state literally named "focus"** exists anywhere in the Input family, unlike Buttons' explicit "Focus"/"focus".
- **Types:** only `field` exposes a `type` property (default, textarea, advanced_with_buttons).
- **Validation states:** confirmed — **only `error` exists**; no `success` or `warning` state was found anywhere.

---

## 5. Typography tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
web/Title/22 Semibold, web/Title/22 Medium, web/Title/76 Semibold, web/Title/32 Medium,
web/Title/18 Medium, web/Title/18 Semibold, web/Title/15 Medium,
web/Title/13 Semibold, web/Title/13 Medium,
web/Body/13 Medium, web/Body/13 Semibold, web/Body/12 Medium, web/Body/12 Semibold, web/Body/11 Semibold
```
Not all necessarily Input-specific — some plausibly belong to unrelated sidebar/heading labels, consistent with the spillover pattern in every prior audit.

---

## 6. Spacing, radius, border, elevation, and effect tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
spacing/0, 2, 4, 6, 8, 10, 12, 14, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20        radius/custom/xl = 16
radius/border_radius_lg = 16        radius/custom/lg = 12
radius/border_radius_md = 12        radius/custom/md = 10
radius/border_radius_sm = 8         radius/custom/sm = 8
radius/border_radius_sm_2 = 10      ← duplicate/confusing naming, see §11
radius/border_radius_5xl = 40
radius/border_radius_8xl = 64

outline/Black 50 = #0000000a        outline/Black 100 = #00000012
outline/Gray 100 / 200 / 400
outline/Secondary 300 = #f681d7     ← new token vs. prior audits; confirmed applied, see §8
outline/Danger 300 = #f68989        ← new token vs. prior audits; application not confirmed
outline/focus_secondary = Effect(type: DROP_SHADOW, color: Color/Secondary/500_alpha_24, offset:(0,0), radius:0, spread:3)
outline/focus_danger    = Effect(type: DROP_SHADOW, color: Color/Secondary/500_alpha_24, offset:(0,0), radius:0, spread:3)  ← same bug, confirmed a third time

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to button_group audit)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover, not Input-specific)
secondary_special_outline = ""  ← still unresolved, consistent

input_inner_shadow = Effect(type: INNER_SHADOW, color: Color/black/50, offset: (0, 1), radius: 3, spread: 0)
  ← only a color reference in the Special Effects audit; now fully resolved AND confirmed genuinely applied (§8, field deep audit).

special_drop = Effect(type: INNER_SHADOW, color: neutral_transparent_Black/Black 4, offset: (0, -1), radius: 3, spread: -2);
               Effect(type: INNER_SHADOW, color: Color/white/50, offset: (0, 1), radius: 3, spread: 0)
  ← only a color reference in the Special Effects audit; now fully resolved here.
```

---

## 7. Color and semantic tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

A previously-undocumented **"smoke" color family**:
```
Color/smoke        = #ffffff
Color/smoke_base   = #ffffff
Color/smoke_low    = #f9f9fa
Color/smoke_med    = #f4f4f6
Color/smoke_high   = #ebecf0
```
Identical in value to `Color/gray/50` (`#f9f9fa`), `Color/gray/100` (`#f4f4f6`), and `Color/gray/200` (`#ebecf0`) from the Colors audit — a confirmed duplicate-naming pattern, now with a third name: `Color/disabled_base_em = #f4f4f6`.

Other tokens: `Color/primary_base_em_alpha = #5468ff1f` (a naming pattern distinct from the `_alpha_12/20/24` convention in Buttons); `Color/inverse_black_neutral = #ffffff`; `Text/Primary 500/600`, `Text/Danger 500`, `Text/Gray 400/600/700/950`, `Text/White 950`, `Color/Secondary/500`.

---

## 8. Deep audit: `input_field` / state=active (node `66056:19197`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66056:19197  "💡 state=active"  (root — props: label=true, hint=true, state="active")
├─ 66056:19198  "input_label"                         [rendered — label=true]
│  └─ I66056:19198;66056:19039   <text> "Label"
├─ 66056:19199  "field"
│  ├─ I66056:19199;66056:19086   "left"
│  │  └─ I66056:19199;66056:19087        "left_icon"  (20×20)
│  │     └─ I66056:19199;66056:19087;29:307   "vector"
│  ├─ I66056:19199;66056:19088   "text"
│  │  └─ I66056:19199;66056:19089        <text> "Input text"
│  └─ I66056:19199;66056:19091   "right"
│     └─ I66056:19199;66056:19094        "right_icon"  (20×20)
│        └─ I66056:19199;66056:19094;29:307   "vector"
└─ InputHint instance (66056:19047, "📐 size=md")            [rendered — hint=true; override: supportText=false]
   ├─ 66056:19048   "right_icon"   ← named "right_icon" despite controlling the hint row's LEADING icon (naming inconsistency)
   │  └─ I66056:19048;29:307   "vector"
   ├─ 66056:19049   <text> "Hint"
   └─ 66056:19050   <text> "(Support text)"  — defined, NOT rendered (overridden to false)
```

### Confirmed facts
- **Label / hint / icons exist:** `label` (bool, default true) and `hint` (bool, default true) confirmed as real component properties. Hint row further exposes `hintText` (true), `leftIcon` (true), `supportText` (true, **overridden to false** here). No placeholder mechanism or character-count element found.
- **Prefix/suffix icon slots:** `left`/`right` wrappers inside `field`, each 20×20 (`sizing/icon/20`).
- **Layout:** root `flex-col items-start`; label/field/hint rows each `flex items-center`; text slot inside field is `flex-[1_0_0]` (fill/grow).
- **Padding:** `input_label` and hint row: `px-[spacing/2, 2px]` (horizontal only). `field`: `p-[spacing/12, 12px]` (uniform, all sides). Text slot inside field: `px-[spacing/4, 4px]`.
- **Gaps:** root stack `gap-[spacing/4, 4px]`; `field` internal `gap-[spacing/6, 6px]`; hint row `gap-[spacing/4, 4px]`.
- **Border:** `field` has a full 4-side solid border, color **`outline/Secondary 300`** (`#f681d7`) — confirmed applied for this `active` state.
- **Corner radius:** `field` uniform `radius/custom/lg` (12px), all four corners.
- **Fill:** `field` background = **`Color/smoke_base`** (white) — confirms this "smoke" token is genuinely consumed, not just bound.
- **Focus/active ring:** `field` box-shadow `0px 0px 0px 3px Color/Secondary/500_alpha_24` — numerically identical to `outline/focus_secondary`'s definition, though expressed as a raw shadow value rather than a literal reference to that effect-style name.
- **Icon shadows:** all icons carry `elevation/e2`-matching drop-shadow filters.
- **Typography:** label and hint text use `Text/Gray 700` (`#5b616d`); field input text uses `Text/Gray 950` (`#0a0c11`, distinct from label color); support text (not rendered) would use `Text/Gray 600` (`#8c929c`). All at the `web/Body/13 Medium` / `font/size/body_1` (13px/20px) scale.
- **Sizing:** root `w-[304px]` (Fixed); `input_label`/`field` rows `w-full` (Fill); icon wrappers `shrink-0` + Fixed icon size; text slot `flex-[1_0_0]` (Fill/grow) with `min-w-px`.
- **Instance-swap properties:** none found on `input_field` itself.
- **Override applied:** `supportText={false}` on the nested `InputHint` instance.

### Not confirmed / unresolved
- `input_inner_shadow` was **not observed applied** in this `active`-state instance, despite being defined with full geometry in the overview export (see §11 for the reconciling discovery in the `field` deep audit).
- Whether a true placeholder mechanism exists, distinct from the static "Input text" content shown.
- Character-count element — not found, absence not fully provable.
- Comparison to the other six `input_field` states — out of scope (no sibling inference).

---

## 9. Deep audit: `field` / size=md, type=default (node `66056:19116`)

*(Source: `get_design_context`)*

### Internal layer hierarchy
```
66056:19116  "📐 size=md, ☘️ type=default"  (root — field instance)
├─ (absolute fill layer, aria-hidden — background rectangle, no separate node-id given)
├─ 66056:19117  "image"           [NOT rendered — image=false]
├─ 66056:19118  "left"                                     [rendered — leftGroup=true]
│  └─ 66056:19119  "left_icon" (18×18)                     [rendered — leftLead=true, selectLeftIcon=null]
│     └─ I66056:19119;29:307   "vector"
├─ 66056:19120  "text"                                     [rendered — textGroup=true]
│  ├─ 66056:19121  <text> "Input text"                     [rendered — text=true]
│  └─ 66056:19122  <text> "(12)"                           [rendered — supportText=true]
├─ 66056:19123  "right"                                    [rendered — rightGroup=true]
│  ├─ 66056:19124  "trail_text"                             [rendered — trailText=true]
│  │  └─ 66056:19125  <text> "Text"
│  └─ 66056:19126  "right_icon" (18×18)                    [rendered — rightIcon=true, selectRightIcon=null]
│     └─ I66056:19126;29:307   "vector"
└─ (absolute inset overlay — inner-shadow layer, no separate node-id given)
```

### Confirmed facts
- **Boolean properties (9, confirmed):** `image` (default false), `leftGroup` (true), `leftLead` (true), `rightGroup` (true), `rightIcon` (true), `supportText` (true), `text` (true), `textGroup` (true), `trailText` (true).
- **Instance-swap properties — first confirmed in this audit series:** `selectLeftIcon` and `selectRightIcon`, typed `React.ReactNode | null` (default null). When null, the default icon renders; when populated, a custom component would render instead.
- **Layout:** root `flex items-center` (horizontal); `text` group `flex-[1_0_0] items-center` (fill/grow); `right` group `flex items-center`; `trail_text` `flex items-center justify-center`.
- **Padding:** root `px-[spacing/10, 10px] py-[spacing/8, 8px]`; `left` group `pr-[spacing/2, 2px]` (right only); `text` group `px-[spacing/2, 2px]`; `trail_text` `pr-[spacing/2, 2px]`.
- **Gaps:** root `gap-[spacing/4, 4px]`; `text` group `gap-[spacing/4, 4px]`; `right` group `gap-[spacing/6, 6px]`.
- **Sizing:** root `h-[40px]` (Fixed, matches `md`) and `w-[352px]` (Fixed **in this standalone context**) — **confirmed usage-dependent width difference**: the same conceptual `field` node rendered inside `input_field` (§8) uses `w-full` (Fill) instead. `left`/`right` wrappers Hug + `shrink-0`; icons Fixed 18×18; `text` group Fill/grow with `min-w-px`.
- **Border:** **none** — no border class of any kind on this `type=default` variant, confirmed absent (distinct from the bordered `input_field`/active instance, whose border lives at the wrapper level, not on this base node).
- **Corner radius:** uniform `radius/custom/md` (10px), all corners, inherited by the fill and inner-shadow overlay layers.
- **Typography:** applied once at the `text` group container level — `web/Body/13 Medium` (13px/20px/no tracking). "Input text" → `Text/Gray 700`; "(12)" → `Text/Primary 500` (`#5468ff`); "Text" (trail_text) → `Text/Primary 500` (redeclared separately).
- **Icon sizes:** `left_icon`/`right_icon` = 18×18 (`sizing/icon/18`); optional `image` avatar slot (not rendered) = 24×24, circular (`radius/border_radius_round`, 1000px), `object-cover`.
- **Fill:** `Color/smoke_med` (`#f4f4f6`) — **confirmed different** from the `input_field`/active instance's field background (`Color/smoke_base`, white).
- **Inner shadow — resolves an open question from §8:** `shadow-[inset_0px_1px_3px_0px_Color/black/50]` exactly matches the confirmed `input_inner_shadow` definition. **This is genuinely applied here**, on the base `field` primitive — its absence in the `input_field`/active instance suggests that state's focus-ring box-shadow may replace rather than layer with this inner shadow. This is a confirmed discrepancy between the two instances, not a design-intent claim.
- **Overrides applied:** none — every property is at its component default.

### Not confirmed / unresolved
- How `size` (xl/lg/sm) or `type` (textarea/advanced_with_buttons) change this structure — out of scope, no sibling inference performed.
- The real icon glyphs and avatar image — only placeholder asset URLs returned.
- Whether `selectLeftIcon`/`selectRightIcon` connect to a defined instance-swap component set, or are generic open slots.

---

## 10. Naming inconsistencies (confirmed)

- **Hint-row icon named "right_icon" but functions as a leading icon** (controlled by prop `leftIcon`) — confirmed mismatch between prop name and layer name, found in the `input_field`/active deep audit.
- **`radius/border_radius_sm = 8` vs. `radius/border_radius_sm_2 = 10`** — two "sm" radius tokens, different values.
- **`radius/custom/md = 10` vs. `radius/border_radius_md = 12`** — "md" resolves to two different pixel values depending on naming family.
- **`#f4f4f6` expressed under three names:** `Color/gray/100` (Colors audit), `Color/smoke_med` (this audit), `Color/disabled_base_em` (this audit).
- **`_alpha_24` (Buttons/Special Effects) vs. `_base_em_alpha` (this audit)** — two different suffix conventions for "brand color at reduced alpha."
- **`supportText` prop means two different things** across sibling components: in `field`, it renders a primary-blue numeric-looking string ("(12)") next to the input text; in `InputHint` (nested inside `input_field`), it renders a gray parenthetical caption ("(Support text)"). Same prop name, different visual role and color token.
- **`dropdown`'s state vocabulary** shares no common taxonomy with `input_field`/`textarea`/`digit_input` (§4).

---

## 11. Duplicated / suspicious / cross-referenced findings

- **`outline/focus_danger` reuses `Color/Secondary/500_alpha_24`** — the same value as `outline/focus_secondary` — **confirmed for a third time** across Special Effects, Buttons, and now Input, reinforcing this as a systemic binding issue.
- **`input_inner_shadow` and `special_drop`** — both fully resolved for the first time in this audit (previously only color references, no geometry, in the Special Effects audit).
- **`input_inner_shadow` applied on the base `field` primitive but not observed on the composed `input_field`/active instance** — a confirmed discrepancy (§9), not yet explained.
- **Field background color differs by context:** `Color/smoke_med` (`#f4f4f6`) on the standalone `field`/md/default, vs. `Color/smoke_base` (white) inside `input_field`/active — confirmed from both deep audits.
- **Field width behavior differs by context:** `w-[352px]` (Fixed) standalone vs. `w-full` (Fill) when nested inside `input_field` — confirmed from both deep audits.
- **First confirmed instance-swap properties in this audit series:** `selectLeftIcon` / `selectRightIcon` on `field`.

---

## 12. Dependencies on previously audited tokens

Confirmed reuse of: `spacing/2, 4, 6, 8, 10, 12` (Buttons/Button Group audits); `radius/custom/md, lg` and `radius/border_radius_round` (Buttons/Button Group audits, with the md/lg naming inconsistency noted in §10); `sizing/icon/18, 20` (Buttons audit); `elevation/e2` (icon drop-shadows, consistent with Button Group and both Input deep audits); `outline/focus_secondary` / `Color/Secondary/500_alpha_24` (Special Effects, Buttons, Input overview — now confirmed as the genuine visual "active" ring in `input_field`); `Text/Gray 700/600/950`, `Text/Primary 500` (Colors audit); `web/Body/13 Medium` (Typography audit).

---

## 13. Anything MCP cannot retrieve

- Whether a true placeholder mechanism exists, distinct from static text content shown in both deep audits.
- Character-count element — not found in either deep audit; absence not fully provable.
- How `field`'s `size`/`type` properties change structure beyond `md`/`default` — out of scope (no sibling inference).
- How `input_field`'s other six states differ from `active` — out of scope (no sibling inference).
- The reconciling design reason for `input_inner_shadow`'s presence on `field` but absence on `input_field`/active (§9, §11) — the discrepancy is confirmed, the cause is not.
- Whether `selectLeftIcon`/`selectRightIcon` bind to a defined instance-swap component set in the library.
- The relationship between `digit_field` (single instance) and `digit_input` (7-state component set) — not investigated in this document.
- Whether `auto_layout=TRUE/FALSE` on `dropdown` reflects a real Figma boolean component property or is encoded only in the variant name.
- Default variant configuration for any of the seven component sets.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.

---

## 14. Deep re-audit addendum (visual implementation correction pass)

The first pass above deep-audited 2 nodes (`input_field`/active, `field`/md/default) but the resulting implementation then reused that single confirmed baseline as a neutral fallback for every other size, type, and state — meaning 5 of 7 `input_field` states, all 9 `dropdown` states, every `field` size besides `md`, both non-`default` `field` types, and all of `digit_input` never actually matched Figma. A second pass (~14 more `get_design_context` calls) now confirms:

- **Field's real per-size ramp** — `sm` (32h, 8px uniform padding, gap 2, radius.sm, icon16, caption_2), `md` (40h, 10px/8px padding, gap 4, radius.md, icon18, body_1 — as originally audited), `lg` (48h, 12px uniform, gap 6, radius.lg, icon20, body_1), `xl` (56h, 16px/14px padding, gap 6, radius.xl, icon24, title_2). The pre-rebuild implementation rendered every size identically to `md`.
- **Icon slots confirmed to carry the system-wide `elevation/e2` drop-shadow filter** in every sampled instance — absent from the pre-rebuild implementation entirely.
- **`field`'s `type="textarea"`**: confirmed a single text row (no left/right icon groups, no support/trail text), an optional 24px avatar image, and a bottom-right resizer glyph — not the default 3-slot layout.
- **`field`'s `type="advanced_with_buttons"`**: confirmed a materially richer structure — a bordered "lead" chip with its own independent fill/inset-shadow (e.g. a country-code prefix), a text row, an optional trailing label+icon, and 1-3 real solid-pink action buttons (fill `Color/secondary/500`, `radius.custom.sm`, the same construction as the Button family's `new_pink` `Primary` type, differing only in outer-shadow depth — confirmed e1-single-layer here vs. `new_pink`'s own confirmed full e2).
- **`input_field`'s full 7-state chrome**, not just `active`: `default`/`filled` share one fill (`smoke_med`); `hover` darkens the fill one step to `smoke_high` AND lightens the text to `gray/600` — a two-property shift; `error` uses a danger-colored border (`outline/Danger 300`) but the exact same ring color as `active` (`Color/Secondary/500_alpha_24`) — a confirmed Figma binding-reuse detail, not an approximation; `disabled` recolors the label, field text, and hint all to `gray/400` with a flat `disabled_base_em` fill, not a CSS opacity dim.
- **`dropdown` shares `input_field`'s exact confirmed chrome** for `default`/`default_dark`/`hover`/`error`/`active`/`disabled` (independently re-confirmed, not assumed). `naked` is confirmed genuinely different: no fill, no inner shadow, only the confirmed `elevation/e2` outer drop-shadow. `brand`/`active_no_focus` were not independently sampled and reuse `active`'s chrome minus the ring, as the closest confirmed analogue.
- **`digit_input` confirmed to use an entirely different typography scale** — `heading_1` (22px/32px SemiBold), not the `body_1` (13px/20px Medium) the rest of the Input family shares — with its own confirmed per-state fill/text/border table and the same active/error ring-sharing pattern as `input_field`/`dropdown`. A single `get_design_context` fetch on the component-set node resolved all 7 states in one pass. The pre-rebuild implementation rendered this at `body_1` size using `field`'s own default-only chrome regardless of `state`.

Every correction above is implemented in `packages/ui/src/components/input/shared.ts` (`fieldChromeStyle`, `FIELD_SIZE_METRICS`) and is cited inline at its point of use; see `packages/ui/src/components/input/README.md` for the consumer-facing confirmed-vs-derived summary.

## 15. Re-audit: real interactivity, not just visual fidelity

§14 confirmed visual fidelity was thorough and, spot-checked again in this pass (including the previously-unverified `default_dark`/`hover` grouping), correct. But `Field` — the primitive backing `InputField`, the family's flagship text input — rendered its editable content as a static `<span>` inside a `<div>`, not a real form control. Nothing could be typed into it. `Dropdown` had the same problem and no `tabIndex`, making it unreachable by keyboard. `Textarea` accepted a `state` prop that was never actually read by any style property.

Fixed: `Field`'s `default`/`advanced_with_buttons` types now render a real `<input>` and `textarea` a real `<textarea>` for their editable content (existing `textContent` callers keep working unchanged, now mapped to `defaultValue`). `InputField`/`DigitInput`/`Textarea` derive `state` from real interaction when left unset (focus → `active`, non-empty value → `filled`, hover → `hover`), the same pattern already applied to `SidebarItem`/`SwitcherItem`/`TabNavItem`/`Link` this session. `Dropdown` gained `tabIndex={0}` and the same hover/focus-driven resolution. `Textarea` now actually applies its own per-state chrome instead of a single hardcoded look regardless of `state`. Full details in `packages/ui/src/components/input/README.md`.

## 16. Re-audit: Textarea's and Dropdown's own component sets, never independently pulled before

Prompted by a direct question — "there's also textarea, dropdown, digit_input, don't these need the same check?" — both `textarea` (`66056:19282`) and `dropdown` (`66056:19209`) were pulled fresh via `get_design_context` for the first time (previously `textarea` only had its `state` axis confirmed via `get_metadata`, reusing `field`'s derived chrome; `dropdown` had only 4 of its 9 states spot-checked). Both turned up genuine, confirmed divergences from what had been assumed:

- **`textarea`'s own component set is a composed label+field+hint layout** (like `input_field`, not bare `field`) with its own confirmed geometry: `radius/border_radius_lg` (16px, not `field`'s `radius/custom/md`/10px) and `py-12/px-16` padding (not `field`'s 8px/10px). Its `error` state colors the input text itself `danger-500` (red) — a genuine divergence from `input_field`'s `error`, which keeps `gray-700` text and only reddens the border/hint.
- **`dropdown`'s full 9-state chrome, resolved in one fetch**: `default`/`hover`/`default_dark` text is confirmed `gray-950` — lighter than `input_field`'s own `gray-700` default text, a real per-component difference, not a mistake to normalize away. `brand` has its own confirmed primary-tinted fill (`primary_base_em_alpha`, 12%) and `primary-600` text — previously silently fell back to plain default gray since `brand` wasn't in the implementation's state-chrome lookup set at all. `active_no_focus` is confirmed genuinely distinct — white fill plus an outer `elevation/e2` shadow, no border, no ring — not "`active` minus its ring" as the original derivation assumed. Padding is confirmed `spacing/12` uniform (12px), not the previous 8px/10px; gap is `spacing/6` (6px), not 4px.
- **`digit_input`** was already fully confirmed in the original §14 pass (a single fetch resolved all 7 states) and needed no further correction here.

`Textarea` now renders its own confirmed chrome directly (no longer derives from `field`'s). `Dropdown` now has its own dedicated `dropdownChromeStyle` table instead of reusing `InputField`'s `fieldChromeStyle` — the two are confirmed similar but not identical, and forcing one table to serve both was the direct cause of the `brand`/`active_no_focus`/text-color bugs found here.

## 17. Re-audit: InputField's missing size axis

User feedback pointed back at `field`'s own component set (node `66056:19051`) specifically to flag that Input has multiple confirmed size variants. Re-checking `input_field` (node `66056:19180`) confirms it crosses `state` alone — no size axis exists on that component set at all, matching what §2/§4 already found. But `fieldChromeStyle` (§14/§15) — the function supplying `input_field`'s confirmed per-state colors/border/ring — has no size dependency whatsoever; it returns plain color values regardless of geometry. The previous implementation had `InputField` hardcode `Field`'s bare default size internally (`Omit<FieldProps, "size" | "type">`), meaning `InputField` could only ever render at one size despite `field`'s own 4 sizes being fully confirmed and already correctly implemented on `Field` itself — a real, avoidable gap, not a Figma limitation.

Fixed: `InputField` now accepts `size` (default `"md"`, preserving prior behavior exactly) and composes it into the underlying `Field`, combining `field`'s confirmed per-size geometry with `input_field`'s confirmed per-state chrome — the "least invented" combination, not a guessed one, since neither confirmed data set actually varies with the other axis. `InputLabel`/`InputHint` remain confirmed sm/md-only (§2) — `size="lg"`/`"xl"` maps their own size down to `"md"`, the closest confirmed value, rather than inventing an unconfirmed lg/xl label/hint treatment.

**Follow-up: the same gap existed on `Textarea`.** A direct follow-up question ("textarea also has different sizes") prompted checking `textarea`'s own component set (node `66056:19282`, first pulled in §16) the same way. It also crosses `state` alone — no size axis — so at first glance this looked like the same "genuinely no size data exists" situation as `input_field`. But comparing the numbers: `textarea`'s one confirmed sample (§16: radius `border_radius_lg`/16px, padding `py-12 px-16`) is a byte-for-byte match with `field`'s own `type="textarea"` **`lg`** row (§14's `TEXTAREA_METRICS`) — not the `md` row the original implementation assumed it corresponded to. That match means the one real Textarea sample already sits on `field`'s own confirmed per-size textarea scale; there was no need to guess new numbers, only to notice the existing ones already lined up. Moved `TEXTAREA_METRICS` to `shared.ts` (previously a private local table inside `field.tsx`) so `Textarea` could reuse the identical, already-confirmed table instead of drifting into a second, hand-maintained copy. `Textarea` now accepts `size`, defaulting to `"lg"` — not `"md"` — specifically to reproduce its own original confirmed sample exactly; `sm`/`md`/`xl` are the same already-confirmed rows `field` already uses.

**Second follow-up: the sizes were still visibly wrong.** User feedback ("sizes are not correct") pointed at node `66056:19127` (`field`, size=md, type=textarea) specifically. Re-pulling `get_design_context` fresh on all 4 sizes of `field`'s own `type="textarea"` variant (`66056:19063`/`19095`/`19127`/`19159`) confirmed every value already in `TEXTAREA_METRICS` — height, padding, radius, gap, image, resizer — was byte-for-byte correct for all four sizes; nothing in the table itself was wrong. The bug was in `textarea.tsx`'s render: `padding` and `borderRadius` were applied from `ta`, but `ta.height` was computed and then never assigned to the element's `style` — so the standalone `Textarea` primitive's box was actually sized by the browser's default `rows` behavior, not by Figma's confirmed per-size heights (sm 72 / md 96 / lg 104 / xl 128). `field.tsx`'s own `type="textarea"` branch had this right all along (`height: ta.height` was already present there); only the standalone primitive was missing it. Fixed by adding `height: ta.height` to `Textarea`'s style object. Verified live: computed height now reads exactly 72/96/104/128px across sm/md/lg/xl, matching Figma exactly.

## 18. Requested: active-state color override, advanced_with_buttons interaction states, chevron centering

Three items of direct user feedback on `InputField`, none derived from a fresh Figma discrepancy the way §17's fixes were — all three are documented here as requests, with exactly what does and doesn't come from Figma called out per item.

**1. Active-state color — a deliberate code-only override, not a Figma correction.** Requested: `active` should use `Color/primary/500` (#5468ff) border with a `Color/primary/200` (#d5e7ff) outline, replacing the existing pink. Re-verified `input_field`/`active` (node `66056:19197`) fresh before making this change: Figma itself still renders `outline/secondary-300` (#f681d7) border + `Color/Secondary/500_alpha_24` ring — identical to what §14 originally found, and identical to `error`'s own ring. This is **not** a case like `focusRingColor.danger` (a confirmed copy-paste binding bug, docs/audit/special-effects.md §9) — Figma's pink `active` ring is deliberate and consistent, sampled independently on `input_field`, `dropdown`, and `digit_input` alike. The blue was requested directly, not derived from a re-pull, so it's implemented as the same kind of intentional code-only deviation already established for `focusRingColor.danger` — flagged here rather than silently presented as a Figma match.

Scope: changed in `fieldChromeStyle` (`shared.ts`), which is shared by `InputField`, `Textarea`, and (as of item 2 below) `Field`'s `advanced_with_buttons`. `Dropdown` and `DigitInput` each maintain their own independent, separately-hardcoded pink `active` chrome (`dropdownChromeStyle` in `dropdown.tsx`; a local table in `digit_input.tsx`) and were **not** touched, since the request named "the input field" specifically and those two already diverge from `input_field`'s chrome in other confirmed ways (§15). `error` also keeps its original pink ring — only `active` was requested.

**2. `advanced_with_buttons` had no interaction states at all.** Confirmed via a fresh search across the whole node range (`66056:19051`–`66056:19326`) that no state-driven Figma component wraps `type="advanced_with_buttons"` the way `input_field` wraps `type="default"` and `textarea` wraps `type="textarea"` — genuinely absent, not overlooked. The gap was real independently of Figma: `Field`'s `advanced_with_buttons` branch had no `state` prop, no focus/value/hover tracking, and always rendered the same static `gray[100]`/`innerShadow` chrome — while `default` (via `InputField`) and `textarea` (via `Textarea`) both already had real interaction-driven chrome. `apps/docs`' own playground even documented this as a known gap ("falls back to Field's own plain `disabled` boolean").

Fixed by giving `Field` real interaction-driven state resolution for this branch only (`default`/`textarea` untouched) — the exact same pattern as `InputField`/`Textarea` (focus → `active`, non-empty value → `filled`, hover → `hover`, `disabled` always wins), reusing the same already-confirmed `fieldChromeStyle` the rest of the family shares rather than inventing new colors. Also added a `state?` override prop matching the existing pattern, and wired `disabled` through to the real `NewPinkButton`/`NewBlueButton`/`GreyscaleButton` shortcut buttons (native `disabled`, not just a visual dim) — those buttons already have their own confirmed disabled treatment, so this reuses it rather than drawing a new one.

**3. Chevron icon not centered / too large.** Traced to two compounding bugs in the `advanced_with_buttons` lead chip's chevron (`SelectChevronsIcon`, the second `left_icon` instance in the lead chip, distinct from `leadIconSize`'s own icon):
- `IconSlot` (the shared `<span>` wrapper used by every icon slot in `Field`) had no flex centering at all — a child SVG rendered as an inline block sitting on the text baseline, not the middle of its box. `ButtonShell` already has this exact centering (with a comment describing the same failure mode); `Field`'s `IconSlot` never got the equivalent fix. Fixed by adding `display: flex; align-items: center; justify-content: center` to `IconSlot` — benefits every icon slot in `Field`, not just the chevron.
- The chevron was hardcoded to `size={24}` for all 4 field sizes. Fresh `get_design_context` pulls on all 4 `advanced_with_buttons` size variants (`66056:19069`/`19101`/`19133`/`19165`) found the chevron's own confirmed size scales independently of `leadIconSize`: **24/20/18/16** at xl/lg/md/sm — only xl was ever correct. Added `leadChevronSize` to `ADVANCED_METRICS` with these confirmed values and pass it to both the `IconSlot` and the `SelectChevronsIcon`'s own `size` prop (previously never set, silently defaulting to 18 regardless of slot size).

Tests: 696/696 passing (`@shikho/ui`, up from 686), 54/54 passing (docs). Typecheck clean in both packages. Docs build clean. Verified live in the browser: `InputField`'s active border is now blue; `advanced_with_buttons` responds to real focus/hover/value and to a forced `disabled` state (including graying and disabling the shortcut button); the lead chip's chevron renders small and vertically centered.

**Follow-up: `buttonColor`'s default.** Direct follow-up request: the `advanced_with_buttons` shortcut button should be `Color/primary/500` (blue) by default. `buttonColor`'s default changed from `"secondary"` to `"primary"` — `NewBlueButton` instead of `NewPinkButton`. Same category as item 1 above: a deliberate code-only default, not a Figma correction — Figma's own confirmed `advanced_with_buttons` composition always uses `NewPinkButton`/secondary (§14), which remains available via `buttonColor="secondary"`, just no longer the default. All showcases that don't pass `buttonColor` explicitly (the per-size grid, the up-to-3-buttons demo, the states demo) now render blue by default, consistent with the change. Tests updated: the "defaults to X" test now asserts primary/blue, with a new test asserting `secondary` still reproduces the original confirmed pink.
