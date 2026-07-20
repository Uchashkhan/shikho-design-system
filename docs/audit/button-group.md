# Button Group Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frames audited:
- `Button Group` overview (node `66053:14301`), containing the `button_group` component set
- Deep instance audit: `button_group` / `📐 size=xs, count=3` (node `66053:13562`)

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection) for the overview audit; `get_design_context` (explicitly authorized for this task) for the deep structural audit. Each finding below is marked with its source method.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Exact component-set name and node ID

**`button_group`** — node `66053:13558`, nested within an overview frame named `Button Group` (`66053:14301`). *(Source: `get_metadata`)*

---

## 2. Complete list of exposed properties

Exactly two: **`size`** and **`count`**. No `type` and no `state` property exists on `button_group` itself. *(Source: `get_metadata`)*

---

## 3. Every size and count value

- `size`: **xs, sm, md, lg, xl**
- `count`: **2, 3, 4, 5, 6**

*(Source: `get_metadata`)*

---

## 4. Total variant count

**25 variants** (5 sizes × 5 counts), confirmed — one symbol per combination, no gaps in the matrix. *(Source: `get_metadata`)*

---

## 5. Supported button counts

Confirmed range: **2 to 6 buttons per group.** No `count=1` (single button) variant and no `count=7` or higher exists. *(Source: `get_metadata`)*

---

## 6. Confirmed layout direction

**Horizontal**, confirmed by two independent methods:
- *(Metadata-derived)* For every `size`, height stays constant while width increases linearly with `count` (e.g. `xs`: 172 → 258 → 344 → 430 → 516 px as count goes 2→3→4→5→6; height fixed at 24 throughout).
- *(get_design_context-confirmed)* The root container's class is `content-stretch flex items-start relative` — `flex` with no direction override defaults to row (horizontal). This directly confirms the layout direction that was previously only derived arithmetically.

---

## 7. Width progression and the derived 0px group gap

Confirmed bounding-box widths per size across all five counts: *(Source: `get_metadata`)*

| Size | count=2 | count=3 | count=4 | count=5 | count=6 | Solved unit width | Solved gap |
|---|---|---|---|---|---|---|---|
| xs | 172 | 258 | 344 | 430 | 516 | 86 | 0 |
| sm | 202 | 303 | 404 | 505 | 606 | 101 | 0 |
| md | 240 | 360 | 480 | 600 | 720 | 120 | 0 |
| lg | 264 | 396 | 528 | 660 | 792 | 132 | 0 |
| xl | 330 | 495 | 660 | 825 | 990 | 165 | 0 |

Solving `width(n) = n × buttonWidth + (n−1) × gap` from consecutive counts yields **gap = 0 for every size** — a mathematical derivation from exact confirmed dimensions (not a screenshot estimate).

**This was independently confirmed** by `get_design_context` on the `xs/count=3` instance: the root container carries **no `gap-` class at all**, defaulting to 0px between segments. The two methods agree exactly.

*Discrepancy noted:* each solved per-size unit width (86/101/120/132/165) is consistently 1–2px smaller than the standalone single-button width for the same size step audited in `buttons.md` (e.g. `xs` single button = 87px vs. 86px solved here) — see §19.

---

## 8. Confirmed spacing and padding tokens

*(Source: `get_design_context`, `xs/count=3` instance)*

- **Padding, per button segment:** `px-[var(--spacing/6,6px)] py-[var(--spacing/4,4px)]` — horizontal padding = `spacing/6` (6px), vertical padding = `spacing/4` (4px). **This resolves the previously-unattributed spacing tokens** flagged in the single-button deep audit (`spacing/0`, `spacing/4`, `spacing/6` were bound but unassigned there).
- **Gap within each segment** (between left_icon / text_wrap / right_icon): `gap-[var(--spacing/0,0px)]` = **0px, explicitly confirmed**. The visible icon-to-label spacing comes from `text_wrap`'s own `px-[var(--spacing/4,4px)]` padding, not a flex gap.
- **Gap between the three button segments** (group level): **0px** (no gap class on root — see §7).

---

## 9. Confirmed Hug / Fill / Fixed sizing behavior

*(Source: `get_design_context`, `xs/count=3` instance)*

- **Root (`button_group`):** no explicit width/height class — sized by its children → **Hug**, both axes.
- **Each button segment:** `h-[24px]` (**Fixed** height) + `shrink-0`; no explicit width class → content-driven → **Hug** width.
- **Icons:** `size-[14px]` → **Fixed**, both axes.
- **text_wrap:** no fixed width/height → **Hug**, sized to text content.

---

## 10. Complete internal layer hierarchy of the selected variant

*(Source: `get_design_context` — entirely hidden from metadata-only inspection in the prior overview audit, which returned this node as a leaf)*

