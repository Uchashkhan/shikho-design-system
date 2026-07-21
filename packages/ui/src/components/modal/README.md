# Modal

Implements the `modal` component set. The original overview audit (`docs/audit/modal.md`) deliberately did not run `get_design_context` — `modal_header` and `modal_actions` appeared only as bare, unexpanded instances. A deep re-audit (`docs/audit/modal-deep-audit.md`) has since confirmed the real internal structure for both `type` variants.

## Confirmed vs. derived

**Exactly confirmed** (`docs/audit/modal-deep-audit.md`):
- Exactly one property, `type` (`default`, `confirmation`) — 544×352 vs. 480×256.
- **`default` and `confirmation` are genuinely different compositions, not a resize**: `default` has a separately-bordered header block (title + close button) and a border-top before actions; `confirmation` merges title + description into one unbordered body block, uses a smaller feature-icon container (28px vs. 40px, `radius.lg` vs. `radius.xl`), and a lighter description color (`gray-600` vs. `gray-700`).
- A genuine elevation difference: `confirmation` (the smaller dialog) carries the *heavier* `elevation/e6` shadow (identical to Toast's); `default` uses `elevation/e5`.
- The confirmed `modalIcon` boolean (default `true`) gating the feature-icon block, and its gradient (`primary_base_em_alpha → primary_low_em_alpha`).
- The confirmed close button (32×32, circular, white fill) and the two action buttons (equal-width Cancel/primary pair) — both reuse the exact same "primary pill" inset-overlay treatment already confirmed on Date Picker's Set Date button and Button Group's range-selection cells.

**Derived, documented as such (not confirmed by Figma):**
- **No overlay/backdrop mechanism is confirmed to exist** (`modal.md` §7 — no `modal_overlay` piece anywhere in this selection). A functional backdrop (`rgba(0,0,0,0.5)`, click-to-dismiss) is included because a floating dialog is meaningless without one — the same category of necessary-but-unconfirmed functional addition already made for Date Picker's calendar interactions.
- Dismiss behavior (Escape key, backdrop click, initial focus) — not a Figma property; implemented as ordinary accessible-dialog behavior (`role="dialog"`, `aria-modal`).
- No confirmed nested Button-family instance for the close button or action buttons — both carry plain, locally-scoped node IDs, the same situation as Date Picker's/Button Group's own buttons. Implemented inline.

## Usage

```tsx
import { Modal } from "@shikho/ui";

function ConfirmDeleteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      type="confirmation"
      open={open}
      onDismiss={onClose}
      title="Delete this item?"
      description="This action cannot be undone."
      secondaryActionContent="Cancel"
      primaryActionContent="Yes, delete"
      onSecondaryAction={onClose}
      onPrimaryAction={() => {/* delete, then onClose() */}}
    />
  );
}
```

`Modal` renders through a portal into `document.body` by default (`usePortal`, disable for tests or inline embedding).

## Not implemented

- Fullscreen/mobile/bottom-sheet layouts — confirmed absent from this selection.
- A focus trap — initial focus moves to the dialog on open, but Tab is not cycled inside it (not confirmed as a Figma behavior, and out of scope for this pass).

## Token dependencies

`@shikho/tokens`: `color.white`, `color.gray`, `color.primary`, `color.black`, `radius.lg`, `radius.xl`, `radius["4xl"]`, `radius.full`, and `elevation.e2/e5/e6`.
