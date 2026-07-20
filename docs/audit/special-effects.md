# Special Shadows & Outlines Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Special Shadows & Outlines` (node `64854:17549`), within page `🌈 Styles & Foundations` (node `16105:29918`)
Method: `get_variable_defs` via Figma MCP (live desktop selection), queried against the parent frame and each individual rectangle node, cross-checked against `get_metadata` layer names. `secondary_button_effect`'s full definition was confirmed via an incidental binding surfaced during an earlier, unrelated audit (see §8).
Status: **Audit only.** No code, tokens, or components were generated. No variable or style names were renamed or normalized. Unresolved effect geometry is marked as an **MCP retrieval limitation**, not as missing or incomplete design work.

---

## 1. Special outline styles

Two styles, under the "Special Outlines" heading:

| Style name | Node ID | Confirmed color(s) |
|---|---|---|
| `Primary Special Outline` | `64854:17594` | `outline/Black 150` = `#0000001f`; `outline/Black 300` = `#0000003d` |
| `Secondary Special Outline` | `64854:17597` | `outline/Black 50` = `#0000000a`; `outline/Black 100` = `#00000012` |

Exact stroke geometry (width, style) was not retrieved — see §8.

---

## 2. Focus ring styles

Five styles, under the "Focus" heading:

| Style name | Node ID | Confirmed color |
|---|---|---|
| `focus_primary` | `64854:17610` | `Color/primary/500_alpha_24` = `#5468ff3d` |
| `focus_secondary` | `64854:17622` | `Color/Secondary/500_alpha_24` = `#e2008d3d` |
| `focus_danger` | `64861:17625` | `Color/Secondary/500_alpha_24` = `#e2008d3d` **(see §9)** |
| `focus_success` | `64861:17628` | `Color/success/500_alpha_24` = `#35c2203d` |
| `focus_gray` | `64861:17631` | `outline/Gray 300` = `#dddfe4` |

Exact ring geometry (offset, width/spread) was not retrieved — see §8.

---

## 3. Special effect styles

Four styles, under the "Special Effects" heading:

| Style name | Node ID | Confirmed color(s) |
|---|---|---|
| `primary_button_effect` | `64861:17637` | `Color/gray/50` `#f9f9fa`; `Color/white/600` `#ffffff8f`; `elevation/Black 50` `#0000000a`; `Color/white/500` `#ffffff7a` |
| `secondary_button_effect` | `64861:17643` | Full definition confirmed — see §4 |
| `input_inner_shadow` | `64861:17652` | `Color/gray/50` `#f9f9fa`; `Color/black/50` `#0000000a` |
| `special_drop` | `64861:17640` | `Color/white/50` `#ffffff0a`; `Color/black/50` `#0000000a` |

---

## 4. The fully confirmed `secondary_button_effect` definition

The only style in this frame with a fully confirmed `Effect()` definition (offset, blur, spread, and layer count), obtained via an incidental binding — not a direct query against this frame (see §8):

| Layer | Type | Color | X | Y | Blur (radius) | Spread |
|---|---|---|---|---|---|---|
| 1 | INNER_SHADOW | `neutral_transparent_Black/Black 7` (`#00000012`) | 0 | −1 | 3 | −2 |
| 2 | INNER_SHADOW | `Color/white/50` (`#ffffff0a`) | 0 | 1 | 3 | −2 |
| 3 | DROP_SHADOW | `elevation/Black 50` (`#0000000a`) | 0 | 3 | 3 | −1.5 |
| 4 | DROP_SHADOW | `elevation/Black 50` (`#0000000a`) | 0 | 1 | 1 | −0.5 |

Verbatim from the export:
```
secondary_button_effect =
  Effect(type: INNER_SHADOW, color: neutral_transparent_Black/Black 7, offset: (0, -1), radius: 3, spread: -2);
  Effect(type: INNER_SHADOW, color: Color/white/50, offset: (0, 1), radius: 3, spread: -2);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
```

**Confirmed: 4 layers total — a mixed-type composite of 2 inner shadows + 2 drop shadows.** This is the only style in this frame where layer count and effect type (INNER_SHADOW vs. DROP_SHADOW) are confirmed rather than assumed.

---

## 5. All confirmed color bindings

Every color variable retrieved directly from this frame's nodes, verbatim:

```
outline/Black 150                    = #0000001f
outline/Black 300                    = #0000003d
outline/Black 50                     = #0000000a
outline/Black 100                    = #00000012
outline/Gray 300                     = #dddfe4
Color/primary/500_alpha_24           = #5468ff3d
Color/Secondary/500_alpha_24         = #e2008d3d
Color/success/500_alpha_24           = #35c2203d
Color/gray/50                        = #f9f9fa
Color/white/600                      = #ffffff8f
Color/white/500                      = #ffffff7a
Color/white/50                       = #ffffff0a
Color/black/100                      = #00000012
Color/black/50                       = #0000000a
neutral_transparent_Black/Black 7    = #00000012   (secondary_button_effect only)
elevation/Black 50                   = #0000000a
```

Incidentally present but unrelated to shadows/outlines: `radius/border_radius_9xl = 72`, `Color/Gray` (unnumbered) `= #ebecf0`.

---