```
66053:13562  "button_group" instance (root, size=xs, count=3)
├─ 66053:13563  "button"  (segment 1 — left)
│  ├─ I66053:13563;48:2029        "left_icon"   (14×14)
│  │  └─ I66053:13563;48:2029;29:307   "vector"
│  ├─ I66053:13563;50046:96100    "text_wrap"
│  │  └─ I66053:13563;48:2030     <text> "Button"
│  ├─ I66053:13563;48:2031        "right_icon"  (14×14)
│  │  └─ I66053:13563;48:2031;29:307   "vector"
│  └─ (unnamed absolute overlay — inner-shadow layer, no node-id given)
├─ 66053:13564  "button"  (segment 2 — middle)
│  ├─ I66053:13564;48:2029        "left_icon"  → I66053:13564;48:2029;29:307 "vector"
│  ├─ I66053:13564;50046:96100    "text_wrap"  → I66053:13564;48:2030 <text> "Button"
│  ├─ I66053:13564;48:2031        "right_icon" → I66053:13564;48:2031;29:307 "vector"
│  └─ (unnamed absolute overlay — inner-shadow layer)
└─ 66053:13565  "button"  (segment 3 — right)
   ├─ I66053:13565;48:2029        "left_icon"  → I66053:13565;48:2029;29:307 "vector"
   ├─ I66053:13565;50046:96100    "text_wrap"  → I66053:13565;48:2030 <text> "Button"
   ├─ I66053:13565;48:2031        "right_icon" → I66053:13565;48:2031;29:307 "vector"
   └─ (unnamed absolute overlay — inner-shadow layer)
```

---

## 11. Confirmation that segments are nested component instances, not custom layers

**Confirmed.** Children of each "button" segment carry the `I<parentId>;<componentId>` ID pattern (e.g. `I66053:13563;48:2029`) — Figma's standard notation for "a node inside an instance of another component." This confirms `left_icon`, `text_wrap`, and `right_icon` are internals of a nested Button-type component instance placed inside each segment, not hand-drawn layers local to `button_group`. *(Source: `get_design_context`)*

---

## 12. All child layer names and node IDs

Listed in full in §10. Component references reused identically across all three segments: `48:2029` (left_icon), `48:2030` (text), `48:2031` (right_icon), `50046:96100` (text_wrap), `29:307` (vector). *(Source: `get_design_context`)*

---

## 13. Confirmed icon, text, and text_wrap structure

*(Source: `get_design_context`)*

- **Text:** each segment's `text_wrap` contains one `<p>` with literal content **"Button"** (placeholder text).
- **Icon slots:** each segment has both a `left_icon` and a `right_icon`, each `14×14`, each containing one `vector` child with an `<img>` pointing to the **same** asset URL across all icons in this instance — the specific glyph is not distinguishable from this data alone (possibly a shared placeholder in this demo instance).
- No per-segment content differentiation is present — all three segments show identical text and icon overrides in this instance (see §17).

---

## 14. Confirmed typography, icon-size, border, elevation, and effect tokens

*(Source: `get_design_context`, confirmed as actually applied — not incidental spillover)*

```
Typography (label text):
  font-['Noto_Sans_Bengali:SemiBold'] font-semibold
  leading-[var(--font/line_height/caption_1,16px)]
  text-[length:var(--font/size/caption_1,11px)]
  tracking-[var(--font/letter_spacing/none,0px)]
  text-[color:var(--text/white-950,white)]
  → matches "Caption 1" / web/Body/11 Semibold exactly, per the Typography audit.

Icon size: size-[14px] → sizing/icon/14

Border color (all segments): border-[var(--outline/black-50,rgba(0,0,0,0.04))] → outline/Black 50 = #0000000a

Fill (all three segments in this instance): bg-[var(--color/secondary/500,#e2008d)] → Color/secondary/500

Elevation / effect tokens confirmed present and applied (listed in the tool's "styles contained in the design" footer):
  elevation/e2 = Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
                 Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
  secondary_button_effect = Effect(type: INNER_SHADOW, color: neutral_transparent_Black/Black 7, offset: (0, -1), radius: 3, spread: -2);
                            Effect(type: INNER_SHADOW, color: Color/white/50, offset: (0, 1), radius: 3, spread: -2);
                            Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
                            Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)

Still unresolved: secondary_special_outline = ""  (empty, consistent with every prior audit in this series)
```

This upgrades `elevation/e2`, `secondary_button_effect`, and the Caption-1 typography token from "bound in subtree, application unconfirmed" (as reported in the overview audit) to **confirmed actually applied** to this component.

---

## 15. Corner-radius behavior for outer and inner segments

**Fully confirmed** *(Source: `get_design_context`)*:
- Segment 1 (`66053:13563`, left/outer): `rounded-bl-[radius/custom/xs,6px] rounded-tl-[radius/custom/xs,6px]` — left corners only, 6px.
- Segment 2 (`66053:13564`, middle/inner): **no rounding classes at all** — fully square.
- Segment 3 (`66053:13565`, right/outer): `rounded-br-[radius/custom/xs,6px] rounded-tr-[radius/custom/xs,6px]` — right corners only, 6px.

