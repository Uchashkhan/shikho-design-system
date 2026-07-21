import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal, type ModalType } from "./modal";

const types: ModalType[] = ["default", "confirmation"];

const lightning = (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
  </svg>
);

const meta: Meta<typeof Modal> = {
  title: "Modal/modal",
  component: Modal,
  args: {
    type: "default",
    title: "Action heading",
    description: "Are you sure you want to proceed with this action?",
    secondaryActionContent: "Cancel",
    primaryActionContent: "Yes, continue",
    featureIconContent: lightning,
    usePortal: false,
  },
  argTypes: {
    type: { control: "select", options: types },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Playground: Story = {};

/** The two confirmed types (docs/audit/modal-deep-audit.md §2) — genuinely different compositions, not a resize. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <Modal {...args} type="default" />
      <Modal {...args} type="confirmation" />
    </div>
  ),
};

export const Default: Story = {
  args: { type: "default" },
};

export const Confirmation: Story = {
  args: { type: "confirmation" },
};

/** modalIcon defaults to true (§5); this shows it turned off. */
export const WithoutFeatureIcon: Story = {
  args: { modalIcon: false },
};

/** A fully interactive demo: open/close via a trigger button, with real Cancel/Confirm/Escape/backdrop dismissal. */
export const InteractiveOpenClose: Story = {
  render: (args) => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open modal
          </button>
          <Modal
            {...args}
            open={open}
            usePortal
            onDismiss={() => setOpen(false)}
            onSecondaryAction={() => setOpen(false)}
            onPrimaryAction={() => setOpen(false)}
          />
        </>
      );
    }
    return <Demo />;
  },
};
