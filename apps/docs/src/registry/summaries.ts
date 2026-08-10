/**
 * Short, user-facing blurbs — deliberately separate from `ComponentDocsMeta.description` (the
 * long, audit-history copy sourced from each component's `docs.meta.ts`), which is untouched and
 * still shown in full further down the component detail page. A card or hero summary should
 * read in one glance; the full technical account is one scroll or one click away, never gone.
 *
 * Shared between the catalogue grid (`ComponentsPage`) and the component detail page
 * (`ComponentDetailPage`) so the same one-line description follows a component everywhere.
 */
export const componentSummaries: Record<string, string> = {
  button: "Primary actions and calls to action.",
  "button-group": "Grouped, related actions in one row.",
  link: "Text or icon links for navigation.",
  "sidebar-navigation": "Vertical navigation for app sidebars.",
  switcher: "Segmented control for switching views.",
  "tab-navigation": "Tabs for organizing related content.",
  "top-navigation": "Horizontal navigation for primary sections.",
  list: "Rows of structured, scannable content.",
  chip: "Compact tags for filters and selections.",
  tags: "Small labels for status and metadata.",
  avatar: "User or entity profile images.",
  pagination: "Page controls for long result sets.",
  table: "Structured rows for tabular data.",
  tooltip: "Contextual hints on hover or focus.",
  alert: "Inline messages for important context.",
  toast: "Brief, temporary status notifications.",
  modal: "Focused dialogs for a single task.",
  progress: "Visual indicator of task completion.",
  input: "Text fields for collecting user input.",
  checkbox: "Multi-select choices in a list.",
  radio: "Single-select choices in a group.",
  toggle: "On/off switches for settings.",
  "date-picker": "Calendar input for choosing dates.",
};
