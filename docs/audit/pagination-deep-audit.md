# Pagination Deep Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0", same file as `pagination.md`.
**Method:** `get_metadata` and `get_design_context` (via the Figma MCP desktop connection) against all 6 confirmed `page` variants: `first` (`66082:32877`), `center` (`66082:32898`), `last` (`66082:32921`), `less_pages` (`66082:32942`), `load_more` (`66082:32947`), `mobile` (`66082:32957`).
**Relationship to `pagination.md`:** That audit was explicitly overview-only. This document supersedes it for internal structure while leaving its `page`-value and bounding-box findings intact. `pagination.md`'s own §7/§11/§12 flagged this component set as "functionally reads as a scenario/demo showcase rather than an atomic primitive with orthogonal properties" — **this deep audit confirms that assessment is correct**, and the implementation below follows it rather than forcing one dishonest shared prop surface.

---

## 1. Confirmed finding: `pagination` is not one component — it's three

Inspecting all 6 variants confirms three genuinely distinct widgets share this one Figma component set:

1. **Numbered pagination** (`first`, `center`, `last`, `mobile`) — a real, standard page-number navigator: prev/next icon buttons, a windowed run of page-number buttons with ellipses, an optional "go to page" input, an optional "results per page" dropdown. `mobile` is the same widget in a vertically-stacked layout.
2. **Compact prev/next** (`less_pages`) — no page numbers at all, just text-label "Prev"/"Next" buttons. Confirmed structurally simpler, not a resize of the numbered variant.
3. **Load-more progress widget** (`load_more`) — confirmed to be an **entirely different UI pattern**: a thin progress bar, a "Displaying 35 of 2979 games" counter line, and a single "Load more" button. This has no page numbers, no prev/next, and no shared layout with the other five variants at all — it is a load-more-button-with-progress widget, not a paginator.

This resolves `pagination.md` §7's own uncertainty ("blurring the line between reusable primitive and demo composition") — confirmed: `load_more` in particular is not a variant of the same control, it's a different control that happens to share this Figma frame.

## 2. Confirmed structure — numbered pagination (`first`/`center`/`last`/`mobile`)

```
pagination
├─ pages
│  ├─ icon_button (prev)   — 32×32, radius/custom/sm (8px), gray-100 fill, 18px icon + e2-derived filter shadow
│  ├─ numbers                — gap-4, each button 32×32, radius/custom/sm
│  │   ├─ current page       — solid primary/500 fill, border outline/Black 150, white text (caption_2 12px/16px SemiBold), the confirmed "primary pill" inset overlay (same treatment as Date Picker's Set Date, Modal's primary action, Button Group's range cells)
│  │   ├─ other pages        — no fill, gray-700 text, same typography
│  │   └─ ellipsis ("...")   — rendered identically to an "other page" button — plain text, not a distinct visual treatment
│  └─ icon_button (next)     — mirror of prev
└─ right (conditional — boolean `additionaInfo`, default true)
   ├─ go_to_page (conditional — boolean `goToPage`, default true)
   │   ├─ "Go to page:" label (gray-600, body_1 13px/20px Medium)
   │   ├─ input_field — 64px wide, "Number" placeholder, **confirmed genuine `input_inner_shadow`** application (resolving pagination.md §9/§14's "spillover or genuine?" question — it's genuine, a real jump-to-page field)
   │   └─ "Go" button — gray-100 fill, radius/custom/sm, gray-700 text
   └─ results_count (conditional — boolean `resultsCount`, default true)
       ├─ vertical divider
       ├─ "Results per page:" label (gray-600, body_1 Medium)
       └─ dropdown — showing e.g. "10", gray-950 text, **confirmed genuine `input_inner_shadow`** application, chevron icon with the confirmed e2-derived filter shadow
```

`mobile` reuses the identical `pages` row and `results_count` block, but stacks them vertically (`flex-col`, `gap: spacing/24`) and confirmed **omits** `go_to_page` entirely — only `resultsCount` appears below the page-number row.

### Confirmed page-number windowing algorithm

