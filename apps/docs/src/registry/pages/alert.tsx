import { Alert, type AlertState } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const STATES: AlertState[] = ["Default", "danger", "success", "warning", "info"];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited across all 5 severities via get_design_context, with a requested color-mapping override layered on top (docs/audit/alerts.md §15): \"Learn more\" (the first action button) now stays plain neutral gray at every severity — it no longer composes the real ButtonDanger/ButtonSuccess for danger/success the way Figma's own confirmed instances do. \"Dismiss\" (the second action button) inherits each severity's own color instead of the confirmed flat secondary/500 pink, and the root surface fill is severity-tinted (X/50) too, except Default which keeps its confirmed white fill. Both icon slots (the left severity icon, bumped a bit bigger per request, and the corner close 'X') render real default glyphs by default, downloaded directly from Figma's own SVG source.",
  variants: [
    {
      name: "state",
      values: STATES,
      note: "Functions as a severity/theme axis, not an interaction state. Casing is a confirmed inconsistency: Default is capitalized, the other four are lowercase.",
    },
  ],
  states: [],
  gaps: [
    "warning/info border colors (outline/warning_alpha, outline/info_alpha) are confirmed exact hex values with no equivalent yet in @shikho/tokens, so they're used as cited literal constants rather than added to the tokens package.",
    "Whether the visible \"Dismiss\" text button and the corner close button are two distinct intended controls or redundant was never determined — both are implemented as independent, separately-clickable controls rather than collapsing them into one.",
    "primaryAction/dismissAction are requested additions with no Figma source — Figma's own sampled instances always show both action buttons; these default to true to keep that appearance unchanged.",
    "Requested override, not part of the original Figma audit: \"Learn more\" no longer composes ButtonDanger/ButtonSuccess for danger/success (Figma's own confirmed construction) — it's now the same plain neutral gray/700-on-gray/100 button at every severity.",
    "Requested override: \"Dismiss\" now inherits state's own 500 color (Default→primary, danger→danger, success→success, warning→warning with warning/950 text specifically for contrast) instead of the confirmed flat secondary/500 pink. info wasn't named in the request — extended by analogy to info/500.",
    "Requested override: the root surface fill is now severity-tinted (X/50) for danger/success/warning/info — Default keeps its confirmed white fill, unchanged (not named in the request).",
    "Requested: the severity icon is a bit bigger — slot 24px→28px, glyph 18px→22px.",
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
    { name: "state", type: "Default | danger | success | warning | info", defaultValue: "danger", description: "Severity/theme axis, confirmed across all 5 values. Now also drives the root surface fill and Dismiss button color (requested override, §15)." },
    { name: "leftIcon", type: "boolean", defaultValue: "true", description: "The one confirmed boolean property — no boolean exists for title, description, or actions." },
    { name: "icon", type: "ReactNode", description: "Overrides the confirmed default info-circle icon, tinted per state (now rendered a bit bigger — requested). Rarely needed." },
    { name: "titleContent / descriptionContent", type: "ReactNode", description: "Title (15px/24px SemiBold) and description (13px/20px Regular) content." },
    { name: "primaryActionContent / onPrimaryActionClick", type: "ReactNode / () => void", description: "\"Learn more\" — always a plain neutral gray button now, at every severity (requested override; Figma's own confirmed construction composed ButtonDanger/ButtonSuccess for danger/success)." },
    { name: "primaryAction / dismissAction", type: "boolean", defaultValue: "true", description: "Requested addition. Independently show/hide each action button — Figma's own sampled instances always show both." },
    { name: "dismissContent / onDismissClick", type: "ReactNode / () => void", description: "\"Dismiss\" — the primary semantic action. Now inherits state's own color (requested override; Figma's own confirmed value is a flat secondary/500 pink regardless of severity)." },
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
      {
        prop: "icon",
        label: "Icon",
        defaultValue: "shown",
        options: [
          { label: "shown", value: "shown" },
          { label: "hidden", value: "hidden" },
        ],
      },
      {
        prop: "buttons",
        label: "Buttons",
        defaultValue: "multiple",
        options: [
          { label: "none", value: "none" },
          { label: "single", value: "single" },
          { label: "multiple", value: "multiple" },
        ],
      },
    ],
    render: (v) => (
      <Alert
        state={v.state as AlertState}
        leftIcon={v.icon === "shown"}
        titleContent="Notification text"
        descriptionContent="Supporting description goes here."
        primaryActionContent="Learn more"
        primaryAction={v.buttons === "single" || v.buttons === "multiple"}
        dismissContent="Dismiss"
        dismissAction={v.buttons === "multiple"}
      />
    ),
  },
  showcases: [
    {
      title: "All five severities",
      description: "Root fill and Dismiss's color are now severity-tinted (requested override, §15) — Learn more stays neutral gray at every severity.",
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
      title: "\"Learn more\" stays neutral, \"Dismiss\" inherits the state color",
      description: "The core rule from the request: state controls the semantic surface + the semantic primary action (Dismiss); the secondary action (Learn more) stays unchanged.",
      render: () => (
        <Alert
          state="success"
          titleContent="Consistent secondary action"
          descriptionContent="Learn more is neutral here too, even though the surface and Dismiss are success-tinted."
          primaryActionContent="Learn more"
          dismissContent="Dismiss"
        />
      ),
    },
  ],
};
