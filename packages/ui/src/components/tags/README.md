# Tags

Implements the `tags` component set audited in `docs/audit/tags.md` — Chip's closest sibling, and the audit explicitly compares the two (§10). No `get_design_context` deep audit was run on this family (overview-level only, same situation as Tooltip/Radio/Toggle), but the colour data here is unusually rich and precise: the audit calls it "the cleanest, most internally consistent alpha-naming system found in this entire audit series" (§8, §9).

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/tags.md`):
- `size`: `lg` (32px), `md` (24px), `sm` (20px) — confirmed bounding-box heights, stated without the "≈" qualifier Chip's sizes carried (§3).
- `type`: 11 values — `info`, `warning`, `danger`, `Danger Filled`, `success`, `Success Filled`, `tertiary`, `secondary`, `primary_outline`, `primary_light`, `primary` (§2). **`Danger Filled`/`Success Filled` are two-word, space-containing, Title Case values** — "the most severe single-property naming inconsistency confirmed in this entire audit series" (§9) — preserved verbatim, not corrected.
- `state`: `disabled`, `hover`, `default` — **no `focus`, no `drag`**, unlike Chip (§2).
- **No coverage gaps**: every one of the 11 types gets all 3 states at all 3 sizes (99 variants total) — a positive contrast to Chip's confirmed `Green`/`Red` gap (§3).
- The systematic alpha convention: every severity (`info`, `warning`, `danger`, `success`) and `primary` gets an exact confirmed `_alpha_12` hex, and primary additionally gets `_alpha_24`. Each severity's `Text/{name} 600` label colour is likewise an exact confirmed hex. `Danger Filled`/`Success Filled`'s solid fills use the confirmed `Color/{name}/500` values.
- A confirmed three-way emphasis split for the primary brand colour specifically: `primary_outline` / `primary_light` / `primary` — "filled, tinted, outlined" (§3).
- Only `SemiBold` weight typography appears in this family's export (12px/11px) — no Medium, no 13px, a confirmed narrower set than Chip's (§6).

**Derived — documented, not independently confirmed:**
- `secondary` and `tertiary` have **no confirmed alpha data anywhere in this audit** — they are absent from §8's five-severity table entirely. They are implemented as two neutral gray tints (`secondary` slightly darker than `tertiary`), the same "least invented, uses tokens already established elsewhere" pattern applied throughout this library — not an independently confirmed binding.
- `primary_outline`'s border colour uses the base `Color/primary/500` — a reasonable choice given no confirmed border-specific value exists for it, consistent with how "outline" emphasis is derived elsewhere in this library.
- **Radius is applied uniformly as `radius.full`** (pill shape) across every type. The audit found **three** `radius/custom/*` tokens present (`xs`/`sm`/`md`) — more than Chip's zero — and explicitly flags that they "may map to different type values (e.g. outline types vs. filled types)" but could not confirm which (§7, §12). Rather than invent that mapping, one uniform radius is used; the richer radius data is documented here as an unresolved possibility, not fabricated into a design decision.
- Typography (12px/16px/600) is applied uniformly across all three sizes, since no per-size breakdown was confirmed.

**Explicitly not implemented, and not invented:**
- No icon, label-count, or dismiss-control slot — whether any of these exist as internal layers was never confirmed (§4, §12), since no deep audit was run.
- `special_drop`'s inner shadow — the audit explicitly flags this as "plausibly identical" to its confirmed application elsewhere (Input/List/Sidebar Navigation) but **not confirmed without `get_design_context`** (§7, §12). Not applied here, consistent with the same caution already applied to `List`'s own `tags` sub-element.
- Why only `danger`/`success` get a "Filled" counterpart while `warning`/`info` do not — a confirmed asymmetry (§3, §9, §12) with no stated reason. Not resolved, not invented.

## Rendered as a static label, not a button

Unlike `Chip`, `Tags` renders a plain `<span>`, not a `<button>`. This follows the audit's own explicit architectural read: "`chip` reads as an interactive, selectable/draggable control... while `tags` reads as a static, label-only element" (§10) — directly supported by the confirmed absence of `focus`/`drag` states here. `state="disabled"` is expressed only as `aria-disabled` plus visual dimming, since a `<span>` has no native `disabled` attribute to set.

## Not implemented

- Icon/count/dismiss slots — existence unconfirmed.
- `special_drop` inner shadow — confirmed present in the token pool, not confirmed applied.
- A confirmed mapping from the three `radius/custom/*` tokens to specific types.

## Token dependencies

Only `@shikho/tokens`: `color.info[500/600]`, `color.warning[500/600]`, `color.danger[500/600]`, `color.success[500/600]`, `color.primary[500/600]`, `color.gray[50/100/600/700]`, `color.white[950]`, and `radius.full`.
