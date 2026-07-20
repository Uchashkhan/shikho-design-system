# Tab Navigation Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Tab Navigation` overview (node `66081:32091`), containing three component sets
- Deep instance audit: `nav_bar_header` — `device=web` (node `66081:32222`) and `device=mobile` (node `66081:32226`), via `get_design_context`

Method: `get_metadata` and `get_variable_defs` for the overview; `get_design_context` (explicitly authorized) for the deep instance audit. Each finding is marked with its source.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component sets and node IDs

*(Source: `get_metadata`)*

| Name | Node ID |
|---|---|
| `tab_nav_item` | `66081:32109` |
| `tab_nav` | `66081:32170` |
| `nav_bar_header` | `66081:32221` |

(Plus an unrelated `overview_sheet_sidebar` instance, `66081:32092`.) Three component sets — the richest single overview structure in the nav-component family so far.

---

## 2. Exposed properties and variant values

*(Source: `get_metadata`)*

- `tab_nav_item`: **`size`** (xl, lg, md, sm, xs), **`type`** — **inactive, active** (only 2 — smallest type vocabulary of any nav component audited), **`state`** — **hover, default**
- `tab_nav`: **`size`** only
- `nav_bar_header`: **`device`** (🖥️ icon — a seventh distinct property-icon convention in this series, after 📐, ☘️, 💡, 🐷, 🧭, 🟣) — **web, mobile**

**Confirmed state-coverage gap:** `active` only ever appears with `state=default` — there is no `active`+`hover` variant at all. `inactive` gets both `hover` and `default`.

---

## 3. Variant counts

*(Source: `get_metadata`)*

- `tab_nav_item`: **15** — confirmed as 5 sizes × (`inactive`: 2 states + `active`: 1 state) = 5 × 3 = 15.
- `tab_nav`: **5** (size only).
- `nav_bar_header`: **2** (device only).
- **Combined total: 22.**

---

## 4. Sizes, states, types

*(Source: `get_metadata`)*

- **Sizes:** `tab_nav_item` — xl (152×56), lg (114×48), md (110×40), sm (98×32), xs (85×24). `tab_nav` shares the same 5 labels; width scales heavily while height matches `tab_nav_item` exactly. `nav_bar_header` has no size property.
- **States:** `hover, default` only, partially cross-produced (§2). **No `focus` state exists anywhere on `tab_nav_item`** — the most restrictive interaction coverage of any nav component audited (`switcher_item` had full focus coverage, `top_nav_item` had partial).
- **Types:** `inactive, active` only — no semantic-color variants (`active_primary`, `_outline`, etc.), confirming tabs use a simpler monochrome model than `switcher_item`/`sidebar_item`/`top_nav_item`.

---

## 5. Whether icons, badges, counters, labels, dividers, and active indicators are exposed as properties

*(Source: `get_metadata`)*

**None of these appear as named top-level variant properties** on `tab_nav_item` or `nav_bar_header`. The active-state indicator and divider mechanism were **confirmed structurally** in the deep audit (§11) — implemented via border styling, not an exposed property.

---

## 6. True component sets vs. demo compositions

*(Source: `get_metadata`)*

**`tab_nav_item` and `nav_bar_header` are true, atomic component sets.** **`tab_nav` is very likely a demo composition, not a primitive** — same reasoning as `sidebar_nav`/`top_nav`: width scales steeply per size while height matches `tab_nav_item` exactly. The deep audit of `nav_bar_header` (§11) directly confirms this composition pattern is real elsewhere in the same component family (nesting multiple `tab_nav_item` instances), lending indirect support to this hypothesis for `tab_nav` too, though `tab_nav` itself was not directly inspected.

---

## 7. Typography, spacing, radius, border, elevation, and effect tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
Typography:
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Title/26 Semibold   ← confirmed applied to the nav_bar_header page title in the deep audit
web/Title/18 Semibold, web/Title/13 Semibold
web/Body/13 Semibold, web/Body/12 Semibold, web/Body/11 Semibold
  ← the SemiBold-only pattern is now confirmed consistent across FIVE sibling components:
    list, switcher_item, sidebar_item, top_nav_item, tab_nav_item

Spacing: 0, 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 48
  ← spacing/20 and spacing/28 are new values, first seen in this audit

