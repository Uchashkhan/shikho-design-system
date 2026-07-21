# Date Picker

Implements the `date_picker` component set. The original overview-only audit (`docs/audit/date-picker.md`) deliberately did not run `get_design_context`, so an earlier version of this component was a placeholder: a fixed-size, empty `<div>`. A deep structural re-audit (`docs/audit/date-picker-deep-audit.md`) has since inspected all four confirmed variants via `get_design_context` and confirmed a real internal hierarchy — a presets sidebar, one or two calendar panels, and a footer — which this component now implements.

## Confirmed vs. derived

See `docs/audit/date-picker-deep-audit.md` for the full breakdown, cited section by section. Summary:

**Exactly confirmed:**
- `type` (`range`, `single`) × `size` (`lg`, `md`); shell fill/border/radius (`radius/border_radius_xxl` = 24, **not** `radius["2xl"]` as the earlier placeholder assumed) and `elevation/e4` shadow.
- A permanent presets sidebar in **all four** variants (200px at `lg`, 160px at `md`), with the 7 confirmed labels in order: Today, Last 7 days, Last 14 days, Last 30 days, Last 3 months, Last 12 months, All time.
- `single` renders exactly one calendar panel; `range` renders two, separated by a divider, each with its own nav controls.
- Calendar cell geometry: 48px (`lg`) / 40px (`md`) wide, 40px tall, `radius/custom/md` (10px).
- The full "row-segmented pill" range-highlight algorithm (absolute start/end vs. row-start/row-end vs. plain middle cells) — read directly off the `range/lg` screenshot and cross-checked against the code.
- The footer's date-display fields are a confirmed structural and token match to the Input family's own `field` component (identical layer naming, identical `input_inner_shadow`) — reused directly here, not re-implemented.
- A genuine one-off: `type=single, size=md` hides the footer date field and stretches Cancel/Set Date to fill the width; every other combination shows the field(s) with right-aligned, natural-width buttons.

**Derived, documented as such (not confirmed by any instance):**
- Hover styling on day cells / preset items (no confirmed hover example exists anywhere) — reuses the confirmed `Color/gray/100` resting fill already seen on this component's own nav buttons.
- Disabled dates — no confirmed visual; implemented as a purely functional `isDateDisabled` prop using the same `opacity: 0.5` convention already used by every other disabled control in this library.
- Preset date-range arithmetic (e.g. "Last 7 days" = today−6 → today) — a visual audit cannot confirm date math; this is the ordinary, unambiguous interpretation of each label.
- The shell no longer hardcodes a literal pixel height — it hugs its content (so a 6-week month doesn't clip) rather than reproducing the static frame's fixed 408/352px, which was only ever a function of a specific demo month.

**Explicitly out of scope, not implemented:**
- Month/year "jump" picker, time selection — no confirmed control for either.
- Mobile-specific layout — not confirmed to exist.

## Architecture

```
DatePicker
├── presets sidebar        (7 confirmed labels; hidden via presets={false})
├── calendar panel × 1-2    (nav header, weekday row, day grid — one per type=single, two per type=range)
└── footer                  (Field-based date display, conditionally hidden; Cancel/Set Date)
```

No sub-component here has its own confirmed Figma component-set identity, so none is part of the public `@shikho/ui` API — only `DatePicker` itself, its prop/value types, and `DATE_PICKER_PRESETS` are exported.

**Reuse:** the footer date fields compose the real `Field` component (a confirmed match, see above); Cancel/Set Date compose the real `GreyscaleButton`/`NewBlueButton` components with a `style` override layering in this audit's own newly-confirmed exact padding/shadow (the same pattern `Toast` already uses to override `ButtonDanger`'s fill). Day cells and nav arrows are implemented inline — no nested-instance relationship to any Button family was confirmed for them (unlike the footer fields), the same reasoning already applied to Alert's own inline second action button.

## Usage

```tsx
import { DatePicker, type DateRangeValue } from "@shikho/ui";

function ReportDateRange() {
  const [applied, setApplied] = useState<DateRangeValue | null>(null);

  return (
    <DatePicker
      type="range"
      size="lg"
      onApply={(value) => setApplied(value)}
      onCancel={() => {/* close without applying */}}
    />
  );
}
```

`value`/`defaultValue` and `onChange` work exactly like a controlled/uncontrolled form field. `onApply` fires on **Set Date**; `onCancel` fires on **Cancel** and reverts the in-progress selection back to the last applied value.

## Not implemented

- Month/year jump picker, time selection, mobile-specific layout — none confirmed to exist.
- Real calendar-navigation icon glyphs — no `@shikho/icons` inventory exists yet, so the chevrons are inline SVGs (the only component in this library to need a directional glyph that isn't a consumer-supplied slot, since the nav arrows have no confirmed nested Button-icon relationship to compose from).

## Token dependencies

`@shikho/tokens`: `color.white`, `color.gray`, `color.primary`, `radius.md`, `radius.lg`, `radius["3xl"]`, and `elevation.e4`. Composes `Field` (Input family) and `GreyscaleButton`/`NewBlueButton` (Button family) from within `@shikho/ui` itself.