Read directly off `first`/`center`/`last`:
- `first` (current = 1 of 10): `[1] 2 3 4 5 … 10` — one leading window, one trailing ellipsis + last page.
- `center` (current = 5 of 10): `1 … 3 4 [5] 6 7 … 10` — first page, ellipsis, a 5-wide window centered on current, ellipsis, last page.
- `last` (current = 10 of 10): `1 … 6 7 8 9 [10]` — mirror of `first`.

This is confirmed to be the ordinary "always show first + last page, a window of neighbors around current, ellipsis when a gap exceeds 1" algorithm used by essentially every real pagination control — not invented, directly read off three concrete confirmed examples.

## 3. Confirmed structure — `less_pages`

```
pagination (page=less_pages)
├─ button "Prev" — gray-100 fill, radius/custom/sm, 16px left icon, gray-700 text (caption_2 SemiBold)
├─ "Go to page:" text label (gray-600, body_1 Medium) — confirmed present, but with NO accompanying input field anywhere in this variant
└─ button "Next" — mirror of Prev, icon on the right
```

**Confirmed oddity, not implemented as a real feature:** the orphaned "Go to page:" label with no input next to it is very likely a leftover/incomplete piece of this specific demo instance (the numbered variants' own "Go to page:" always pairs with a real input; this one doesn't). Rendering a label with no control attached would be non-functional and confusing, so this implementation's compact/`less_pages` mode omits that label rather than reproducing a broken affordance.

## 4. Confirmed structure — `load_more`

```
pagination (page=load_more)  — 176×128, flex-col, gap-12
├─ status
│  ├─ progress bar — 6px tall, track neutral_transparent_black/black-12, fill outline/Primary-300 (#bad5ff), radius/border_radius_round
│  └─ "Displaying 35 of 2979 games" — mixed inline styling: "35" in gray-950, "of" in gray-600, "2979" in primary/500, " games" in the label's default gray-700
└─ button "Load more" — gray-100 fill, radius/custom/md (10px, not sm — confirmed different from the numbered pagination's buttons), the confirmed 2-layer inset overlay
```

The progress-bar fill width in the audited instance is a fixed, tiny sliver (`8px` of a `176px`-wide track) — clearly just this one demo's arbitrary snapshot value, not a meaningful ratio to reproduce literally; the real component computes the fill from `loaded`/`total` props instead.

## 5. Confirmed vs. still-unresolved

**Newly confirmed** (resolving essentially all of `pagination.md` §6/§14's open questions):
- Prev/next controls, numbered page buttons, ellipsis, and the selected-page indicator all exist and are now fully specified (§2).
- `input_inner_shadow` is confirmed genuinely applied to two real controls (the go-to-page input and the results-per-page dropdown), not spillover.
- The page-number windowing algorithm (§2).
- `load_more` is confirmed to be a different widget, not a `pagination` variant in any meaningful sense (§1, §4).

**Still not confirmed, not invented:**
- Whether `load_more`'s progress bar meaningfully represents "items loaded so far" vs. some other metric — the label text ("Displaying X of Y") strongly implies it, and this implementation follows that reading, but no deep semantic confirmation exists beyond the visible text.
- Hover/focus/disabled states for any control — `pagination.md` §4 confirmed **zero state coverage anywhere**, the weakest of any component in this audit series. All interactive elements here rely on native browser affordances plus the confirmed resting/current visual treatment only.
- Whether the results-per-page control is a real `<select>`-backed dropdown internally, or a custom popover — Figma's own export never distinguishes the two (the same ambiguity found for every "dropdown"-named piece elsewhere in this system); implemented here as a native `<select>` for real functionality and accessibility.

## 6. Implementation decision

Two components, not one, matching what's actually confirmed:
- **`Pagination`** — the real numbered navigator (`first`/`center`/`last`/`mobile`/`less_pages` all map onto this single, properly parameterized component: `currentPage`, `totalPages`, `onPageChange`, a `compact` boolean for the `less_pages` treatment, a `layout: "horizontal" | "stacked"` for `mobile`, plus the confirmed optional go-to-page and results-per-page pieces).
- **`LoadMorePagination`** — the confirmed, structurally unrelated load-more/progress widget, exported separately rather than forced into `Pagination`'s prop surface. Forcing both into one component, the way the Figma file's single `page` property does, would reproduce the exact non-orthogonal design flaw `pagination.md` itself flagged as the weakest architecture in the whole audit series.