Radius:
radius/border_radius_round = 1000     radius/border_radius_xl = 20
radius/border_radius_0 = 0     radius/border_radius_5xl = 40     radius/border_radius_8xl = 64
  ← NO radius/custom/* tokens present at all

Outline: outline/Gray 200 / 400

Effects:
elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
```
**Confirmed absence: no `special_drop`, `outline/focus_primary`, or `outline/focus_gray`** — consistent with `tab_nav_item` having no `focus` state, matching the pattern already confirmed for `link`.

```
sizing/icon/14, 16, 18, 20, 24
```

---

## 8. Color and semantic tokens (overview-level)

*(Source: `get_variable_defs`, overview)*

```
Text/Gray 600 / 700 / 950
Color/White 100 = #ffffff     Color/white/50 = #ffffff0a
Color/Gray 100
Color/inverse_black_neutral = #ffffff
Color/smoke_low = #f9f9fa
outline/B = #000000   ← flagged at the overview stage as a possibly-corrupted/truncated variable name;
                          CONFIRMED real and functional in the deep audit (§11) — it is the active-tab
                          underline color, though its unusually short name remains an open naming anomaly
```

---

## 9. Duplicated, inconsistent, or suspicious variants (overview-level)

- **`outline/B`** — confirmed genuinely used (§11), but its truncated-looking name is still a flagged anomaly.
- **No `active`+`hover` variant** — a confirmed, real coverage gap.
- **`spacing/20` and `spacing/28`** — two entirely new spacing-scale values, expanding the confirmed spacing vocabulary.
- **Zero focus-state coverage** on `tab_nav_item` — the most restrictive of any interactive nav/selection component audited.

---

## 10. Comparing naming against Switcher, Sidebar Navigation, and Top Navigation

*(Source: `get_metadata` / `get_variable_defs`, overview)*

| | `switcher_item` | `sidebar_item` | `top_nav_item` | `tab_nav_item` |
|---|---|---|---|---|
| Type count | 5 | 6 | 7 | **2** |
| Type richness | semantic-color variants | semantic-color variants | semantic-color + outline variants | **plain active/inactive only** |
| State values | Default, Disabled, Focus, Hover (capitalized) | default, hover (lowercase) | focus, hover, default (lowercase, partial) | hover, default (lowercase, **most partial**) |
| Focus coverage | full | none | 5 of 7 types | **none** |
| Disabled coverage | yes | no | no | no |

**Confirmed: `tab_nav_item` is the simplest, least-featured member of this nav-component family.** While `switcher_item` → `sidebar_item` → `top_nav_item` show a clear escalation in type-vocabulary richness with confirmed deliberate naming reuse (per the Top Navigation audit), `tab_nav_item` breaks that trend with just 2 generic types and the sparsest state coverage of the four — consistent with tabs conventionally being a simpler, monochrome UI pattern. Casing is lowercase, matching `sidebar_item`/`top_nav_item`, not `switcher_item`'s capitalized convention.

---

## 11. Deep audit: `nav_bar_header` — `device=web` vs. `device=mobile`

*(Source: `get_design_context`)*

### Hierarchy (identical structure in both variants)
```
nav_bar_header (root)
├─ "header"
│  └─ <text> "Settings"
└─ "tab_nav"                                    [rendered — showTabs=true]
   ├─ "tab_nav_item" (active — "Account", nested instance)
   ├─ "tab_nav_item" (inactive — "Security", nested instance)
   ├─ "tab_nav_item" (inactive — "Preferences", nested instance)
   ├─ "tab_nav_item" (inactive — "Verify", nested instance)
   └─ "tab_nav_item" (inactive — "Transactions", nested instance)
```
Web root: `66081:32222` → children `66081:32223`–`66081:32225`, nested tabs `I66081:32225;66081:32192`–`196`.
Mobile root: `66081:32226` → children `66081:32227`–`66081:32229`, nested tabs `I66081:32229;66081:32192`–`196`.

### Confirmed facts
- **`showTabs` controls the entire `tab_nav` block's visibility** — confirmed via `{showTabs && (...)}` wrapping the whole tab row (container + all 5 nested tabs) in both variants; defaults to `true` in both.
- **Nested component dependency confirmed:** `nav_bar_header` composes **5 nested `tab_nav_item` instances** directly, matching the composition-over-configuration pattern already confirmed for `button_group`+`button`, `list`+`checkbox`, and `sidebar_item`+the shared Tag component.
- **Web vs. mobile differences, all confirmed:**

| Aspect | web | mobile |
|---|---|---|
| Root top padding | `spacing/40` (40px) | `spacing/24` (24px) |
| Root gap | none | `spacing/24` (24px) |
| Root `overflow-clip` | absent | present |
| Header horizontal padding | `spacing/48` (48px) | `spacing/24` (24px) |
| Header bottom padding | `spacing/24` (24px) | none (spacing via root gap instead) |
| Page title font size | 26px | 20px |
| `tab_nav` horizontal padding | `spacing/48` (48px) | `spacing/24` (24px) |
| `tab_nav` gap | `spacing/28` (identical) | `spacing/28` (identical) |
| Tab items | identical structure/labels/colors | identical |

  **Flagged discrepancy:** both variants cite the identical token name `font/size/heading_2` for the page title, yet the resolved value differs (26px web vs. 20px mobile) — the mechanism (per-device token mode vs. manual instance override) is not determinable from this data.
- **Layout:** root `flex-col items-start` in both; `header` `flex items-start gap-[spacing/8, 8px]`; `tab_nav` `flex items-center gap-[spacing/28, 28px]`; each `tab_nav_item` `flex items-center justify-center gap-[spacing/8, 8px]`, `h-[40px]` Fixed, **asymmetric vertical padding** (`pt-4/pb-12`), `px-0` (no horizontal padding — tab spacing comes entirely from `tab_nav`'s own gap).
- **Page title typography:** SemiBold, `font/line_height/heading_2` (32px), color `text/gray-950` (`#0a0c11`), no tracking — confirmed `web/Title/26 Semibold` (web instance).
- **Divider implementation — confirmed, two-part, identical in both devices:**
  - Container-level: `tab_nav`'s own `border-b`, color **`outline/gray-100`** (`#f4f4f6`) — thin, full-width line under the entire tab row.
  - Active-tab indicator: the "Account" tab individually carries its own **`border-b-2`**, color **`outline/b`** (resolves to black) — layered on top to create the underline-style active-tab indicator. **This resolves the "suspicious `outline/B`" flag from the overview audit** — the token is confirmed real and functional, though its truncated-looking name remains an open naming anomaly.
- **Sizing:** root Hug both axes (no explicit size class); `header`/`tab_nav` `w-full` (Fill), height Hug; `tab_nav_item` `h-[40px]` Fixed, width Hug.
- **Token usage confirmed applied:** `Color/white-100`, `text/gray-950`, `text/gray-600`, `outline/gray-100`, `outline/b`, the full spacing set listed above, `web/Title/26 Semibold`, `web/Body/13 Semibold`.

### Not confirmed / unresolved
- Whether `device` has values beyond `web`/`mobile` (e.g. tablet).
- Why the page title's font size differs under the identical token name.
- The origin of `outline/b`'s unusually short name.
- Whether the separate `tab_nav` component set uses this exact same nested-instance pattern — not directly inspected.
- Real tab icon content — none present, all five tabs are text-only in this data.

---

## 12. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit); `secondary_button_effect` (Buttons audit, likely spillover); `radius/border_radius_round/xl/0/5xl/8xl` (Button Group and every subsequent multi-component audit); `Color/smoke_low`, `Color/inverse_black_neutral` (Input, List, Switcher, Sidebar Navigation, Top Navigation audits); `Text/Gray` family (Colors and every subsequent audit); `web/Body/11/12/13 Semibold`, `web/Title/13/18/26 Semibold` (Typography, List, Switcher, Sidebar Navigation, Top Navigation audits — now confirmed consistent across five sibling components); `sizing/icon/14/16/18/20/24` (Buttons, List, Switcher, Sidebar Navigation, Top Navigation audits); the confirmed nested-instance composition pattern (`nav_bar_header` + `tab_nav_item`) mirroring `button_group`+`button`, `list`+`checkbox`, `sidebar_item`+Tag.

---

## 13. Anything MCP cannot retrieve

- Whether `tab_nav` (the standalone component set) is genuinely a composed demo, or a standalone primitive — the `nav_bar_header` deep audit lends indirect support but doesn't directly confirm this for `tab_nav` itself.
- Why the page title's font size differs (26px vs. 20px) under the identical token name.
- The origin/reason for `outline/b`'s unusually short, truncated-looking name.
- Why no `active`+`hover` variant exists on `tab_nav_item`.
- Why `tab_nav_item` has zero focus-state coverage while `top_nav_item` has partial and `switcher_item` has full coverage.
- Default variant configuration for any of the three component sets.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