## 6. Shared aliases and semantic relationships

- **`outline/Black 50/100/150/300` are confirmed aliases of the primitive black-opacity ramp** documented in the Colors audit: `outline/Black 50` = `Color/black/50` (3.9%), `outline/Black 100` = `Color/black/100` (7.1%), `outline/Black 150` = `Color/black/150` (12.2%), `outline/Black 300` = `Color/black/300` (23.9%) — values match exactly.
- **`elevation/Black 50` is reused here identically** to its role in the Elevations audit (`#0000000a`), confirming this token is shared across the elevation-shadow system and the special-effects system rather than being effect-family-specific.
- **`neutral_transparent_Black/Black 7`** (used only in `secondary_button_effect`) resolves to the same value as `Color/black/100` (`#00000012`) — another confirmed cross-reference to the primitive black ramp, under yet a third naming convention (`neutral_transparent_Black/*`, distinct from both `outline/Black *` and `Color/black/*`).

---

## 7. The confirmed alpha naming pattern

The `_alpha_24` suffix used in `Color/primary/500_alpha_24`, `Color/Secondary/500_alpha_24`, and `Color/success/500_alpha_24` is **confirmed accurate**: all three decode to an alpha channel of `3d` hex = 61/255 = 23.9% (≈ 24%), matching the naming exactly. This is a verified, reliable naming convention for this specific token family — not an assumption.

---

## 8. Retrieval limitations and unresolved effect geometry

**Marking as MCP retrieval limitations, not missing design work**, per your instruction:

- Direct queries against this frame — the parent frame node, and each individual rectangle node for every outline, focus ring, and special-effect style — returned **only color variables**, never a full `Effect()` definition, with the single exception of `secondary_button_effect`.
- `secondary_button_effect`'s full definition (§4) was **not** obtained by querying this frame. It surfaced as an incidental binding during an earlier, unrelated audit query (against node `16074:55841`, an "overview_sheet" instance elsewhere in the file). This mirrors the exact retrieval pattern documented in the Elevations audit, where `elevation/e2` and `elevation/e6` also only surfaced incidentally rather than from direct queries against their own frame.
- **Unresolved for all other 10 styles** (`Primary Special Outline`, `Secondary Special Outline`, `focus_primary`, `focus_secondary`, `focus_danger`, `focus_success`, `focus_gray`, `primary_button_effect`, `input_inner_shadow`, `special_drop`): exact X/Y offset, blur radius, spread, and confirmed layer count. Only the color(s) bound to each node were retrievable.
- **Effect type is unconfirmed** for all 10 of those styles — whether each is truly an INNER_SHADOW, DROP_SHADOW, or a plain stroke/border is inferred from the style *name* only (e.g. "Special Outline" suggests a stroke; "focus_*" suggests a ring; "*_effect"/"*_shadow"/"*_drop" suggests a shadow), not confirmed from actual effect data. This inference is flagged, not treated as fact.
- This pattern suggests the demo rectangles in this frame may not carry a *bound* Effect Style variable in the way `get_variable_defs` traverses from a direct selection on this subtree — consistent with the same tool/access limitation identified in the Elevations audit, not evidence that the underlying styles are absent or unbound in the source file.
- No Variable Collection or Mode metadata was retrievable for any token in this frame, consistent with every prior audit in this series.

---

## 9. The suspected `focus_danger` binding issue

`focus_danger` (node `64861:17625`) resolves to `Color/Secondary/500_alpha_24` = `#e2008d3d` — **the exact same color variable as `focus_secondary`** (node `64854:17622`).

This is flagged as a **likely binding inconsistency**, not corrected:
- A parallel `Color/danger/500` = `#f03d3d` exists in the design system (confirmed in the Colors audit), which would be the expected source color for a "danger" focus ring.
- Every other focus ring in this set maps to its own matching brand/functional color (`focus_primary` → `Color/primary/500_alpha_24`, `focus_success` → `Color/success/500_alpha_24`), following a clear one-to-one naming-to-color convention.
- `focus_danger` breaks that convention by pointing at the Secondary brand color instead of the Danger functional color.
- This is reported as **suspected**, based on the pattern of the other four styles — it has not been independently verified against design intent, and it has not been fixed or reassigned.

---

## 10. Naming inconsistencies within the focus styles

- **`focus_gray` breaks the alpha-suffix convention:** `focus_primary`, `focus_secondary`, `focus_danger`, and `focus_success` all bind to a `Color/{name}/500_alpha_24` token (a semi-transparent variant of a 500-step brand/functional color). `focus_gray` instead binds to `outline/Gray 300` — a plain, fully opaque color with no `_alpha` suffix and no `500` step reference. This is a naming/binding pattern break within an otherwise consistent group of five.
- **Three distinct naming conventions for the same underlying opacity value** are present across this frame and prior audits: `outline/Black *` (this frame), `Color/black/*` (Colors audit), and `neutral_transparent_Black/Black *` (this frame, `secondary_button_effect` only) — all resolving to identical hex values at matching steps, but named under three different prefixes with no single canonical name.
- The unnumbered `Color/Gray` variant (`#ebecf0`) — also seen in the Elevations audit — appears again here alongside the numbered gray ramp, without a stated reason for the two parallel forms.
