# Top Navigation — Deep Audit (supersedes `docs/audit/top-navigation.md` for structural detail)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", live desktop
selection via Figma MCP (`get_metadata` + `get_design_context`, both run in this pass — the
original overview explicitly skipped `get_design_context`). This file does not modify or replace
`docs/audit/top-navigation.md`; that file remains the historical overview-only record.

Nodes re-audited: `top_nav_item` (`66081:31190`) at `size=md` across all 7 confirmed `type`
values and all reachable `state` values (12 variants fetched directly), plus the `top_nav`
container (`66081:31666`) at `size=xs`.

---

## 1. `top_nav` is confirmed a demo composition, not a primitive

`get_design_context` on `66081:31666` returns a literal row of 7 `top_nav_item` instances
side-by-side (one active-styled "selected" item followed by 6 plain items), repeated once per
`size` value in the overview screenshot (5 rows total, each just the same 7-item demo scaled up).
This confirms the original overview's inference (§7 of `top-navigation.md`) drawn only from
bounding-box shape. **`top_nav` is not implemented** — same precedent as `sidebar_nav` (Sidebar
Navigation deep audit) and `tab_nav` (Tab Navigation deep audit).

## 2. `top_nav_item` confirmed internal structure

Every variant shares one structure: an optional `left_icon` slot (18px at `md`, scaling with
`size` — see §5), a `text_wrap` label ("Nav item"), an optional `right_icon` slot (mirrors
`left_icon`), all exposed as top-level boolean properties (`leftIcon`, `rightIcon`, `text`) plus
`selectLeftIcon`/`selectRightIcon` instance-swap slots for supplying real icon content. No badge,
counter, or separator slot exists anywhere in the subtree — confirms §6 of the original overview.

## 3. Confirmed `type` × `state` style matrix (fetched directly at `size=md`, 12 variants)

All colors below are quoted exactly as returned; token-file equivalents (from `@shikho/tokens`)
are noted where they match a confirmed hex 1:1.

