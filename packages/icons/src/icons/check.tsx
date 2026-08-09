import { createIcon } from "../create_icon";

/**
 * `check` — the confirmed checkmark, taken from Toggle's real exported knob artwork
 * (docs/audit/toggle.md §14). Native viewBox 20 × 16 with the mark occupying the centre.
 *
 * Checkbox previously drew its own hand-authored stroke approximation
 * (`M3 8.5L6.5 12L13 4.5`) of the same mark.
 */
export const CheckIcon = createIcon({
  name: "check",
  viewBox: "0 0 20 16",
  path: "M13.6061 5.70708C13.9965 6.09751 13.9965 6.73052 13.6062 7.12099L9.95011 10.7778C9.55959 11.1683 8.92637 11.1684 8.53582 10.7778L6.707 8.949C6.31653 8.55853 6.31653 7.92547 6.707 7.535C7.09747 7.14453 7.73053 7.14454 8.121 7.535L9.243 8.657L12.192 5.70718C12.5825 5.31663 13.2156 5.31659 13.6061 5.70708Z",
});
