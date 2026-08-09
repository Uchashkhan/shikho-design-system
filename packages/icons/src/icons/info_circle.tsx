import { createIcon } from "../create_icon";

/**
 * `info-circle` — downloaded from the real SVG behind all five Alert severities and all five
 * Toast severities (docs/audit/alerts.md §14, toasts.md §14). Confirmed to be the SAME glyph in
 * every severity, tinted per state — so it is a genuine shared glyph, not five variants.
 * Native viewBox 18 × 18.
 */
export const InfoCircleIcon = createIcon({
  name: "info-circle",
  viewBox: "0 0 18 18",
  path: "M9 0C4.03768 0 0 4.03674 0 9C0 13.9623 4.03768 18 9 18C13.9623 18 18 13.9623 18 9C18 4.03674 13.9623 0 9 0ZM10.25 5.75C10.25 6.44036 9.69034 7 8.99999 7C8.30963 7 7.74999 6.44036 7.74999 5.75C7.74999 5.05964 8.30963 4.5 8.99999 4.5C9.69034 4.5 10.25 5.05964 10.25 5.75ZM9.00001 7.99996C8.44773 7.99996 8.00001 8.44767 8.00001 8.99996V13C8.00001 13.5522 8.44773 14 9.00001 14C9.5523 14 10 13.5522 10 13V8.99996C10 8.44767 9.5523 7.99996 9.00001 7.99996Z",
});
