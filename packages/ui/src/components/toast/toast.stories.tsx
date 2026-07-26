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

/** Every confirmed severity — a fresh re-audit (docs/audit/toasts.md §14) confirmed the border,
 * icon tint, and action-button composition for all 5, not just `danger`. Note `default`'s icon
 * is gray-950 (not primary-tinted like Alert's `Default`), and its own action button uses
 * secondary/500 + white text — distinct from warning/info's neutral gray button. */
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

/**
 * Confirmed via a fresh get_design_context re-audit (docs/audit/toasts.md §14): only `danger` and
 * `success` compose a severity-tinted Button family member (`ButtonDanger`/`ButtonSuccess`) with a
 * TINTED background — confirmed different from Alert's equivalent, which tints only the text.
 * `warning`/`info` render a plain neutral gray button; `default` gets its own distinct
 * secondary/500-filled button.
 */
export const ActionButtonBySeverity: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {states.map((state) => (
        <Toast
          key={state}
          state={state}
          titleContent={state}
          descriptionContent="danger/success get a tinted-background button; warning/info stay neutral; default is pink."
          actionContent="UNDO"
        />
      ))}
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
