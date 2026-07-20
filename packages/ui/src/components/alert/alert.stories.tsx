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

/** Every confirmed severity. Only `danger` has confirmed color/layout data — the border color
 * for the other three severities reuses the audit's own confirmed `outline/{severity}_alpha`
 * hex values (§9), and `Default` falls back to a derived neutral gray border. */
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
