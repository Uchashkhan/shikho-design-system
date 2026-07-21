import { Toast, type ToastState } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const STATES: ToastState[] = ["default", "danger", "success", "warning", "info"];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited at state=\"danger\" and explicitly compared node-by-node against Alert's own deep audit. Toast and Alert share the same severity architecture and even the same nested ButtonDanger dependency (\"doubly confirmed across both Alert and Toast\"), but the audit found real, confirmed structural differences between them at nearly every level: items-center instead of items-start, asymmetric padding instead of uniform, elevation/e6 instead of e5, a row-oriented alert_cell instead of column, an inline rounded-square dismiss button instead of an absolutely-positioned circular one, and a featureIcon slot Alert doesn't have at all. None of these are collapsed toward Alert's implementation.",
  variants: [
    {
      name: "state",
      values: STATES,
      note: "Same severity/theme axis as Alert. The baseline value here is lowercase default, whereas Alert's equivalent is capitalized Default — a confirmed cross-component casing inconsistency.",
    },
  ],
  states: [],
  gaps: [
    "Only state=\"danger\" has confirmed layout/color data — whether default/success/warning/info share this exact structure is out of scope in the audit, same situation as Alert.",
    "The root-level gap between icon/feature-icon/alert_cell/dismiss-button isn't explicitly restated for Toast — this reuses Alert's confirmed 16px root gap as the least-invented available baseline, documented as unconfirmed for Toast specifically.",
    "The nested button_danger instance is confirmed the same dependency as Alert's, but renders with a different fill (Color/danger/500_alpha_12 vs. Alert's Color/gray/100) — \"a confirmed, deliberate-looking but unexplained visual divergence\" the audit could not resolve further.",
    "Whether the shorter, unqualified \"button_danger\" instance name here (vs. Alert's fully path-qualified one) reflects a meaningful binding difference is explicitly unconfirmed. This implementation still composes ButtonDanger with type=\"Secondary\", applying only the confirmed fill override.",
    "secondary_button_effect (2 of 4 layers confirmed applied to the action button) is not implemented — the same gap ButtonDanger itself already has.",
    "No real icon or feature-icon glyph content exists yet — no @shikho/icons glyphs exist.",
  ],
  usageExample: `import { Toast } from "@shikho/ui";

function DangerToast() {
  return (
    <Toast
      state="danger"
      titleContent="Something went wrong"
      descriptionContent="Your changes could not be saved."
      actionContent="Retry"
      onActionClick={() => {}}
      onDismissClick={() => {}}
    />
  );
}`,
  props: [
    { name: "state", type: "default | danger | success | warning | info", defaultValue: "danger", description: "Severity/theme axis, same architecture as Alert." },
    { name: "leftIcon", type: "boolean", defaultValue: "true", description: "Confirmed boolean for the 24×24 leading icon slot." },
    { name: "featureIcon / featureIconContent", type: "boolean / ReactNode", defaultValue: "false", description: "A 28×28 slot with no equivalent in Alert — the only boolean across Alert/Toast that defaults off." },
    { name: "titleContent", type: "ReactNode", description: "15px/24px SemiBold, identical to Alert's." },
    { name: "desc / descriptionContent", type: "boolean / ReactNode", defaultValue: "true", description: "13px/20px Regular, Text/Gray 600 — confirmed different from Alert's Gray 700." },
    { name: "actionButton / actionContent / onActionClick", type: "boolean / ReactNode / () => void", defaultValue: "true", description: "Composes ButtonDanger with a confirmed different fill override from Alert's." },
    { name: "rightIcon / dismissIcon / onDismissClick / dismissButtonLabel", type: "boolean / ReactNode / () => void / string", defaultValue: "true / … / … / \"Dismiss\"", description: "Inline rounded-square dismiss button — confirmed not absolutely positioned, unlike Alert's corner button." },
  ],
  preview: () => (
    <Toast
      state="danger"
      titleContent="Notification text"
      descriptionContent="Supporting description goes here."
      actionContent="Learn more"
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
      <Toast
        state={v.state as ToastState}
        titleContent="Notification text"
        descriptionContent="Supporting description goes here."
        actionContent="Learn more"
      />
    ),
  },
  showcases: [
    {
      title: "All five severities",
      description: "Only danger is deep-audited; the shared white fill and e6 shadow apply uniformly across the rest.",
      layout: "stack",
      render: () => (
        <>
          {STATES.map((state) => (
            <div key={state} style={{ marginBottom: 16 }}>
              <Toast
                state={state}
                titleContent={state}
                descriptionContent="Supporting description goes here."
                actionContent="Learn more"
              />
            </div>
          ))}
        </>
      ),
    },
    {
      title: "featureIcon — a slot Alert doesn't have",
      description: "Defaults off; the only boolean across Alert/Toast that starts false.",
      render: () => (
        <Toast
          state="danger"
          featureIcon
          titleContent="With a feature icon"
          descriptionContent="A 28×28 slot with no equivalent in Alert."
          actionContent="Learn more"
        />
      ),
    },
    {
      title: "Structural differences from Alert",
      description: "items-center, asymmetric padding, a row-oriented alert_cell, and an inline (not absolutely-positioned) dismiss button.",
      render: () => (
        <Toast
          state="danger"
          titleContent="Confirmed different from Alert"
          descriptionContent="Same nested ButtonDanger dependency, different fill."
          actionContent="Learn more"
        />
      ),
    },
  ],
};
