# Elevations Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `elevations` (node `16071:3771`), containing `elevation_wrap` (node `16071:3770`), within page `🌈 Styles & Foundations` (node `16105:29918`)
Method: `get_variable_defs` via Figma MCP (live desktop selection), cross-checked against `get_metadata` layer names. `e2` and `e6` values were confirmed via incidental bindings surfaced during the earlier Colors-frame and Typography-frame audits, respectively (see §10).
Status: **Audit only.** No code, tokens, components, or project configuration were generated. No variable or style names were renamed or normalized. Missing values (`e1`, `e3`, `e4`, `e5`) are marked **unresolved**, not treated as incomplete design decisions — their absence reflects a tool-retrieval gap, not a judgment that the design is unfinished.

---

## 1. All six elevation style names

| Style name | Node ID |
|---|---|
| `elevation / e1` | `69:3898` |
| `elevation / e2` | `69:3897` |
| `elevation / e3` | `16070:3767` |
| `elevation / e4` | `69:3895` |
| `elevation / e5` | `69:3894` |
| `elevation / e6` | `69:3893` |

All six exist as effect-style/variable names in the file. Only `e2` and `e6` have confirmed exact shadow values (see §2–3).

---

## 2. Confirmed exact shadow values for `elevation/e2`

**Confirmed — 2 shadow layers:**

| Layer | Type | Color | X | Y | Blur (radius) | Spread |
|---|---|---|---|---|---|---|
| 1 | DROP_SHADOW | `elevation/Black 50` (`#0000000a`) | 0 | 3 | 3 | −1.5 |
| 2 | DROP_SHADOW | `elevation/Black 50` (`#0000000a`) | 0 | 1 | 1 | −0.5 |

Verbatim from the export:
```
elevation/e2 = Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
```

---

## 3. Confirmed exact shadow values for `elevation/e6`

**Confirmed — 6 shadow layers:**

| Layer | Type | Color | X | Y | Blur (radius) | Spread |
|---|---|---|---|---|---|---|
| 1 | DROP_SHADOW | `elevation/Black 50` | 0 | 64 | 64 | −32 |
| 2 | DROP_SHADOW | `elevation/Black 50` | 0 | 32 | 32 | −16 |
| 3 | DROP_SHADOW | `elevation/Black 50` | 0 | 12 | 12 | −6 |
| 4 | DROP_SHADOW | `elevation/Black 50` | 0 | 6 | 6 | −3 |
| 5 | DROP_SHADOW | `elevation/Black 50` | 0 | 3 | 3 | −1.5 |
| 6 | DROP_SHADOW | `elevation/Black 50` | 0 | 1 | 1 | −0.5 |

Verbatim from the export:
```
elevation/e6 = Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 64), radius: 64, spread: -32);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 32), radius: 32, spread: -16);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 12), radius: 12, spread: -6);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 6), radius: 6, spread: -3);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
               Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
```

---

## 4. Shared shadow color token

Every confirmed shadow layer in both `e2` and `e6` uses the identical color variable:

- `elevation/Black 50` = `#0000000a` = `rgba(0,0,0,0.039)` (3.9% opacity black)

No other color appears in any confirmed shadow layer. All confirmed offsets are `x: 0` — every shadow is purely vertical (downward), with no horizontal component.

---

## 5. Confirmed multi-layer shadow behavior

**Confirmed:** both `e2` (2 layers) and `e6` (6 layers) are multi-layer shadow stacks, not single shadows. The number of layers matches the elevation number in both confirmed cases (e2 → 2 layers, e6 → 6 layers).

Whether this "layer count = elevation number" pattern extends to `e1` (1 layer), `e3` (3), `e4` (4), and `e5` (5) is an **inference**, not a confirmed fact — see §8.

---

## 6. Related radius, fill, and outline tokens found on the demo cards

These tokens style the demo rectangles themselves and are **separate from the shadow effect values** — retrieved directly from the Elevations frame:

| Card | Radius token | Value | Fill token | Value |
|---|---|---|---|---|
| e1 | `radius/border_radius_9xl` | 72 | `Color/White 100` | `#ffffff` |
| e2 | `radius/border_radius_8xl` | 64 | `Color/Gray 50` | `#f9f9fa` |
| e3 | `radius/border_radius_7xl` | 56 | `Color/Gray 100` | `#f4f4f6` |
| e4 | `radius/border_radius_6xl` | 48 | `Color/Gray` (unnumbered) | `#ebecf0` |
| e5 | `radius/border_radius_5xl` | 40 | `Color/Gray 300` | `#dddfe4` |
| e6 | `radius/border_radius_4xl` | 32 | *(none distinct retrieved)* | — |