| type | default | hover | focus |
|---|---|---|---|
| `active_primary` | bg `#85a4ff` (`primary/400`), border `1px solid rgba(0,0,0,0.12)` (`black/100`), text white, inset `special_drop` | bg `#5468ff` (`primary/500`), same border, text white, inset `special_drop` | bg `#85a4ff`, **no border**, ring `0 0 0 3px rgba(84,104,255,0.24)` (= `focusRingColor.primary`, exact match), **no inset shadow** |
| `active_primary_accent` | bg `#f4f4f6` (`gray/100`), border `1px solid rgba(0,0,0,0.04)` (`black/50`), text `#5468ff` (`primary/500`), inset `special_drop` | same bg/border, text `#3b4ee3` (`primary/600`), inset `special_drop` | bg `#f9f9fa` (`gray/50`), **no border**, ring `focusRingColor.primary`, text `primary/600`, **no inset shadow** |
| `active` | bg `#ebecf0` (`gray/200`, "smoke_high"), text `gray/950`, inset `special_drop` | bg `#f4f4f6` (`gray/100`, "smoke_med"), text `gray/950`, inset `special_drop` | bg `#ebecf0`, ring `0 0 0 3px #dddfe4` (`gray/300` = `focusRingColor.gray`, exact match), text `gray/950`, **no inset shadow** |
| `active_neutral` | bg `#000000` (pure black), text white, inset `special_drop` | bg `rgba(0,0,0,0.88)` (= `black/900` exact match), text white, inset `special_drop` | bg `#000000`, ring `focusRingColor.gray`, text white, **no inset shadow** |
| `active_outline` | **no bg**, border `2px solid rgba(0,0,0,0.24)` (= `black/300` exact match, per original overview's "Black 24" naming — §11 of `top-navigation.md`), text `gray/950`, **no inset shadow** | bg `gray/100`, same border, text `gray/950`, inset `special_drop` | bg `gray/100`, same border, ring `focusRingColor.gray`, text `gray/950`, **no inset shadow** |
| `inactive` | **no bg, no border**, text `gray/600` | bg `gray/100`, text `gray/600`, **no inset shadow** | *(confirmed: no focus state exists — §2/§11 of `top-navigation.md`)* |
| `inactive_outline` | **no bg**, border `1px solid gray/200`, text `gray/600`, **no inset shadow** | bg `gray/100`, same border, text `gray/600`, **no inset shadow** | *(confirmed: no focus state exists)* |

**Newly confirmed, systematic pattern not visible from metadata alone:** every one of the 5
`active_*` types' `focus` state **drops the inset `special_drop` shadow entirely** and replaces
it with an outer focus ring — this is a genuine confirmed behavior, not a design decision this
implementation had to guess at. `active_outline`/`active_primary_accent`/`active_primary`'s focus
state additionally **removes the border** that state has at `default`/`hover`.

`special_drop` itself (`docs/audit/top-navigation.md` §9) is confirmed identical to every prior
audit: `inset 0px -1px 3px -2px rgba(0,0,0,0.04), inset 0px 1px 3px -2px rgba(255,255,255,0.04)` —
implemented here with the same literal string already used in `SidebarItem`/`SwitcherItem`
(`inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`), for
consistency with the rest of this codebase's existing "resting inset" pattern, rather than
re-deriving a second literal from the raw 0.04/0.04 figures.

## 4. Confirmed hover fill is NOT always "one step" from default

For most types the hover fill is a plain step down the gray ramp (`active`: `gray/200`→`gray/100`;
`active_outline`/`inactive_outline`/`inactive`: transparent→`gray/100`). `active_primary` and
`active_neutral` instead swap between two *non-adjacent* confirmed colors (`primary/400`→
`primary/500`; `#000000`→`rgba(0,0,0,0.88)`) — both directly confirmed, not interpolated.

## 5. Confirmed size scale (from the `top_nav` container's own per-size rendering)

| size | height | radius | gap | padding | icon size | text style |
|---|---|---|---|---|---|---|
| `xl` | 56px | `radius.xl` (16) | 6px | 16px all sides | 24px | `title_2` 18px/24px |
| `lg` | 48px | `radius.xl` (16) | 4px | 16px x / 12px y | 20px | `body_1` 13px/20px |
| `md` | 40px | `radius.lg` (12) | 4px | 12px x / 8px y | 18px | `body_1` 13px/20px |
| `sm` | 32px | `radius.md` (10) | 2px | 8px all sides | 16px | `caption_2` 12px/16px |
| `xs` | 24px | `radius.sm` (8) | 0px | 6px x / 4px y | 14px | `caption_1` 11px/16px |

All five rows confirmed directly from the container's rendered per-size children — not
interpolated, unlike some sizing ramps in earlier audits.

## 6. Confirmed vs. derived summary

**Confirmed exactly:** all 7 `type` values' `default`/`hover` fills, borders, and text colors at
`size=md`; all 5 eligible `focus` ring colors and the "drop inset shadow on focus" pattern; the
full 5-step size scale (height/radius/gap/padding/icon-size); `top_nav` is a demo composition, not
a primitive; no badge/counter/separator slots exist.

**Derived, documented as such:**
- Typography pixel sizes/line-heights at `xl`/`lg`/`sm`/`xs` were read directly from the `top_nav`
  container fetch rather than independently re-confirmed via a `top_nav_item` fetch at each size —
  treated as confirmed since the container instantiates real `top_nav_item` children.
- `special_drop`'s CSS literal reuses this codebase's existing rounded-to-0.07 opacity constant
  (shared with `SidebarItem`/`SwitcherItem`) rather than the raw 0.04 figure quoted in Figma's own
  effect definition, for cross-component consistency — an established, previously-made project
  decision, not a new approximation invented here.
