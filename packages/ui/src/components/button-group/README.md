# Button Group

Implements the `button_group` component set audited in `docs/audit/button-group.md` — deep-audited at `size=xs, count=3` via `get_design_context` (§8-§17), the first Button-family audit to resolve several previously-unattributed spacing tokens from `buttons.md` itself.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/button-group.md`):
- Exactly two properties: `size` (xs, sm, md, lg, xl — the same "Scale A" used by `button_danger`/`button_success`/`Greyscale`/`icon_button`) and `count` (2-6, no `count=1`, no `count=7+`). **No `type` and no `state` property exists** on `button_group` itself.
- **Zero gap** confirmed two independent ways: solved arithmetically from bounding-box widths across all five sizes and counts (§7), and directly confirmed via `get_design_context` — the root carries no `gap-` class at all (§7, §8).
- **Root and each segment are Hug-sized** (no explicit width/height beyond a segment's `h-[24px]` at `xs`), confirmed via `get_design_context` (§9).
- **Confirmed corner-radius and border strategy** (§15, §16): the first segment gets left-corner rounding (`radius/custom/xs`, 6px) plus a full 4-side border; the last segment gets right-corner rounding plus a full 4-side border; every segment in between is fully square with only a top/bottom border (left/right explicitly omitted) — this is how adjacent segments join without doubled borders, not an overlap/z-fighting technique.
- Segments are confirmed **nested Button-type component instances**, not hand-drawn layers — their children carry the `I<parentId>;<componentId>` nesting pattern (§11). No specific sub-family (e.g. `button_danger`) was confirmed as the source, unlike Alert/Toast's confirmed `button_danger` dependency.
- Padding, confirmed exact for `xs` only: `px-[spacing/6, 6px] py-[spacing/4, 4px]` (§8) — this resolves spacing tokens that were bound-but-unattributed in the standalone single-button deep audit.
- Gap **within** each segment (between left icon / label / right icon) is confirmed `0px` — the visible icon-to-label spacing comes from the label's own `px-[spacing/4, 4px]` padding, not a flex gap (§8).
- Icon size `14×14` (`sizing/icon/14`), confirmed applied (§9, §14).
- Typography (label): confirmed exact for the `xs` instance — Caption 1 / `web/Body/11 Semibold` (11px/16px/600) (§14).
- Border colour: `outline/Black 50` (`#0000000a`), confirmed applied to every segment (§14) — matches `@shikho/tokens`' `color.black[50]` exactly.
- Fill and label colour for this one audited instance: `Color/secondary/500` background, `text/white-950` label, applied identically across all three segments (§14, §17).
- `elevation/e2` and `secondary_button_effect` (a 4-layer inner+drop-shadow composite) are confirmed **actually applied** to this instance (§14) — upgraded from "bound in subtree, unconfirmed" in the prior overview audit.

**Derived — documented, not independently confirmed:**
- **Only `xs` was deep-audited.** Padding for `sm`/`md`/`lg`/`xl` reuses the same padding scale already derived for the standalone Button family (`packages/ui/src/components/button/shared.ts`) — the least-invented option available — with `xs` itself replaced by this family's own newly confirmed exact value.
- **Typography is applied uniformly across all five sizes** — only the `xs` instance was deep-audited; no other size's label typography was confirmed.
- **The uniform `Color/secondary/500` fill is applied to every segment regardless of content**, since `button_group` has no `type` property to vary it by — this is the one confirmed data point, applied the same way Alert's one confirmed severity (`danger`) is applied uniformly where no other variant axis exists.
- `count` is not modeled as a numeric prop — it's the length of the `items` array, since Figma's variant enumeration (2-6 symbols) describes how many demo instances exist, not a runtime configuration knob distinct from the actual content rendered.

**Explicitly not resolved, and not invented:**
- **`secondary_button_effect` is confirmed present but not implemented** — the same explicit decision already made for every standalone Button family (see `packages/ui/src/components/button/README.md`), since `@shikho/tokens` has no effects category yet and this implementation uses only its existing exports.
- Whether `count=4/5/6` repeat the identical "square, top/bottom-border-only" treatment for every additional middle segment — only `count=3` (one middle segment) was inspected (§17, §20). This implementation applies the same confirmed middle-segment treatment to every non-edge segment, since no data suggests otherwise and no alternative was confirmed either.
- The 1-2px width discrepancy vs. standalone buttons of the same size step (§19) — not confirmed, not reproduced (Hug sizing here derives naturally from padding + content, not a hardcoded width).
- The exact icon glyph — no `@shikho/icons` glyphs exist yet; `leftIcon`/`rightIcon` are empty `ReactNode` slots unless a consumer supplies one.
- Main-axis (`justify-`) distribution beyond default flex-start packing, and default variant configuration — neither was exposed by the audit (§20).

## Usage

```tsx
import { ButtonGroup } from "@shikho/ui";

function ViewToggle() {
  return (
    <ButtonGroup
      size="md"
      items={[
        { label: "Day" },
        { label: "Week" },
        { label: "Month" },
      ]}
    />
  );
}
```

## Not implemented

- `secondary_button_effect` — confirmed applied, but not implemented (no effects token category exists yet).
- Real icon glyph content — no `@shikho/icons` inventory exists yet.
- Any interaction state — `button_group` itself exposes no `state` property; individual segment interactivity was out of scope for this audit.

## Token dependencies

Only `@shikho/tokens`: `color.secondary[500]`, `color.white[950]`, `color.black[50]`, `radius.xs`, and `elevation.e2` (converted to a CSS `box-shadow` string, used on the icon slots).
