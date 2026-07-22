# Table

Implements `table_cell`. The original overview audit (`table.md`) never ran `get_design_context` and — based on `table_cell` exposing "zero boolean properties in this metadata" — speculated it might be a simple two-property leaf. A deep re-audit (`docs/audit/table-deep-audit.md`) confirms the opposite: `table_cell` is one of the richest single components audited in this entire library.

## What's implemented

- **`TableCell`** — covering both confirmed `type` families (`header`/`header_compact` vs. `default`/`default_compact`) and both `state` values (`default`, `loading`).
- **`table` (the bare Figma instance) is not implemented** — its internal composition (rows, header, toolbar, pagination) was never expanded in Figma; consistent with this project's existing "don't implement unconfirmed compositions" precedent.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/table-deep-audit.md`):
- A real nested `Checkbox` dependency for row selection — identical to `List`'s own confirmed `Checkbox` reuse.
- Up to 3 avatar-style circular image slots (confirmed pixel sizes 24/32/40 at `default` density, 20/24/32 at `_compact` density).
- 2 confirmed `Tags`-shaped slots — `tag1` maps to `Tags`' `secondary` type (gray/100 fill), `tag2` maps to `primary_light` (primary/500 @ 12% fill) — both exact matches to `table_cell`'s own confirmed tag colors.
- `header`/`header_compact` types are confirmed structurally simpler: no `description` line, only one avatar slot, no tag/dropdown/action slots.
- `state="loading"` is confirmed to be a **real skeleton row** (2 circles + a full-width bar), not the real content dimmed or a spinner overlay.

**Derived, documented as such:**
- The audited `default` instance had all 3 avatar slots, both tags, checkbox, and every icon slot turned on simultaneously — this implementation treats that as a spec-sheet illustration (turning on every optional slot at once to show what's available), not a literal confirmed default. Every optional slot defaults to hidden here, requiring explicit opt-in.
- `header_compact` was not independently re-audited; its padding is derived by scaling `header`'s confirmed padding the same way `default`→`default_compact` scales.
- The `dropdown` and icon-button action slots are implemented inline with `table_cell`'s own confirmed exact values (padding, `radius.sm`) rather than composing the Input family's own `Dropdown` component, whose confirmed radius (`radius.md`) doesn't match.

## Usage

```tsx
import { TableCell } from "@shikho/ui";

function UserRow() {
  return (
    <TableCell
      checkbox
      avatar={{ size: "sm", src: "/jane.png", alt: "Jane Doe" }}
      heading="Jane Doe"
      supportText="Admin"
      description="jane@example.com"
      tag1="Active"
      tag2="Verified"
    />
  );
}
```

## Not implemented

- Sorting, column alignment, pagination controls, expandable rows, status indicators, sticky headers — none appear in any audited instance.
- `table` (the bare instance) — internal composition never expanded.

## Token dependencies

`@shikho/tokens`: `color.gray`, `color.white`, `radius.sm/md/full`, and `elevation.e2` (used inside a CSS `filter: drop-shadow()` pair for icon slots). Composes `Checkbox` and `Tags` from within `@shikho/ui` itself.
