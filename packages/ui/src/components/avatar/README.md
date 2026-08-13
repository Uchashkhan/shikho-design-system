# Avatar

Implements the `avatar` component set audited in `docs/audit/avatars.md` — deep-audited at `size=md, type=image` via `get_design_context` (§8). The Figma file also contains two sibling sets, `avatar_face` (12 face images) and `avatar_group` (a multi-avatar composition whose width-per-size math can't be cross-verified, no `count` property to solve the overlap arithmetic) — neither is implemented here; both are out of scope, not fabricated.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/avatars.md` §8, the `size=md, type=image` instance):
- `size`: `xl` (64), `lg` (48), `md` (40), `sm` (32), `xs` (24) — confirmed square dimensions, all rendered as full circles.
- `type`: `icon`, `text`, `image` — only `image` has confirmed internal structure.
- **No auto-layout** — a confirmed architectural difference from every other component audited so far. Root is `relative`; every child (image, status, verification badge) is `absolute`-positioned, not `flex`.
- **No elevation or effect token applied at all** — another confirmed absence unlike every Button/Input component audited, which all carried at least an `elevation/e2` icon shadow.
- The photo is a plain `<img>` fill, not a nested component instance or exposed replaceable slot in Figma. The circular crop comes from `border-radius: radius/border_radius_round` (1000) applied directly on the `<img>` itself, mirrored on the root div — not a separate clip-path/mask/overflow-clip wrapper.
- `object-cover` on the image; no separate background-color fallback fill on the `type=image` variant.
- No border/outline on the avatar itself.
- **Status indicator**: confirmed to exist (`status` boolean, default `false`). When rendered: `10px`, fully circular, background `surface/success_med_em` (`#50df3a`, matches `@shikho/tokens`' `color.success[400]` exactly), `3px` border in `neutral_transparent_white/white-72` (`rgba(255,255,255,0.72)`, matches `color.white[800]` closely), positioned `absolute bottom-0 right-0`.
- **Verification badge**: confirmed to exist (`verification` boolean, default `false`). A `12×12` container positioned `absolute top-0 right-0`, wrapping a `shape` child that carries a checkmark/badge vector image.
- No instance-swap or image-replacement properties exist on this instance — the photo is hardcoded at the Figma level, not exposed via any prop there.

**Derived — documented, not independently confirmed:**
- **`type=icon` and `type=text` have no deep audit at all** — `size=md, type=image` was the only instance inspected with `get_design_context`. Both render on a derived neutral background (`color.gray[200]` fill, `color.gray[700]` text) — the same "least invented, reuse a neutral already established elsewhere" pattern applied to Tags' `secondary`/`tertiary` types — not a confirmed binding.
- **`type=text`'s font size per avatar size** is a derived approximation. The overview only surfaces three candidate tokens (`web/Body/13/12/11 Semibold`) as "plausible candidates" for the initials label, spread here across five avatar sizes (`xl`/`lg`→13, `md`→12, `sm`/`xs`→11) — no per-size binding was confirmed.
- **The status badge's fixed `10px`/`3px` dimensions are applied uniformly across all five avatar sizes** — the audit only confirmed this at `size=md`; whether it scales with the other four sizes was never inspected.
- **The verification badge has no confirmed radius or fill for its own container** — only its child `shape` layer carries the checkmark vector. No radius/background is applied to the container here; a consumer supplies the glyph entirely via `verificationContent`.

**Explicitly not resolved, and not invented:**
- Whether `avatar_face`'s 12 face variants are consumed as swappable source images anywhere in the file — out of scope, not implemented.
- `avatar_group`'s per-size width — no `count` property exists to solve the overlap math, unlike `button_group`. Not implemented.
- The real photo/icon/checkmark asset content beyond placeholder URLs — no `@shikho/icons` glyphs exist yet, so `children` (icon/text content) and `verificationContent` are empty slots unless a consumer supplies them.
- Whether `status`/`verification` scale, reposition, or behave differently across the other four sizes and the `icon`/`text` types — out of scope, no sibling inference performed.
- Default variant configuration for any of the three component sets — not confirmed.

## Implementation note (post-audit changes, docs/audit/avatars.md §13–§17)

The confirmed/derived findings above describe what the original Figma audit found — kept intact as history. The actual component has since diverged from it, per direct user requests:

- **`verification` was removed entirely.** It's still accurately described above as a real, confirmed Figma property — but the implementation no longer has it. Removed and replaced by `badge` below.
- **`badge` (`boolean`) / `badgeColor` (`string`) were added — not confirmed in Figma at all.** Draws a solid ring around the WHOLE avatar (not a corner badge), reusing a 3px stroke width sampled from one reference example (node `66200:18587`, unrelated to the actual `avatar` component set) and scaled per size. `badgeColor` has no default.
- **`status`'s border is now opaque white**, not the confirmed `72%`-alpha `white[800]` described above, and its size/border-width per step were re-derived from that same reference example rather than the original flat `10px`/`3px`.
- **`type="icon"` now renders a default `UserIcon` glyph** (`@shikho/icons`, `color.gray[500]` — a follow-up override, was `color.white[900]`) when no `children` are supplied — not sourced from a Figma audit, added directly per request to replace the previous bare/emoji placeholder (docs/audit/avatars.md §18/§19). Passing `children` still overrides it.

See `docs/audit/avatars.md` §13 onward for the full reasoning behind each change.

## Usage

```tsx
import { Avatar } from "@shikho/ui";

function ProfileBadge() {
  return (
    <Avatar
      size="md"
      type="image"
      src="/user/photo.jpg"
      alt="Jane Doe"
      status
    />
  );
}
```

## Not implemented

- `avatar_face` and `avatar_group` — out of scope; see above.
- The verification checkmark's own glyph asset — moot now that `verification` has been removed entirely (§17).
- Any interaction state — the audit found no `hover`/`active`/`disabled` variant anywhere in Avatars; this component is a static display element only.

## Token dependencies

`@shikho/tokens`: `color.success[400]`, `color.white[800/900]`, `color.gray[200/500/700]`, and `radius.full`. Also `@shikho/icons`' `UserIcon` (requested override, §18 — not part of the original Figma audit).
