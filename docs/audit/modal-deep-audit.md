# Modal Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `modal.md`.
**Method:** `get_metadata` and `get_design_context` (via the Figma MCP desktop connection) against both confirmed `type` variants: `default` (`66086:36925`) and `confirmation` (`66086:36932`), plus one screenshot.
**Relationship to `modal.md`:** That audit was explicitly overview-only — its own method note states `get_design_context` was deliberately not used. This document supersedes it for internal structure while leaving its `type`/bounding-box findings intact (reconfirmed below). `modal.md` is left unmodified as the historical overview-only record.

---

## 1. Root variants — reconfirmed

Exactly one property, `type` (`default`, `confirmation`), matching `modal.md` §2 exactly. Confirmed dimensions: `default` = 544×352, `confirmation` = 480×256.

## 2. Confirmed internal structure — genuinely different layouts per type (new)

**`type=default`:**
```
modal
├─ modal_header        (border-bottom divider, px-32 py-24, gap-24)
│  ├─ head → header_text → title ("Action heading", heading_1 22px/32px SemiBold, gray-950)
│  └─ icon_button (close) — absolute top-12/right-12, 32×32, circular, white fill
├─ body                (px-24 py-8, gap-16, centered)
│  ├─ icon (conditional — boolean `modalIcon`, default true)
│  │  └─ feature_icon — 40×40 icon in a gradient (primary_base_em_alpha → primary_low_em_alpha) square, radius/custom/xl (16px)
│  └─ description ("Are you sure...", body_1 13px/20px Medium, gray-700)
└─ modal_actions        (border-top divider, px-32, pt-16, gap-16)
   └─ horizontal_CTAs — 2 buttons, each flex-1: Cancel (gray-100 fill) / Yes, continue (primary/500 fill)
```

**`type=confirmation`:**
```
modal
├─ body                 (pt-24, px-24, pb-8, gap-8, centered — no header divider, no separate header block)
│  ├─ icon (conditional — boolean `modalIcon`, default true)
│  │  └─ feature_icon — 28×28 icon (smaller than default's 40×40), radius/custom/lg (12px, not xl)
│  ├─ title ("Action heading", identical heading_1 22px/32px SemiBold, gray-950 — same as default)
│  └─ description ("Are you sure...", body_1 13px/20px Medium, **gray-600**, not default's gray-700 — confirmed different/lighter shade)
├─ modal_actions         (no border-top — border-0 explicitly, pt-16, px-24, gap-16 — same 2-button horizontal_CTAs, identical button styling to default)
└─ icon_button (close)   — absolute top-11/right-11 (default's is top-12/right-12 — a 1px rounding difference, not meaningful), otherwise identical
```

**The two types are genuinely different compositions, not just a resize:** `default` separates title into its own bordered `modal_header` block and keeps a border-top before actions; `confirmation` merges title + description into one unbordered `body` block with no divider before the actions row, uses a smaller feature-icon container with a different radius, and uses a lighter description color. This resolves `modal.md` §5/§14's open questions about header/body/actions/close-button/icon structure.

## 3. Confirmed root shell — a genuine elevation difference by type

