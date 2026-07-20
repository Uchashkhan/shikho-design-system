import type { Meta, StoryObj } from "@storybook/react";
import { Toast, type ToastState } from "./toast";

const states: ToastState[] = ["default", "danger", "success", "warning", "info"];

const meta: Meta<typeof Toast> = {
  title: "Toast/toast",
  component: Toast,
  args: {
    state: "danger",
    titleContent: "Withdrawal Successful",
    descriptionContent: "Your withdrawal of 0.02 BTC has been processed",
    actionContent: "UNDO",
  },
  argTypes: {
    state: { control: "select", options: states },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

/** The one deep-audited instance: state=danger (docs/audit/toasts.md §9). */
export const ConfirmedBinding: Story = {};

export const Playground: Story = {};

/** Every confirmed severity. Only `danger` has confirmed color/layout data; the other three
 * reuse the audit's own confirmed `outline/{severity}_alpha` hex values (§8), identical to Alert's. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {states.map((state) => (
        <Toast
          key={state}
          state={state}
          titleContent={`Withdrawal Successful (${state})`}
          descriptionContent="Your withdrawal of 0.02 BTC has been processed"
          actionContent="UNDO"
        />
      ))}
    </div>
  ),
};

/**
 * Toast vs. Alert, side by side — same nested `ButtonDanger` dependency, confirmed different
 * fill (docs/audit/toasts.md §10/§11): `items-center` vs `items-start`, row vs. column layout,
 * `elevation/e6` vs `e5`, inline rounded-square dismiss vs. absolutely-positioned circular.
 */
export const ComposedButtonDependencyComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toast titleContent="Toast (button fill: danger alpha-12)" actionContent="UNDO" />
    </div>
  ),
};

/** The `featureIcon` boolean — confirmed default `false`, and a slot with no equivalent in Alert. */
export const FeatureIconOnOffComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toast
        featureIcon={false}
        titleContent="Without featureIcon (default)"
        actionContent="UNDO"
      />
      <Toast featureIcon titleContent="With featureIcon" actionContent="UNDO" />
    </div>
  ),
};

/** All 5 confirmed booleans compared: leftIcon, featureIcon, desc, actionButton, rightIcon. */
export const AllConfirmedBooleans: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toast titleContent="All slots on (defaults)" descriptionContent="Description" actionContent="UNDO" />
      <Toast
        leftIcon={false}
        desc={false}
        actionButton={false}
        rightIcon={false}
        titleContent="Title only — every other boolean off"
      />
    </div>
  ),
};
