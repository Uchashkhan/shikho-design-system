import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { color, radius } from "@shikho/tokens";

// docs/audit/progress-deep-audit.md §2 — Progress (Property 1=Media): a scrubber/seek-bar
// pattern — an 8px track, a filled portion up to the current value, and a draggable circular
// handle sitting on the fill's leading edge. This is the only genuinely new content in the
// audited `Progress` frame; `Property 1=Load More` is a confirmed byte-identical duplicate of
// `pagination`'s `page=load_more`, already implemented as `LoadMorePagination` — not reproduced
// here (§1).

const TRACK_HEIGHT = 8;
const HANDLE_SIZE = 14;

export interface ProgressProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  "aria-label"?: string;
}

/**
 * `Progress` (docs/audit/progress-deep-audit.md, `Property 1=Media`). Confirmed structure: a
 * track (`radius/border_radius_sm_2`, `Color/Gray`), a fill (`radius/border_radius_round`,
 * `Color/primary_base`), and a circular handle at the fill's leading edge. No interaction data
 * exists in a static Figma export, so this is implemented as a real, functional draggable slider
 * (a native `<input type="range">`, styled to match) rather than a static, inert bar — the same
 * "necessary functional addition" reasoning already applied to Date Picker, Modal, and
 * Pagination. The handle's exact fill color isn't independently confirmed beyond the screenshot
 * (a lighter blue circle); `color.primary[300]` is used as the closest confirmed ramp member,
 * documented as derived, not confirmed.
 */
export const Progress = forwardRef<HTMLInputElement, ProgressProps>(
  ({ value, min = 0, max = 100, onChange, style, ...props }, ref) => {
    const id = useId();
    const clamped = Math.min(max, Math.max(min, value));
    const ratio = max > min ? (clamped - min) / (max - min) : 0;

    return (
      <div style={{ position: "relative", width: "100%", height: HANDLE_SIZE, display: "flex", alignItems: "center", ...style }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: "100%",
            height: TRACK_HEIGHT,
            borderRadius: radius.md, // radius/border_radius_sm_2 (10) — confirmed §2
            backgroundColor: color.gray[200], // Color/Gray — confirmed §2
            overflow: "visible",
          }}
        >
          <div
            style={{
              height: TRACK_HEIGHT,
              width: `${ratio * 100}%`,
              borderRadius: radius.full, // radius/border_radius_round — confirmed §2
              backgroundColor: color.primary[500], // Color/primary_base — confirmed §2
            }}
          />
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: `calc(${ratio * 100}% - ${HANDLE_SIZE / 2}px)`,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            borderRadius: radius.full,
            backgroundColor: color.primary[300], // derived — closest confirmed ramp member, §2
            boxShadow: "0px 1px 3px rgba(0,0,0,0.16)",
          }}
        />
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          value={clamped}
          onChange={(event) => onChange?.(Number(event.target.value))}
          style={{
            position: "absolute",
            width: "100%",
            height: HANDLE_SIZE,
            margin: 0,
            opacity: 0,
            cursor: "pointer",
          }}
          {...props}
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";
