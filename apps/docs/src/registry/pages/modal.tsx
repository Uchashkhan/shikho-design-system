import { Modal, type ModalType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const TYPES: ModalType[] = ["default", "confirmation"];

const lightning = (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
  </svg>
);

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original overview audit never ran get_design_context — modal_header and modal_actions appeared only as bare, unexpanded instances. A deep re-audit confirmed the real internal structure for both types, and that they're genuinely different compositions, not one shared shell resized: default has a separately-bordered header block, while confirmation merges title and description into one unbordered body block with a smaller feature icon and a lighter description color. Notably, the smaller confirmation dialog carries the heavier elevation/e6 shadow (identical to Toast's), while the larger default uses e5.",
  variants: [
    {
      name: "type",
      values: TYPES,
      note: "default (544×352) has a bordered header + border-top before actions; confirmation (480×256) has neither, and uses a smaller feature icon and a lighter gray-600 description.",
    },
  ],
  states: [],
  gaps: [
    "No overlay/backdrop mechanism is confirmed to exist anywhere in this selection — the functional backdrop (click-to-dismiss) here is a necessary, undocumented addition, the same reasoning already applied to Date Picker's calendar interactions.",
    "Dismiss behavior (Escape key, backdrop click, initial focus) is not a Figma property — implemented as ordinary accessible-dialog behavior (role=\"dialog\", aria-modal).",
    "No confirmed nested Button-family instance for the close button or the two action buttons — both carry plain, locally-scoped node IDs, the same situation already found for Date Picker and Button Group.",
    "Fullscreen/mobile/bottom-sheet layouts are confirmed absent from this selection — not implemented.",
    "A full focus trap is not implemented — initial focus moves to the dialog on open, but Tab is not cycled inside it.",
  ],
  usageExample: `import { Modal } from "@shikho/ui";

function ConfirmDeleteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      type="confirmation"
      open={open}
      onDismiss={onClose}
      title="Delete this item?"
      description="This action cannot be undone."
      secondaryActionContent="Cancel"
      primaryActionContent="Yes, delete"
      onSecondaryAction={onClose}
      onPrimaryAction={() => {/* delete, then onClose() */}}
    />
  );
}`,
  props: [
    { name: "type", type: "default | confirmation", defaultValue: "default", description: "Confirmed genuinely different compositions, not a resize of one shell." },
    { name: "modalIcon / featureIconContent", type: "boolean / ReactNode", defaultValue: "true", description: "Confirmed gradient feature-icon block. Size and radius differ by type." },
    { name: "title / description", type: "ReactNode", description: "Heading and body copy." },
    { name: "primaryActionContent / secondaryActionContent", type: "ReactNode", description: "The two equal-width action buttons." },
    { name: "onPrimaryAction / onSecondaryAction / onClose", type: "() => void", description: "Button and close-button callbacks." },
    { name: "open / onDismiss", type: "boolean / () => void", defaultValue: "true", description: "Not Figma-confirmed — functional mount/dismiss control (Escape key, backdrop click)." },
    { name: "usePortal", type: "boolean", defaultValue: "true", description: "Renders into document.body via a portal." },
    { name: "inline", type: "boolean", defaultValue: "false", description: "Documentation/style-guide affordance — renders just the dialog card with no fixed backdrop or portal." },
  ],
  preview: () => (
    <Modal
      inline
      type="default"
      title="Action heading"
      description="Are you sure you want to proceed with this action?"
      secondaryActionContent="Cancel"
      primaryActionContent="Yes, continue"
      featureIconContent={lightning}
    />
  ),
  playground: {
    controls: [
      {
        prop: "type",
        label: "Type",
        defaultValue: "default",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <Modal
        inline
        type={v.type as ModalType}
        title="Action heading"
        description="Are you sure you want to proceed with this action?"
        secondaryActionContent="Cancel"
        primaryActionContent="Yes, continue"
        featureIconContent={lightning}
      />
    ),
  },
  showcases: [
    {
      title: "Both confirmed types, side by side",
      description: "Genuinely different compositions — default has a bordered header; confirmation merges title/description into one block.",
      render: () => (
        <>
          <Modal
            inline
            type="default"
            title="Action heading"
            description="Are you sure you want to proceed with this action?"
            secondaryActionContent="Cancel"
            primaryActionContent="Yes, continue"
            featureIconContent={lightning}
          />
          <Modal
            inline
            type="confirmation"
            title="Action heading"
            description="Are you sure you want to proceed with this action?"
            secondaryActionContent="Cancel"
            primaryActionContent="Yes, continue"
            featureIconContent={lightning}
          />
        </>
      ),
    },
    {
      title: "Without the feature icon",
      description: "modalIcon defaults to true; shown here turned off.",
      render: () => (
        <Modal
          inline
          modalIcon={false}
          title="Action heading"
          description="Are you sure you want to proceed with this action?"
          secondaryActionContent="Cancel"
          primaryActionContent="Yes, continue"
        />
      ),
    },
  ],
};
