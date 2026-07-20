# Modal Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Modals` overview (node `66086:36904`).

Method: `get_metadata` and `get_variable_defs` via Figma MCP (live desktop selection). `get_design_context` was deliberately not used for this audit — no internal layer structure was inferred.
Status: **Audit only.** No code, components, or project configuration were generated. No variable, style, or layer names were renamed or normalized.

---

## 1. Component sets and node IDs

| Name | Node ID | Classification |
|---|---|---|
| `modal` | `66086:36924` | true component set |
| `modal_header` | `66086:36922` | single bare instance, **not expanded** |
| `modal_actions` | `66086:36923` | single bare instance, **not expanded** |

(Plus an unrelated `overview_sheet_sidebar` instance, `66086:36905`.)

---

## 2. Exposed properties and variant values

`modal` exposes one: **`type`** — **default, confirmation**. `modal_header` and `modal_actions` have no confirmable properties — both are bare instances in this metadata, not expanded component sets.

Confirmed dimensions: `default` = 544×352, `confirmation` = 480×256 (smaller/more compact, consistent with a simple confirmation-dialog pattern vs. a fuller general-purpose modal).

---

## 3. Variant count

**`modal`: 2 variants** (type only), confirmed against the full symbol list. `modal_header` and `modal_actions`: 0 confirmable variants each (bare instances).

---

## 4. Sizes, states, types

- **Sizes:** none — no `size` property exists on `modal`.
- **States:** none — consistent with `pagination`, `Progress`, and `date_picker`, though not universal (`table_cell` had a `state` axis).
- **Types:** `default, confirmation` only. No `alert`/`fullscreen`/`bottom-sheet` or other modal-pattern variants exist in this selection.

---

## 5. Whether the system exposes properties for header, body/content, footer, close button, icon/illustration, primary action, secondary action, dismissible behavior, overlays/backdrops, fullscreen/mobile variants

**None of these are exposed as properties on `modal` itself** (which has only `type`). However:
- **Header:** confirmed to exist as a real, separately-composed piece — `modal_header` is a named instance in this selection, though not expanded to reveal its own properties.
- **Footer/actions:** confirmed to exist — `modal_actions` is likewise a named instance present in this selection.
- **Body/content, close button, icon/illustration, dismissible behavior, overlay/backdrop, fullscreen/mobile:** none of these appear anywhere in this selection. Their existence elsewhere in the file, or as internal layers within `modal`, cannot be confirmed without `get_design_context`.

---

## 6. True component sets vs. demo compositions or bare instances

**`modal` is a true, atomic component set** (2 variants). **`modal_header` and `modal_actions` are confirmed real, separately-named pieces of the system, but appear only as bare, unexpanded instances** — their internal variant structure (if any) is not visible in this metadata.

---

## 7. Whether the system separates modal / modal_header / modal_body / modal_footer / modal_actions / modal_overlay

**Confirmed partial separation:**
- **`modal`** exists as a true component set.
- **`modal_header`** exists, confirmed by name, but only as a bare instance here.
- **`modal_actions`** exists, confirmed by name, but only as a bare instance here — functionally likely serves the "footer" role, though no component literally named `modal_footer` was found.
- **`modal_body`** — does not appear anywhere in this selection.
- **`modal_overlay`** — does not appear anywhere in this selection.

This confirms the system modularizes at least header and actions/footer as distinct composable pieces, but body content and any backdrop/overlay mechanism are either handled entirely inside `modal` itself, or exist elsewhere in the file outside this selection.

---

## 8. Typography tokens

```
web/Title/22 Semibold, web/Title/76 Semibold, web/Title/32 Medium   ← likely unrelated spillover
web/Title/13 Semibold, web/Title/13 Medium
web/Body/13 Semibold, web/Body/13 Medium
```
Consistent with the same body_1-scale Semibold/Medium pairing seen in the Table audit — plausibly Semibold for a modal title and Medium for body copy, not confirmed.

---

## 9. Spacing, sizing, radius, border, elevation, and effect tokens

```
spacing/0, 4, 6, 8, 10, 12, 16, 24, 32, 40, 48

radius/border_radius_round = 1000
radius/border_radius_xl = 20     radius/border_radius_0 = 0
radius/border_radius_2xl = 28   ← BRAND NEW token, not seen in any prior audit — joins "xxl" (24, Date Picker)
                                    and "100" (Toggle) as yet another large-radius naming variant, further
                                    fragmenting the radius-naming landscape (now at least 5 distinct systems:
                                    custom/*, border_radius_{word}, border_radius_{number}, xxl, 2xl)
radius/custom/xl = 16     radius/custom/lg = 12
radius/border_radius_5xl = 40     radius/border_radius_8xl = 64

outline/Black 50 / 100 / 150 / 300     outline/Gray 200 / 400

elevation/e2 = (confirmed 2-layer, identical to prior audits)
elevation/e5 = (confirmed 5-layer, identical to prior audits)
elevation/e6 = (confirmed 6-layer, identical to the Toast audit — consistent with modal being one of the most
                  prominent floating/overlay UI elements, matching Toast's heaviest-elevation treatment)
secondary_button_effect = (confirmed 4-layer, identical to Buttons audit — likely spillover)
primary_button_effect = (confirmed 4-layer, identical to Buttons/Alerts/Toasts/Pagination/Date Picker audits —
                            plausibly applied to the modal's primary action button, given modal_actions exists)
primary_special_outline = ""     secondary_special_outline = ""
  ← both confirmed unresolved together in one subtree — same pairing seen in the Top Navigation audit

sizing/icon/18
```

