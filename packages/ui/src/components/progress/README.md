# Progress

Implements the `Progress` component set. `progress.md` (the original overview audit) was the least developed audit in the whole series: an unrenamed Figma default property (`Property 1`), only 2 values (`Media`, `Load More`), and a flagged dimensional match between `Load More` (176×128) and `pagination`'s `load_more` (also 176×128). A deep re-audit (`docs/audit/progress-deep-audit.md`) confirms `Load More` is a byte-identical duplicate of the already-shipped `LoadMorePagination`, and that `Media` is the only genuinely new content here.

## What's implemented, and what isn't

- **`Media` → `Progress`**: a confirmed scrubber/seek-bar — an 8px track (`radius/border_radius_sm_2`, `Color/Gray`), a fill up to the current value (`radius/border_radius_round`, `Color/primary_base`), and a circular handle at the fill's leading edge.
- **`Load More` → not reproduced.** It is confirmed to be the exact same component as `LoadMorePagination` (`@shikho/ui`'s `pagination` family) — same layer structure, same copy, same styling, down to the pixel. Per this project's standing instruction not to duplicate implementations, no second component is created for it; use `LoadMorePagination` directly.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/progress-deep-audit.md` §2):
- The track/fill/handle structure and their exact confirmed tokens (`radius/border_radius_sm_2` = `radius.md` = 10px on the track; `radius/border_radius_round` = `radius.full` on the fill; `Color/Gray` = `color.gray[200]` on the track; `Color/primary_base` = `color.primary[500]` on the fill).
- `radius/border_radius_sm_2` genuinely applied here — resolving `input.md`'s earlier flag of this token as a confusing duplicate with no confirmed real usage.

**Derived, documented as such:**
- The handle's exact fill color isn't independently confirmed beyond the screenshot (a lighter-blue circle) — `color.primary[300]` is used as the closest confirmed ramp member, not an exact confirmed hex.
- No interaction data exists in a static Figma export — this implementation makes `Media` a real, functional, draggable slider (a native `<input type="range">`, styled to match) rather than a static, inert bar, since a "progress" control that can't represent a live value would be far less useful. The same "necessary functional addition, clearly documented" reasoning already applied to Date Picker, Modal, and Pagination.

## Usage

```tsx
import { Progress } from "@shikho/ui";

function MediaScrubber() {
  const [position, setPosition] = useState(35);
  return <Progress value={position} min={0} max={100} onChange={setPosition} aria-label="Playback position" />;
}
```

For the confirmed `Load More` widget, use `LoadMorePagination` from `@shikho/ui`'s `pagination` family instead — see `packages/ui/src/components/pagination/README.md`.

## Token dependencies

`@shikho/tokens`: `color.gray[200]`, `color.primary[300/500]`, `radius.md`, `radius.full`.
