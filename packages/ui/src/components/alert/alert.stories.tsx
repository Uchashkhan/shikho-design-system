import type { Meta, StoryObj } from "@storybook/react";
import { Alert, type AlertState } from "./alert";

const states: AlertState[] = ["Default", "danger", "success", "warning", "info"];

const meta: Meta<typeof Alert> = {
  title: "Alert/alert",
  component: Alert,
  args: {
    state: "danger",
    titleContent: "Notification text",
    descriptionContent: "A short description followed by two actions items.",
    primaryActionContent: "Learn more",
    dismissContent: "Dismiss",
  },
  argTypes: {
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

/** The one deep-audited instance: state=danger (docs/audit/alerts.md §11). */
export const ConfirmedBinding: Story = {};

export const Playground: Story = {};

/** Every confirmed severity — a fresh re-audit (docs/audit/alerts.md §14) confirmed the border
 * and icon tint for all 5, not just `danger`. `Default`'s border is confirmed `gray/100` (not a
 * derived guess), and its icon is confirmed primary-tinted. Root fill and Dismiss's color are a
 * requested override (§15) layered on top — see `DismissInheritsStateColor` below. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {states.map((state) => (
        <Alert
          key={state}
          state={state}
          titleContent={`Notification text (${state})`}
          descriptionContent="A short description followed by two actions items."
          primaryActionContent="Learn more"
          dismissContent="Dismiss"
        />
      ))}
    </div>
  ),
};

/**
 * Requested override (docs/audit/alerts.md §15) — "Learn more" is now the same plain neutral
 * gray/700-on-gray/100 button at EVERY severity, including danger/success. Figma's own confirmed
 * construction composed the real `ButtonDanger`/`ButtonSuccess` there instead (§11/§14); this
 * intentionally departs from that.
 */
export const LearnMoreStaysNeutral: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {states.map((state) => (
        <Alert
          key={state}
          state={state}
          titleContent={state}
          descriptionContent="Learn more stays neutral gray regardless of severity — only Dismiss inherits the state color."
          primaryActionContent="Learn more"
          dismissContent="Dismiss"
        />
      ))}
    </div>
  ),
};

/**
 * Requested color mapping (docs/audit/alerts.md §15) — Dismiss ("the primary semantic action")
 * now inherits each severity's own 500 color instead of the confirmed flat secondary/500 pink
 * (§11). warning's text is warning/950 specifically (contrast); every other state's text is
 * white. The root surface fill is also severity-tinted (X/50) now, except Default (unchanged
 * white).
 */
export const DismissInheritsStateColor: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {states.map((state) => (
        <Alert
          key={state}
          state={state}
          titleContent={state}
          descriptionContent="Dismiss's fill/text now maps to this severity's own color."
          primaryActionContent="Learn more"
          dismissContent="Dismiss"
        />
      ))}
    </div>
  ),
};

/**
 * The two confirmed leading-icon booleans this component actually has: `leftIcon` toggles the
 * severity icon slot, and the corner close button and second action button always render
 * (no boolean exists for them in the audit, §11).
 */
export const LeadIconOnOffComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Alert
        leftIcon
        titleContent="With leftIcon"
        descriptionContent="leftIcon=true (default)"
        primaryActionContent="Learn more"
        dismissContent="Dismiss"
      />
      <Alert
        leftIcon={false}
        titleContent="Without leftIcon"
        descriptionContent="leftIcon=false"
        primaryActionContent="Learn more"
        dismissContent="Dismiss"
      />
    </div>
  ),
};
