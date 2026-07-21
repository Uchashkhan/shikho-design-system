import { Alert, type AlertState } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const STATES: AlertState[] = ["Default", "danger", "success", "warning", "info"];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited at state=\"danger\" via get_design_context — the first composed component since List, and the clearest cross-component confirmation in the entire audit series: the primary action button's literal Figma instance path is button_danger/md/secondary/default, so Alert composes the real ButtonDanger rather than a re-drawn button. Unlike nearly every other audited component, Alert has no boolean for title, description, or actions — they render unconditionally, so its prop surface intentionally has just one boolean (leftIcon) rather than inventing toggles Figma doesn't expose.",
  variants: [
    {
      name: "state",
      values: STATES,
      note: "Functions as a severity/theme axis, not an interaction state. Casing is a confirmed inconsistency: Default is capitalized, the other four are lowercase.",
    },
  ],
  states: [],
  gaps: [
    "Only state=\"danger\" has confirmed layout/color data — whether Default/success/warning/info share this exact structure, or the fill/icon also change per severity, is explicitly out of scope in the audit. The one confirmed fill (white) is applied uniformly across all five severities.",
    "warning/info border colors (outline/warning_alpha, outline/info_alpha) are confirmed exact hex values with no equivalent yet in @shikho/tokens, so they're used as cited literal constants rather than added to the tokens package.",
    "Default's border color has no confirmed value anywhere (only danger was deep-audited) — it uses a neutral color.gray[200] as a documented derived baseline, not a fabricated severity color.",
    "The second action button (\"Dismiss\") has an exact confirmed fill/text, but is not confirmed to be drawn from any named component set — implemented as its own inline <button>, not assumed into a ButtonDanger composition the citation doesn't support.",
    "Whether the visible \"Dismiss\" text button and the corner close button are two distinct intended controls or redundant was never determined — both are implemented as independent, separately-clickable controls rather than collapsing them into one.",
    "No real icon glyph content exists yet for either icon slot — no @shikho/icons glyphs exist, so icon/closeIcon are empty ReactNode slots unless a consumer supplies one.",
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
    { name: "state", type: "Default | danger | success | warning | info", defaultValue: "danger", description: "Severity/theme axis. Only danger has confirmed layout and color data." },
    { name: "leftIcon", type: "boolean", defaultValue: "true", description: "The one confirmed boolean property — no boolean exists for title, description, or actions." },
    { name: "icon", type: "ReactNode", description: "Content for the 24×24 leading icon slot." },
    { name: "titleContent / descriptionContent", type: "ReactNode", description: "Title (15px/24px SemiBold) and description (13px/20px Regular) content." },
    { name: "primaryActionContent / onPrimaryActionClick", type: "ReactNode / () => void", description: "Composes the real ButtonDanger (md/Secondary) — a confirmed nested instance path." },
    { name: "dismissContent / onDismissClick", type: "ReactNode / () => void", description: "The second action button, confirmed structurally but not confirmed to be a named component set." },
    { name: "closeIcon / onCloseClick / closeButtonLabel", type: "ReactNode / () => void / string", defaultValue: "\"Close\"", description: "The absolutely-positioned corner icon button." },
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
      description: "Only danger is deep-audited; the shared white fill is applied uniformly across the rest.",
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
