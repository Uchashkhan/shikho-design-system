/**
 * Docs-site chrome marks — NOT design-system components and NOT `@shikho/icons` additions.
 *
 * `@shikho/icons` deliberately contains only glyphs exported verbatim from a confirmed Figma
 * source (currently five: chevron-left/right, close, info-circle, check). Promoting a drawn mark
 * into that package would misrepresent a guess as confirmed design data, so decorative marks the
 * docs site needs for its own chrome live here instead — exactly where `ShikhoLogo` and the
 * GitHub mark already live.
 *
 * Anything that IS a real design-system glyph is imported from `@shikho/icons` at the call site
 * (e.g. `ChevronRightIcon` for directional affordances, `CheckIcon` for the maintained badge).
 * Nothing in this file is exported from `@shikho/ui`, reused by a component, or intended as a
 * reusable API — they are page furniture only.
 */

type MarkProps = { size?: number };

export function SearchMark({ size = 15 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7.2" cy="7.2" r="4.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.7 10.7 13.6 13.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MenuMark({ size = 18 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CopyMark({ size = 14 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10.5 5.5V3.5C10.5 2.67 9.83 2 9 2H3.5C2.67 2 2 2.67 2 3.5V9C2 9.83 2.67 10.5 3.5 10.5H5.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function ChevronDownMark({ size = 14 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6.25 8 10.25l4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GithubMark({ size = 16 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/* ---------------------------------------------- discovery tile marks (decorative, docs-only) */

export function ComponentsMark({ size = 18 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <rect x="2.5" y="2.5" width="6.2" height="6.2" rx="1.8" />
      <rect x="11.3" y="2.5" width="6.2" height="6.2" rx="1.8" />
      <rect x="2.5" y="11.3" width="6.2" height="6.2" rx="1.8" />
      <rect x="11.3" y="11.3" width="6.2" height="6.2" rx="1.8" />
    </svg>
  );
}

export function FoundationsMark({ size = 18 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 2.2c3.1 3.4 5.3 6.1 5.3 8.6a5.3 5.3 0 1 1-10.6 0c0-2.5 2.2-5.2 5.3-8.6Z" />
    </svg>
  );
}

export function PatternsMark({ size = 18 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <rect x="2.5" y="2.5" width="6" height="15" rx="1.8" />
      <rect x="11.5" y="2.5" width="6" height="8" rx="1.8" />
      <rect x="11.5" y="13" width="6" height="4.5" rx="1.8" />
    </svg>
  );
}

export function PlaygroundMark({ size = 18 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7.4 6.2 3.6 10l3.8 3.8M12.6 6.2 16.4 10l-3.8 3.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------- hero metadata marks (decorative, docs-only) */

export function ReactMark({ size = 14 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <ellipse cx="8" cy="8" rx="6.6" ry="2.6" stroke="currentColor" strokeWidth="1.1" />
      <ellipse
        cx="8"
        cy="8"
        rx="6.6"
        ry="2.6"
        stroke="currentColor"
        strokeWidth="1.1"
        transform="rotate(60 8 8)"
      />
      <ellipse
        cx="8"
        cy="8"
        rx="6.6"
        ry="2.6"
        stroke="currentColor"
        strokeWidth="1.1"
        transform="rotate(120 8 8)"
      />
    </svg>
  );
}

export function TypeScriptMark({ size = 14 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.6" y="1.6" width="12.8" height="12.8" rx="2.6" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4.6 6.6h3.2M6.2 6.6v4.4M11.6 7.1a1.6 1.6 0 0 0-2.4 1.3c0 1.5 2.4 1 2.4 2.3a1.5 1.5 0 0 1-2.4.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
