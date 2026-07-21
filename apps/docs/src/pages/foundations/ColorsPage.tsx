import { color, focusRingColor } from "@shikho/tokens";
import { PageHeader, Section, TokenChip } from "../../ui/primitives";

const RAMP_SOURCES: Record<string, string> = {
  primary: "Color/primary",
  secondary: "Color/Secondary",
  shikhoAi: "Color/Shikho AI",
  secondary2: "Color/secondary_2",
  info: "Color/info",
  success: "Color/success",
  danger: "Color/danger",
  warning: "Color/warning",
  gray: "Color/gray",
  vanillaGray: "Color/vanilla_gray",
  dark: "Color/dark",
  black: "Color/black (opacity ramp)",
  white: "Color/white (opacity ramp)",
};

export function ColorsPage() {
  const ramps = Object.entries(color) as [keyof typeof color, Record<string, string>][];

  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Foundations"
        title="Colors"
        lede="Eleven-step brand, functional and neutral ramps, plus two twelve-step opacity ramps. Every hex is quoted verbatim from the colour audit — none were interpolated."
      />

      <Section
        title="Focus rings"
        description="Five ring colours sharing one confirmed geometry. focus.danger is corrected here: Figma binds it to the Secondary brand colour, a confirmed bug reproduced in three independent audits."
      >
        <div className="sk-swatch-grid">
          {Object.entries(focusRingColor).map(([name, value]) => (
            <div className="sk-swatch" key={name}>
              <div
                className="sk-swatch__chip"
                style={{ background: value, boxShadow: "inset 0 0 0 1px var(--sk-border)" }}
              />
              <div className="sk-swatch__meta">
                <div className="sk-swatch__step">{name}</div>
                <div className="sk-swatch__hex">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Ramps">
        {ramps.map(([name, steps]) => (
          <div className="sk-ramp" key={name}>
            <h3 className="sk-ramp__name">
              {name}
              <span className="sk-ramp__source">{RAMP_SOURCES[name] ?? name}</span>
            </h3>
            <div className="sk-swatch-grid">
              {Object.entries(steps).map(([step, hex]) => (
                <div className="sk-swatch" key={step}>
                  <div
                    className="sk-swatch__chip"
                    style={{ background: hex, boxShadow: "inset 0 0 0 1px var(--sk-border)" }}
                  />
                  <div className="sk-swatch__meta">
                    <div className="sk-swatch__step">{step}</div>
                    <div className="sk-swatch__hex">{hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Usage">
        <div className="sk-chiprow">
          <TokenChip>{`import { color } from "@shikho/tokens";`}</TokenChip>
          <TokenChip>{`color.primary[500]`}</TokenChip>
          <TokenChip>{`color.danger[600]`}</TokenChip>
          <TokenChip>{`focusRingColor.danger`}</TokenChip>
        </div>
      </Section>

      <Section title="Known limitations">
        <div className="sk-notes">
          <p className="sk-notes__title">Not exported, deliberately</p>
          <ul>
            <li>
              Gradients — <span className="sk-inline-code">Gradient/G1</span>–
              <span className="sk-inline-code">G6</span> exist by name but never resolved to stop
              colours, positions or angles in any of the 27 audits.
            </li>
            <li>
              Subject colours — only 5 of roughly 35 resolved. The remaining ~30 are not even named
              in the audit, so no keys could be stubbed without guessing.
            </li>
            <li>
              The black and white ramps keep Figma&apos;s original step numbers (50–950). Renaming
              them to percentage-based keys is an approved but deferred decision.
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
