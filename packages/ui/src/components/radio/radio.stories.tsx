import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio, type RadioSize } from "./radio";

const sizes: RadioSize[] = ["md", "sm"];

const meta: Meta<typeof Radio> = {
  title: "Radio/radio",
  component: Radio,
  args: { size: "sm", "aria-label": "Radio" },
  argTypes: {
    size: { control: "select", options: sizes },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Radio {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

/**
 * A `Radio` wrapper that dispatches a real native `mouseenter`/`focus` event on mount so its
 * hover/focus column reflects the component's actual resolved visual (the real event handlers
 * really fire), rather than a CSS override recreated in the story — docs/audit/radio-buttons.md
 * §15 requires the state matrix below to visually match Figma's own side-by-side layout.
 */
function SimulatedState({
  simulate,
  ...props
}: React.ComponentProps<typeof Radio> & { simulate?: "hover" | "focus" }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (simulate === "hover") el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
    if (simulate === "focus") el.focus();
  }, [simulate]);

  return <Radio ref={ref} {...props} />;
}

function MatrixLabel({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{children}</span>;
}

/**
 * The confirmed 7-state matrix (docs/audit/radio-buttons.md §4, §15): `inactive`, `hover`,
 * `inactive_focused`, `active`, `active_focused`, `indeterminate`, `disabled` — visually matching
 * Figma's own side-by-side layout, not just demonstrating native click/tab behavior. `size` is
 * a separate confirmed axis (md/sm), shown as the two rows below, not an eighth state.
 */
export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>size={size}</span>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Radio size={size} aria-label={`${size} inactive`} />
              <MatrixLabel>inactive</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <SimulatedState size={size} simulate="hover" aria-label={`${size} hover`} />
              <MatrixLabel>hover</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <SimulatedState size={size} simulate="focus" aria-label={`${size} inactive_focused`} />
              <MatrixLabel>inactive_focused</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Radio size={size} checked readOnly aria-label={`${size} active`} />
              <MatrixLabel>active</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <SimulatedState size={size} checked readOnly simulate="focus" aria-label={`${size} active_focused`} />
              <MatrixLabel>active_focused</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Radio size={size} indeterminate aria-label={`${size} indeterminate`} />
              <MatrixLabel>indeterminate</MatrixLabel>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Radio size={size} disabled aria-label={`${size} disabled`} />
              <MatrixLabel>disabled</MatrixLabel>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

/** The two confirmed sizes (docs/audit/radio-buttons.md §4) — identical dimensions to Checkbox's md/sm. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {sizes.map((size) => (
        <Radio key={size} size={size} aria-label={size} />
      ))}
    </div>
  ),
};

/** The checked/unchecked axis (Figma's `active`/`inactive`), plus the confirmed indeterminate dash mark (§15). */
export const SelectedVsUnselected: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio name="selected-demo-a" aria-label="Unselected option" />
        Unselected (inactive)
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio name="selected-demo-b" defaultChecked aria-label="Selected option" />
        Selected (active)
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio indeterminate aria-label="Indeterminate option" />
        Indeterminate
      </label>
    </div>
  ),
};

/**
 * Keyboard-focus ring — confirmed to depend on checked state (docs/audit/radio-buttons.md §15):
 * `inactive_focused` rings gray/300 and darkens the border to gray/600; `active_focused` rings a
 * primary-alpha color instead. Tab to each radio below to compare (real focus, not simulated).
 */
export const FocusComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Radio aria-label="Unchecked, tab to focus" />
      <Radio checked readOnly aria-label="Checked, tab to focus" />
    </div>
  ),
};

/**
 * Confirmed `disabled` visual (docs/audit/radio-buttons.md §15) — a single flat gray/400 disc
 * with a gray/600 dash mark, shown identically regardless of the `checked`/`indeterminate` value
 * passed in (there is no separate confirmed disabled-checked variant in Figma).
 */
export const DisabledComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio disabled defaultChecked={false} aria-label="Disabled unchecked" />
        Disabled + unchecked
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio disabled defaultChecked aria-label="Disabled checked" />
        Disabled + checked
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Radio disabled indeterminate aria-label="Disabled indeterminate" />
        Disabled + indeterminate
      </label>
    </div>
  ),
};

/** Confirmed hover treatment (docs/audit/radio-buttons.md §15) — transparent fill, border swaps to primary/500. Hover the circle below. */
export const HoverState: Story = {
  render: () => <Radio aria-label="Hover me" />,
};

/** A real mutually-exclusive `name`-grouped set — grouping behavior only, not the source of the visuals above. */
export const MutuallyExclusiveGroup: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {["Monthly", "Yearly", "Lifetime"].map((label, i) => (
        <label key={label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Radio name="plan-group" defaultChecked={i === 0} aria-label={label} />
          {label}
        </label>
      ))}
    </div>
  ),
};