| | `type=default` | `type=confirmation` |
|---|---|---|
| Fill | `Color/smoke_base` (white) | same |
| Border | `1px outline/Gray 200` | same |
| Radius | `radius/border_radius_2xl` = 28px | same |
| Shadow | `elevation/e5` (5-layer) | **`elevation/e6`** (6-layer — identical to Toast's) |
| Bottom padding | `spacing/32` | `spacing/24` |
| Root gap | `spacing/16` | `spacing/8` |

`confirmation` is the smaller dialog but carries the *heavier* shadow (`e6` vs `e5`) — confirmed, not a mistake; the audit's own overview flagged `e6` as "consistent with modal being one of the most prominent floating/overlay UI elements," and this deep audit confirms it's specifically the more compact `confirmation` type that gets it.

## 4. Confirmed close button

A circular (`radius/border_radius_round`) `icon_button`, 32×32, absolutely positioned top-right (12px/12px on `default`, 11px/11px on `confirmation` — a rounding artifact, not a meaningful difference), white fill, `1px outline/Black 50` border, the same confirmed 2-layer inset overlay (`white/50` + `black/7`) already seen on Button Group's segments and Date Picker's nav buttons, plus an `elevation/e2`-derived icon-shadow filter on its 18px icon (the same filter pattern confirmed on Link and Date Picker's nav icons).

## 5. Confirmed feature icon

A gradient square (`primary_base_em_alpha` → `primary_low_em_alpha`, both linear-gradient stops going top-to-bottom), containing one icon:
- `default`: 40×40 icon, `radius/custom/xl` (16px) container, `padding: spacing/12`.
- `confirmation`: 28×28 icon, `radius/custom/lg` (12px) container, `padding: spacing/10`.

Both carry the same 2-layer `elevation/e2`-derived drop-shadow filter on the icon itself.

## 6. Confirmed action buttons

Both types share byte-identical `horizontal_CTAs` structure and styling: two buttons, each `flex: 1 0 0` (equal width), `px-16 py-12`, `radius/custom/lg` (12px):
- **Cancel**: fill `Color/gray/100`, text `Text/Gray 700` (body_1 13px/20px SemiBold), the confirmed 2-layer inset overlay already seen throughout this library (Date Picker's Cancel, Button Group's default treatment).
- **Yes, continue**: fill `Color/primary/500`, border `1px outline/Black 150`, text `text/white-950`, the confirmed "primary pill" inset overlay (`white/600` + `white/500`) already seen on Date Picker's Set Date button and Button Group's range-selection cells — the same visual treatment reused a fourth time across this library.

No confirmed nested Button-family instance — both buttons carry plain, locally-scoped node IDs (not the `I<parent>;<componentId>` pattern confirmed for genuine nested instances elsewhere, e.g. Alert's `button_danger`). Same reasoning as Date Picker/Button Group: implemented inline, not composed from an existing Button.

## 7. Confirmed vs. still-unresolved

**Newly confirmed** (resolving `modal.md` §5/§7/§14's open questions):
- `modal_header` and `modal_actions` internal structure (previously bare, unexpanded instances).
- The `modalIcon` boolean property (default `true`) gating the feature-icon block.
- The exact title/description typography and color per type.
- `elevation/e5` (default) vs. `elevation/e6` (confirmation) — genuinely different, not incidental.

**Still not confirmed, not invented:**
- **`modal_body`, `modal_overlay` do not exist as named pieces anywhere in this selection** (`modal.md` §7) — no backdrop/overlay mechanism is confirmed. A functional (not Figma-confirmed) backdrop is included in this implementation because a floating dialog is meaningless without one to establish visual layering and click-outside-to-dismiss — the same category of necessary-but-unconfirmed functional addition already made for Date Picker's month-grid generation.
- Dismissible behavior (Escape key, backdrop click, focus management) — not exposed as a Figma property; implemented as ordinary accessible-dialog behavior (`role="dialog"`, `aria-modal`, Escape-to-close, backdrop-click-to-close, initial focus movement), the same "functional necessity, not a confirmed visual" reasoning applied to Date Picker's calendar interactions.
- Fullscreen/mobile/bottom-sheet layouts — confirmed absent from this selection, not implemented.
- Whether `primary_button_effect`/`secondary_button_effect` (the full 4-layer composites, vs. just their inset-shadow halves used here) are genuinely applied — not confirmed; only the confirmed exact rendered CSS (2-layer inset overlays) is used, the same "implement only what's actually rendered" approach as every prior component.

## 8. Proposed architecture

```
Modal
├── backdrop            (functional, not Figma-confirmed — click-to-dismiss + visual layering)
└── dialog card
    ├── header block      (type=default only — bordered, title + close button)
    ├── body               (feature icon, title [confirmation only], description)
    └── actions            (Cancel / primary action, full-width equal split)
```

Since `default` and `confirmation` are genuinely different compositions (not a shared shell with resized children), the component branches its rendering by `type` rather than forcing one shared internal layout — closest to what the confirmed structure actually shows.
