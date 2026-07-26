import { Alert, type AlertState } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const STATES: AlertState[] = ["Default", "danger", "success", "warning", "info"];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited across all 5 severities via get_design_context. The primary action button's construction genuinely differs by severity: danger composes the real ButtonDanger and success composes the real ButtonSuccess (both confirmed nested Figma instance paths, with severity-tinted text), while Default/warning/info render a plain neutral gray button instead. Both icon slots (the left severity icon and the corner close 'X') now render real default glyphs by default, downloaded directly from Figma's own SVG source and confirmed identical in shape across every severity — only the severity icon's fill color changes, matching that severity's own 500 token exactly.",
  variants: [
    {
      name: "state",
      values: STATES,
      note: "Functions as a severity/theme axis, not an interaction state. Casing is a confirmed inconsistency: Default is capitalized, the other four are lowercase.",
    },
  ],
  states: [],
  gaps: [
    "Only danger and success compose a severity-tinted Button family member for the primary action (ButtonDanger/ButtonSuccess) — Default/warning/info are confirmed to use a plain neutral gray/gray-700 button instead, not tinted.",
    "warning/info border colors (outline/warning_alpha, outline/info_alpha) are confirmed exact hex values with no equivalent yet in @shikho/tokens, so they're used as cited literal constants rather than added to the tokens package.",
    "The second action button (\"Dismiss\") has an exact confirmed fill/text, identical across all 5 severities, but is not confirmed to be drawn from any named component set — implemented as its own inline <button>.",
    "Whether the visible \"Dismiss\" text button and the corner close button are two distinct intended controls or redundant was never determined — both are implemented as independent, separately-clickable controls rather than collapsing them into one.",
  ],
  usageExample: `import { Alert } from "@shikho/ui";

function DangerBanner() {
  return (
    <Alert
      state="danger"
      titleContent="Something went wrong"
      descriptionContent="Your changes could not be saved."
      primaryActionContent="Retry"
      dismissContent="Dismiss"
      onPrimaryActionClick={() => {}}
      onDismissClick={() => {}}
      onCloseClick={() => {}}
    />
  );
}`,
  props: [
    { name: "state", type: "Default | danger | success | warning | info", defaultValue: "danger", description: "Severity/theme axis, confirmed across all 5 values." },
    { name: "leftIcon", type: "boolean", defaultValue: "true", description: "The one confirmed boolean property — no boolean exists for title, description, or actions." },
    { name: "icon", type: "ReactNode", description: "Overrides the confirmed default info-circle icon, tinted per state — rarely needed." },
    { name: "titleContent / descriptionContent", type: "ReactNode", description: "Title (15px/24px SemiBold) and description (13px/20px Regular) content." },
    { name: "primaryActionContent / onPrimaryActionClick", type: "ReactNode / () => void", description: "Composes real ButtonDanger/ButtonSuccess for danger/success; a plain neutral button for Default/warning/info." },
    { name: "dismissContent / onDismissClick", type: "ReactNode / () => void", description: "The second action button, confirmed structurally identical across all 5 severities but not confirmed to be a named component set." },
    { name: "closeIcon / onCloseClick / closeButtonLabel", type: "ReactNode / () => void / string", defaultValue: "\"Close\"", description: "The absolutely-positioned corner icon button — renders a confirmed default 'X' icon unless overridden." },
  ],
  preview: () => (
    <Alert
      state="danger"
      titleContent="Notification text"
      descriptionContent="Supporting description goes here."
      primaryActionContent="Learn more"
      dismissContent="Dismiss"
    />
  ),
  playground: {
    controls: [
      {
        prop: "state",
        label: "State",
        defaultValue: "danger",
        options: STATES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <Alert
        state={v.state as AlertState}
        titleContent="Notification text"
        descriptionContent="Supporting description goes here."
        primaryActionContent="Learn more"
        dismissContent="Dismiss"
      />
    ),
  },
  showcases: [
    {
      title: "All five severities",
      description: "Every severity is now deep-audited: only danger/success get a tinted primary button; Default/warning/info stay neutral.",
      layout: "stack",
      render: () => (
        <>
          {STATES.map((state) => (
            <div key={state} style={{ marginBottom: 16 }}>
              <Alert
                state={state}
                titleContent={state}
                descriptionContent="Supporting description goes here."
                primaryActionContent="Learn more"
                dismissContent="Dismiss"
              />
            </div>
          ))}
        </>
      ),
    },
    {
      title: "A confirmed nested ButtonDanger dependency",
      description: "The primary action is the real ButtonDanger component (md/Secondary), not a re-drawn button.",
      render: () => (
        <Alert
          state="danger"
          titleContent="Cross-component confirmation"
          descriptionContent="button_danger/md/secondary/default"
          primaryActionContent="Learn more"
          dismissContent="Dismiss"
        />
      ),
    },
  ],
};