Constant across all six cards:
- Outline/stroke: `outline/Gray 200` = `#ebecf0`
- Ambient shadow color reference present on every card query: `elevation/Black 50` = `#0000000a`

A stray, unrelated typography token (`web/Title/26 Semibold` and its underlying primitives: `font/size/heading_2 = 26`, `font/line_height/heading_2 = 32`, `font/letter_spacing/none = 0`) also surfaced from this subtree, presumably from a heading label elsewhere in the frame — not related to the elevation shadows or cards.

---

## 7. Confirmed semantic relationships

- **`elevation/e6` is a strict superset of `elevation/e2`:** e6's final two shadow layers (`offset (0,3) radius 3 spread -1.5` and `offset (0,1) radius 1 spread -0.5`) are **exactly identical**, value-for-value, to e2's complete two-layer stack. This is a confirmed structural relationship, not an inference — the values match precisely.
- Both confirmed styles alias the **same single color variable** (`elevation/Black 50`) across every layer — depth is expressed purely through offset/blur/spread progression, not through color variation.

---

## 8. Clearly labeled inferences (not confirmed)

The following are **inferences only**, derived from the two confirmed data points (e2, e6). None of these should be treated as verified values:

- **Inferred:** the elevation system is additive/cumulative — each higher level retains all shadow layers from the level below it and adds one new, larger, more diffuse layer on top. Basis: e6's shadow stack contains e2's full stack as its final two layers.
- **Inferred:** layer count may equal the elevation number for all six levels (e1 = 1 layer, e3 = 3, e4 = 4, e5 = 5), based on the fact that e2 = 2 layers and e6 = 6 layers.
- **Inferred, not confirmed:** a roughly geometric progression in offset/blur magnitude between e2 and e6 (values roughly doubling per step: 1, 3, 6, 12, 32, 64), which — if it held — might suggest approximate values for e3/e4/e5. **This is explicitly not to be treated as data.** No such values were retrieved, and none should be assumed accurate.
- **Inferred, not confirmed:** the demo-card fill/radius tokens appear to scale inversely to shadow intensity (largest radius/lightest fill on e1, smallest radius/darkest fill on e5 among named fills) — a structural observation from retrieved tokens, not a stated design rule.

---

## 9. Missing exact values for e1, e3, e4, and e5

**Status: unresolved — not confirmed missing from the design, only not retrievable via this MCP session.**

No shadow-layer values (offset, blur, spread, color, layer count) were obtained for:
- `elevation/e1`
- `elevation/e3`
- `elevation/e4`
- `elevation/e5`

These effect-style names are confirmed to exist (per the layer tree and demo card naming), but `get_variable_defs` did not surface their `Effect()` definitions from any node queried — neither the parent `elevations` frame, nor `elevation_wrap`, nor any of the four individual rounded-rectangle nodes carrying these names. No values have been invented or estimated to fill this gap.

---

## 10. MCP retrieval limitations and inconsistencies

- **Retrieval inconsistency:** `elevation/e2` and `elevation/e6` were **not** obtained by directly querying the Elevations frame. They surfaced as incidental variable bindings during earlier, unrelated audits — `e2` from the Colors-frame query, `e6` from the Typography-frame query. Direct queries against the Elevations frame (`16071:3771`), `elevation_wrap` (`16071:3770`), and each of the six individual rectangle nodes (`69:3898`, `69:3897`, `16070:3767`, `69:3895`, `69:3894`, `69:3893`) returned **zero** `elevation/e*` Effect entries in every case — only fill/radius/outline tokens.
- This suggests the demo rectangles in this frame may not carry a *bound* Effect Style variable in the way `get_variable_defs` expects to traverse — they may use a raw/hardcoded shadow value, a different effect-application mechanism, or a binding path this tool does not follow from this entry point. This is a **tool/access limitation**, not confirmation that the shadows are absent or unbound in the source file.
- **Unnamed variant found:** `Color/Gray` (no numeric suffix) appears on the e4 card, holding the same value (`#ebecf0`) as the numbered `Color/gray/200` documented in the Colors audit. Possible duplicate naming — not corrected here.
- No Variable Collection name or Mode (e.g. Light/Dark) metadata was retrievable for any elevation token, consistent with the same limitation noted in the Colors and Typography audits.
- Confirmation could not be obtained on whether `e1/e3/e4/e5` follow the inferred additive/geometric pattern in §8 — this remains genuinely unknown pending a working retrieval path (e.g. a live desktop selection made directly on each of those four nodes, which was attempted here but did not yield the effect data).