This resolves the speculative `radius/border_radius_0` hypothesis raised in the prior overview audit — the middle segment simply **omits** rounding classes rather than applying an explicit `0` radius token (see §18).

---

## 16. Confirmed border strategy (middle segments omit left/right borders)

**Confirmed** *(Source: `get_design_context`)*:
- Segment 1 (left, outer): `border border-[outline/Black 50] border-solid` — full 4-side border.
- Segment 2 (middle, inner): `border-[outline/Black 50] border-b border-t border-solid` — **only top and bottom**; left/right explicitly omitted.
- Segment 3 (right, outer): full 4-side border (same as segment 1).

The seamless joined appearance comes from the middle segment simply not drawing its own left/right borders — a confirmed structural fact, not an overlap/z-fighting technique.

---

## 17. Relationship between the `count` property and rendered children

**Confirmed for `count=3`:** exactly 3 nested Button instances render, in a zero-gap horizontal row, with a strict first/middle/last treatment — first gets left-corner rounding + full border, last gets right-corner rounding + full border, and the (single) middle instance gets square corners + top/bottom-only border. All three segments carry identical overrides in this instance (fill = `Color/secondary/500`, text = "Button", same icon asset both sides).

**Not confirmed:** whether `count=4/5/6` repeat the identical "square, top/bottom-border-only" treatment for every additional middle segment — `count=3` only produces one middle segment, and inspecting other `count` variants was out of scope for this task (no inference from sibling variants).

---

## 18. Newly discovered tokens and resolved findings

- **`radius/border_radius_0`** — found bound in the overview audit (`get_variable_defs`); the deep instance audit **resolved** its likely role: the middle segment doesn't need this token at all, since it simply omits rounding classes. Whether `radius/border_radius_0` is bound elsewhere in the file for the same purpose remains unconfirmed.
- **`elevation/e5`** — fully resolved in the overview audit as a 5-layer drop shadow (`offset (0,56)/(0,32)/(0,6)/(0,3)/(0,1)`, `radius 56/32/6/3/1`, `spread -28/-16/-3/-1.5/-0.5`), all using `elevation/Black 50`. This is new data not previously confirmed in the Elevations audit, where `e5` was listed as unresolved.
- **`outline/Black 50`** — confirmed via `get_design_context` as the actual applied border color on all three segments of the `xs/count=3` instance (`#0000000a`).
- **`spacing/4`** — confirmed via `get_design_context` as the vertical padding on each button segment (`py-[spacing/4,4px]`).
- **`spacing/6`** — confirmed via `get_design_context` as the horizontal padding on each button segment (`px-[spacing/6,6px]`).

---

## 19. Cross-reference findings from `buttons.md`

- **Uses the `xl` size scale, not `xxl`:** `button_group`'s sizes (`xs, sm, md, lg, xl`) match "Scale A" (used by `button_danger`, `button_success`, `Greyscale`, `icon_button`) rather than "Scale B" (`xxl`, used by `new_blue`, `new_pink`, `ai_rounded`, `ai_regular`).
- **Does not expose `type` or `state` properties:** unlike every individual button component set in `buttons.md`, `button_group` exposes only `size` and `count` — no color/style variant, no interaction-state variant, at the component-set level.
- **Segment widths differ slightly from standalone buttons:** the solved per-size unit widths in `button_group` (86/101/120/132/165 for xs/sm/md/lg/xl) are consistently 1–2px smaller than the corresponding standalone single-button widths audited in `buttons.md` (e.g. `xs` standalone = 87px vs. 86px solved here). The mechanism for this discrepancy (e.g. shared/overlapping borders between adjacent segments) is **not confirmed** — flagged as an observation only.

---

## 20. All unresolved areas and MCP limitations

- **Whether `count=4/5/6` reuse the same middle-segment treatment** for every additional inner segment — not inspected, out of scope (§17).
- **Instance-swap properties and boolean component properties** (e.g. whether icon presence is a toggle) — not retrievable; `get_design_context` shows only the currently-rendered output of this instance, not the source Button component's exposed property schema.
- **The exact icon glyph** — both icons in this instance point to the same placeholder vector asset; the real distinct icon (if any) isn't confirmed.
- **Primary-axis (`justify-`) alignment at the group level** — no explicit class was present on the root container beyond `items-start` (cross-axis); main-axis distribution beyond default flex-start packing is not explicitly declared.
- **The exact mechanism behind the 1–2px width discrepancy** vs. standalone buttons (§19) — not confirmed.
- **`secondary_special_outline`** — still resolves to an empty value across every audit in this series, including this one.
- **Default variant configuration** for the `button_group` component set — not exposed by either `get_metadata` or `get_variable_defs`.
- **Variable Collection / Mode metadata** — not retrievable, consistent with every prior audit in this series.
