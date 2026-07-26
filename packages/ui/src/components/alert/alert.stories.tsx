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

/** Every confirmed severity — a fresh re-audit (docs/audit/alerts.md §14) confirmed the border,
 * icon tint, and primary-button composition for all 5, not just `danger`. `Default`'s border is
 * confirmed `gray/100` (not a derived guess), and its icon is confirmed primary-tinted. */
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
 * Demonstrates that the confirmed action button composes the real `ButtonDanger` component
 * (`button_danger/md/secondary/default`, docs/audit/alerts.md §11) rather than a re-drawn
 * button — inspect the rendered button's class names/data attributes to confirm.
 */
export const ComposedButtonDependency: Story = {};

/**
 * Confirmed via a fresh get_design_context re-audit (docs/audit/alerts.md §14): only `danger` and
 * `success` compose a severity-tinted Button family member (`ButtonDanger`/`ButtonSuccess`) for
 * the first action, with matching tinted text. `Default`/`warning`/`info` render a plain neutral
 * gray button instead — NOT color-tinted, despite the alert itself being colored by severity.
 */
export const PrimaryButtonBySeverity: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {states.map((state) => (
        <Alert
          key={state}
          state={state}
          titleContent={state}
          descriptionContent="danger/success get a tinted button; Default/warning/info stay neutral gray."
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