---

## 10. Color and semantic tokens

```
Text/Gray 600 / 700 / 950
Color/White 100 = #ffffff     Color/white/50 / 500 / 600 / 950     Text/White 950
Color/primary_med_em = #85a4ff     Color/primary_low_em_alpha = #5468ff33     Color/primary_base_em_alpha = #5468ff1f
Text/Primary 500 = #5468ff     Color/primary/500 = #5468ff
Color/gray/100
Color/smoke_base = #ffffff     Color/smoke_low = #f9f9fa
Color/inverse_black_neutral = #ffffff
```

---

## 11. Duplicated, inconsistent, or suspicious variants

- **`radius/border_radius_2xl` (28) is a brand-new token**, further fragmenting the already-inconsistent radius-naming landscape (now including `custom/*`, `border_radius_{word}`, `border_radius_{number}` like `0`/`100`, `xxl`, and `2xl`).
- **Both `primary_special_outline` and `secondary_special_outline` unresolved together in the same subtree** — the second confirmed instance of this pairing (after Top Navigation).
- **`modal_header`/`modal_actions` present only as bare instances**, matching the recurring pattern (Table's `table`, Buttons' `drop_menu`, Input's `digit_field`, Sidebar Navigation's `side_bar`) of composed/assembled components not being explorable via metadata alone — confirmed systemic across this entire file, not a one-off.
- **No `size` or `state` property on `modal` itself** — consistent with the broader trend of "content/overlay" components (Pagination, Progress, Date Picker) skipping these axes, though `table_cell` breaks this trend with its `loading` state.

---

## 12. Comparing the architecture with Buttons, Inputs, Date Picker, and Table

- **Buttons:** `primary_button_effect` is confirmed present in this subtree, consistent with modal's action buttons plausibly reusing Button-family styling — the same pattern already observed for Alerts, Toasts, Pagination, and Date Picker.
- **Inputs:** no direct token or naming overlap found; no evidence in this metadata that `modal` nests a `field`/`input_field` component (though a real-world modal often would, e.g. for a form).
- **Date Picker:** both `modal` and `date_picker` share the minimal "type-only, no size, no state" variant architecture — reinforcing a broader pattern across "content/overlay" components in this system.
- **Table:** both `modal` and `table` exhibit the same "atomic piece gets a real component set, composed/assembled piece appears only as a bare instance" structure (`modal`+`modal_header`/`modal_actions` vs. `table_cell`+`table`) — a confirmed, recurring architectural pattern across multiple unrelated component families in this file.

---

## 13. Dependencies on previously audited components

Confirmed reuse of: `elevation/e2`, `elevation/e5` (every prior audit); `elevation/e6` (Toast audit — identical full 6-layer definition, consistent with modal's high-prominence overlay role); `secondary_button_effect` (Buttons audit, likely spillover); `primary_button_effect` (Buttons, Alerts, Toasts, Pagination, Date Picker audits); `radius/custom/xl/lg` (Buttons, Input, List, Switcher, Sidebar Navigation, Top Navigation audits); `Color/primary_med_em`, `Color/primary_low_em_alpha`, `Color/primary_base_em_alpha` (Avatars, Input, Switcher, Sidebar Navigation audits — three distinct alpha-suffix conventions, all reused here together); `Color/primary/500`, `Text/Primary 500` (Colors, and nearly every subsequent audit); `Color/smoke_base/low` (Input, List, Switcher, Sidebar Navigation, Top Navigation, Tab Navigation, Tooltips, Alerts, Toasts, Date Picker audits); `Color/inverse_black_neutral` (Button Group, Input, Switcher, Sidebar Navigation, Top Navigation audits); `Text/Gray` family (Colors and nearly every subsequent audit); `web/Title/13`/`web/Body/13 Semibold/Medium` (Typography, Input, Chips, Links, Pagination, Date Picker, Table audits); `primary_special_outline`/`secondary_special_outline` (still unresolved together, consistent with the Top Navigation audit's pairing).

---

## 14. Anything MCP cannot retrieve

- Whether `modal_header` or `modal_actions` have their own internal variant/property structure — both are unexpanded bare instances in this metadata.
- Whether `modal_body`, `modal_footer`, or `modal_overlay` exist anywhere else in the file outside this specific selection.
- Whether a close button, icon/illustration slot, dismissible-behavior toggle, or fullscreen/mobile layout exists internally on `modal` or either bare instance.
- Whether `primary_button_effect` is genuinely applied to a real button inside `modal_actions`.
- Default variant configuration for `modal`.
- Variable Collection / Mode metadata — not retrievable, consistent with every prior audit in this series.
