import { Toast, type ToastState } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const STATES: ToastState[] = ["default", "danger", "success", "warning", "info"];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "Deep-audited across all 5 severities and explicitly compared node-by-node against Alert's own deep audit. Toast and Alert share the same severity architecture, but a fresh re-audit found the action button's construction is a genuine three-way split by severity: danger/success compose ButtonDanger/ButtonSuccess with a TINTED background (confirmed different from Alert's flat neutral background), warning/info render a plain neutral gray button, and default gets its own distinct secondary/500-filled button. Both icon slots (the left severity icon and the inline dismiss 'X') now render real default glyphs by default — downloaded directly from Figma's own SVG source, and confirmed byte-identical in shape to Alert's own icons, though toast tints its default-state icon gray-950 rather than Alert's primary-tinted Default.",
  variants: [
    {
      name: "state",
      values: STATES,
      note: "Same severity/theme axis as Alert. The baseline value here is lowercase default, whereas Alert's equivalent is capitalized Default — a confirmed cross-component casing inconsistency.",
    },
  ],
  states: [],
  gaps: [
    "Only danger and success compose a severity-tinted Button family member (ButtonDanger/ButtonSuccess) with a TINTED background — confirmed different from Alert's equivalent, which tints only the text. warning/info are neutral gray; default is its own secondary/500-filled button.",
    "The root-level gap between icon/feature-icon/alert_cell/dismiss-button isn't explicitly restated for Toast — this reuses Alert's confirmed 16px root gap as the least-invented available baseline, documented as unconfirmed for Toast specifically.",
    "Whether the shorter, unqualified \"button_danger\" instance name here (vs. Alert's fully path-qualified one) reflects a meaningful binding difference is explicitly unconfirmed, though the fill/text values are now confirmed for both danger and success.",
    "secondary_button_effect (2 of 4 layers confirmed applied to the action button) is not implemented — the same gap ButtonDanger itself already has.",
    "The feature_icon slot's real glyph is confirmed to be a plain filled circle with no distinguishing shape in the audited instance — generic placeholder content, not implemented as a default.",
    "autoDismiss/duration are requested additions with no Figma source — no timer/progress affordance exists anywhere in the audited component set. Manual dismiss cancels the pending timer immediately (spec); the progress bar animates via a CSS transition rather than @keyframes, keeping this component's existing inline-styles-only architecture.",
    "Requested override: state=\"default\"'s action button uses primary/500 (was the confirmed secondary/500 pink) — \"instead of the current accent/pink treatment.\" warning/info's neutral button and danger/success's tinted ButtonDanger/ButtonSuccess composition are unchanged; only default's color was named in the request.",
    "Requested: the leading severity icon is a bit bigger — slot 24px→28px, glyph 18px→22px, consistent across all 5 states.",
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
    { name: "leftIcon", type: "boolean", defaultValue: "true", description: "Confirmed boolean for the leading icon slot — rendered a bit bigger than confirmed (28×28 slot, 22px glyph) per request, consistent across all states." },
    { name: "featureIcon / featureIconContent", type: "boolean / ReactNode", defaultValue: "false", description: "A 28×28 slot with no equivalent in Alert — the only boolean across Alert/Toast that defaults off." },
    { name: "titleContent", type: "ReactNode", description: "15px/24px SemiBold, identical to Alert's." },
    { name: "desc / descriptionContent", type: "boolean / ReactNode", defaultValue: "true", description: "13px/20px Regular, Text/Gray 600 — confirmed different from Alert's Gray 700." },
    { name: "actionButton / actionContent / onActionClick", type: "boolean / ReactNode / () => void", defaultValue: "true", description: "danger/success compose ButtonDanger/ButtonSuccess with a tinted background; warning/info are neutral; default is primary/500-filled (requested override — Figma's own confirmed value is secondary/500 pink)." },
    { name: "rightIcon / dismissIcon / onDismissClick / dismissButtonLabel", type: "boolean / ReactNode / () => void / string", defaultValue: "true / … / … / \"Dismiss\"", description: "Inline rounded-square dismiss button — confirmed not absolutely positioned, unlike Alert's corner button. Renders a confirmed default 'X' icon unless overridden." },
    { name: "autoDismiss / duration", type: "boolean / number", defaultValue: "false / 5000", description: "Requested addition. A full-width progress bar drains over duration ms, then calls onDismissClick — the same callback the manual dismiss button uses. Toast never removes itself; the consumer still owns whether/how it leaves the DOM." },
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
        prop: "supportingText",
        label: "Supporting text",
        defaultValue: "shown",
        options: [
          { label: "shown", value: "shown" },
          { label: "hidden", value: "hidden" },
        ],
      },
      {
        prop: "button",
        label: "Button",
        defaultValue: "single",
        options: [
          { label: "none", value: "none" },
          { label: "single", value: "single" },
        ],
      },
      {
        prop: "autoDismiss",
        label: "Auto dismiss",
        defaultValue: "off",
        options: [
          { label: "on", value: "on" },
          { label: "off", value: "off" },
        ],
      },
    ],
    render: (v) => (
      <Toast
        // key remounts the Toast (and so restarts its internal timer) whenever Auto Dismiss is
        // toggled back on after having already completed once, matching a real toast reappearing.
        key={v.autoDismiss}
        state={v.state as ToastState}
        leftIcon={v.icon === "shown"}
        titleContent="Notification text"
        desc={v.supportingText === "shown"}
        descriptionContent="Supporting description goes here."
        actionButton={v.button === "single"}
        actionContent="Learn more"
        autoDismiss={v.autoDismiss === "on"}
        duration={4000}
      />
    ),
  },
  showcases: [
    {
      title: "All five severities",
      description: "Every severity is now deep-audited: danger/success get a tinted-background button, warning/info stay neutral, and default gets its own primary/500 button (requested override — was secondary/500 pink).",
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
      title: "Auto dismiss — a requested addition, not part of the original Figma audit",
      description: "A full-width progress bar drains over duration ms, then fires onDismissClick automatically — the same callback the manual dismiss button uses.",
      render: () => (
        <Toast
          state="info"
          titleContent="Auto-dismissing in 6s"
          descriptionContent="Watch the bar at the bottom drain."
          actionButton={false}
          autoDismiss
          duration={6000}
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
