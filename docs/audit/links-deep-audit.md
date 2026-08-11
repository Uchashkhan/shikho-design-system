# Links Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `links.md`.
**Method:** `get_metadata` (full 30-variant symbol list) and `get_design_context` (via the Figma MCP desktop connection) against 8 representative instances covering both `type` values, all 5 `size` values, and all 3 `state` values: `xl/primary/default` (`66080:30611`), `xl/primary/hover` (`66080:30607`), `xl/primary/disabled` (`66080:30603`), `xl/quaternary/default` (`66080:30599`), `xl/quaternary/hover` (`66080:30595`), `xl/quaternary/disabled` (`66080:30591`), `lg/primary/default` (`66080:30635`), `md/primary/default` (`66080:30659`), `sm/primary/default` (`66080:30683`), `xs/primary/default` (`66080:30707`).
**Relationship to `links.md`:** That audit was explicitly overview-only — its own method note states `get_design_context` was deliberately not used, per instruction at the time. This document supersedes it for internal structure while leaving its `size`/`type`/`state` and typography-token findings intact (reconfirmed, not contradicted, below). `links.md` is left unmodified as the historical overview-only record.

---

## 1. Root variants — reconfirmed

Exactly `size` (`xl`, `lg`, `md`, `sm`, `xs`) × `type` (`quaternary`, `primary`) × `state` (`disabled`, `hover`, `default`) = 30 variants, matching `links.md` §2–§3 exactly.

## 2. Confirmed internal structure (new — not available to the overview audit)

Every instance shares one structure: a `flex` row, `items-center justify-center`, zero padding, containing up to three children in order:

```
link
├─ left_icon   (conditional — boolean `leftIcon` prop, default true)
├─ text        (conditional — boolean `text` prop, default true; the "Link" label)
└─ right_icon  (conditional — boolean `rightIcon` prop, default true)
```

- **3 confirmed boolean properties**: `leftIcon`, `rightIcon`, `text` — all default `true`.
- **2 confirmed instance-swap properties**: `selectLeftIcon`, `selectRightIcon` (`ReactNode | null`, default `null`) — when set, they replace the corresponding icon slot's rendered content, the same swap-slot convention already confirmed on `Field`/`List`.
- Both icon slots carry `elevation/e2`'s exact 2-layer drop-shadow (`(0,3,3,-1.5)`, `(0,1,1,-0.5)`) — **confirmed actually applied**, resolving `links.md` §8/§13's "likely spillover" uncertainty. This is the same icon-shadow convention already used throughout this library (Alert, Toast, Avatar, Button Group).
- No border, no background fill, no radius anywhere on `link` at any size/type/state — a plain inline text-plus-icons row, consistent with §8's "no `radius/custom/*` tokens" finding.

## 3. Confirmed per-size composition (new)

| Size | Gap | Icon size | Typography | Font size / line height / weight |
|---|---|---|---|---|
| `xl` | `spacing/8` (8px) | 24px | `web/Title/18` | 18px / 24px / 600 (primary) or 500 (quaternary) |
| `lg` | `spacing/6` (6px) | 20px | `web/Title/13 Semibold` | 13px / 20px / 600 |
| `md` | `spacing/6` (6px) | 18px | `web/Body/13 Semibold` | 13px / 20px / 600 |
| `sm` | `spacing/6` (6px) | 16px | `web/Body/12 Semibold` | 12px / 16px / 600 |
| `xs` | `spacing/4` (4px) | 14px | `web/Body/11 Semibold` | 11px / 16px / 600 |

`lg` and `md` resolve to numerically identical typography (13px/20px/600) despite citing different token names (`Title/13 Semibold` vs `Body/13 Semibold`) — this reconfirms `typography.md`'s own documented finding that the `Title/13` and `Body/13` composites are exact duplicates. The two sizes differ only in icon size (20px vs 18px), not text size. This audit only directly confirmed `type=primary` state/weight combinations at every size; `type=quaternary`'s weight substitution (§4) was confirmed only at `xl` and applied uniformly across sizes as the least-invented extension, consistent with how every sparsely-audited component in this library handles a confirmed-at-one-size, extended-to-all-sizes value.

## 4. Confirmed type × state color/weight matrix

| | `type=primary` | `type=quaternary` |
|---|---|---|
| Font weight | SemiBold (600) | Medium (500) |
| `state=default` | `text/primary-500` (`#5468ff`) | `text/gray-700` (`#5b616d`) |
| `state=hover` | `text/primary-600` (`#3b4ee3`, darker) | `text/gray-950` (`#0a0c11`, darker) |
| `state=disabled` | `text/gray-400` (`#c3c6cc`) | `text/gray-400` (`#c3c6cc`) — same value as `primary`'s disabled |

Both types follow the same confirmed pattern: hover moves to a strictly darker step of the same color family (`primary-500→600`, `gray-700→950`), and both share the exact same disabled color (`gray-400`) regardless of type — the color axis collapses to one shared "disabled" value, only the default/hover pair differs by type. Icon assets themselves were not distinguishable (placeholder vectors, consistent with every prior audit's icon-slot findings).

## 5. Confirmed vs. still-unresolved

**Newly confirmed by this deep audit** (resolving `links.md` §5/§13's open questions):
- Icon slots exist and are exposed as booleans + instance-swap props (not merely "plausible" as the overview guessed).
- `elevation/e2` is confirmed genuinely applied, not incidental spillover.
- The exact size→typography→icon-size mapping (§3).
- The exact type×state color/weight matrix (§4).

**Still not confirmed, not invented:**
- **`focus` state is confirmed absent** (reconfirmed from `links.md` §4/§10/§12) — no distinct focus treatment or focus-ring token exists anywhere in this component's export. This implementation relies on the native browser focus outline via `:focus-visible`, the least-invented choice given no confirmed design exists to replace it — not a fabricated custom ring.
- Whether `type=quaternary`'s Medium-weight substitution holds at every size (only confirmed at `xl`, §3) — applied uniformly, documented as an extension not an independent confirmation.
- The real icon glyph content — no `@shikho/icons` glyphs exist yet, so `leftIcon`/`rightIcon` render as empty `ReactNode` slots unless a consumer supplies content via `selectLeftIcon`/`selectRightIcon`.
- Default variant configuration — not confirmed.

## 6. Colors re-verified, interactivity fixed (re-audit pass)

Re-confirmed all 4 non-disabled color/weight combinations plus `disabled` directly against their recorded node IDs (`66080:30611`, `66080:30607`, `66080:30599`, `66080:30595`, `66080:30603`) via a live `get_design_context` pull — every value already matched the implementation exactly. No color bugs found here, unlike `SidebarItem`/`SwitcherItem`/`TopNavItem`'s per-size or per-type geometry.

The one real bug: `state` was a static prop with no `onMouseEnter`/`onMouseLeave` — hovering a link did nothing regardless of color correctness, the same interactivity gap already found and fixed on every other nav/interactive component in this library. Left unset, the real cursor now drives `hover`; an explicit `state` (Storybook/playground controls, or forcing `"disabled"`) still overrides it.

## 7. Implementation decision

`Link` is implemented as a real anchor-capable component: it renders a native `<a>` when `href` is supplied, or a `<span>` otherwise (e.g. for a `role="link"` + `onClick` pattern) — a functional necessity for a component whose entire purpose is navigation, not a Figma-confirmed detail (Figma's own export never distinguishes an anchor element from any other container, per every prior audit in this series). `disabled` is expressed via `aria-disabled` + `pointer-events: none`, the standard pattern for a non-native-disableable element like `<a>`, and consistent with `state=disabled`'s confirmed color treatment.
