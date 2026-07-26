// Cross-family comparison stories (docs/audit/buttons.md §14) — deliberately kept separate from
// each family's own stories file, since these compare *across* the 8 button components rather
// than exploring one family's own variant space. Every render below composes the real, shipped
// components — nothing here reproduces button styling by hand.
import type { Meta, StoryObj } from "@storybook/react";
import { AiRegularButton } from "./ai_regular";
import { AiRoundedButton } from "./ai_rounded";
import { ButtonDanger } from "./button_danger";
import { ButtonSuccess } from "./button_success";
import { GreyscaleButton } from "./greyscale";
import { IconButton } from "./icon_button";
import { NewBlueButton } from "./new_blue";
import { NewPinkButton } from "./new_pink";

const meta: Meta = {
  title: "Button/Comparisons",
};

export default meta;

type Story = StoryObj;

const dot = (
  <span style={{ display: "block", width: 8, height: 8, borderRadius: 9999, background: "currentColor" }} />
);

/**
 * All 8 families' `Primary`/`primary`-equivalent type at their own confirmed default state,
 * side by side. Confirms each family's own ramp/color mapping (docs/audit/buttons.md §14.2):
 * `new_blue`=primary, `new_pink`=secondary(pink), `button_success`=success, `button_danger`=
 * danger, `Greyscale`=black[900] (not gray[500]), `ai_rounded`/`ai_regular`=real gradients.
 */
export const FamilyComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <NewBlueButton>new_blue</NewBlueButton>
      <NewPinkButton>new_pink</NewPinkButton>
      <ButtonSuccess>button_success</ButtonSuccess>
      <ButtonDanger type="primary">button_danger</ButtonDanger>
      <GreyscaleButton>Greyscale</GreyscaleButton>
      <AiRoundedButton>ai_rounded</AiRoundedButton>
      <AiRegularButton>ai_regular</AiRegularButton>
      <IconButton aria-label="icon_button" icon={dot} />
    </div>
  ),
};

/**
 * Confirmed focus behavior (§14.2): every family's button-effect (border + shadow + inset) is
 * replaced entirely by a ring — 6 distinct confirmed ring colors across the 8 families, including
 * the corrected `focus.danger` (docs/token-normalization-decisions.md §10) — Figma's own binding
 * still incorrectly points at the secondary brand color; this does not reproduce that bug.
 */
export const FocusRingComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <NewBlueButton state="Focus">primary ring</NewBlueButton>
      <NewPinkButton state="Focus">secondary ring</NewPinkButton>
      <ButtonSuccess state="focus">success ring</ButtonSuccess>
      <ButtonDanger type="primary" state="focus">
        corrected danger ring
      </ButtonDanger>
      <GreyscaleButton state="focus">gray ring</GreyscaleButton>
      <IconButton type="primary" state="focus" aria-label="icon focus" icon={dot} />
    </div>
  ),
};
