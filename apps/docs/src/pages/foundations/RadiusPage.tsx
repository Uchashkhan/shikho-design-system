import { radius, radiusLegacyAliases } from "@shikho/tokens";
import { CodeBlock, PageHeader, PropsTable, Section } from "../../ui/primitives";

const SOURCE_NOTES: Record<string, string> = {
  none: "radius/border_radius_0",
  xs: "radius/custom/xs and radius/border_radius_xs — both agree",
  sm: "radius/custom/sm and radius/border_radius_sm — both agree",
  md: "radius/custom/md — collides with border_radius_sm_2",
  lg: "radius/custom/lg — collides with border_radius_md",
  xl: "radius/custom/xl and radius/border_radius_lg — both agree on 16",
  "2xl": "radius/border_radius_xl",
  "3xl": "radius/border_radius_xxl",
  "4xl": "radius/border_radius_2xl",
  "5xl": "radius/border_radius_4xl",
  "6xl": "radius/border_radius_5xl",
  "7xl": "radius/border_radius_6xl",
  "8xl": "radius/border_radius_7xl",
  "9xl": "radius/border_radius_8xl",
  "10xl": "radius/border_radius_9xl",
  track: "radius/border_radius_100 — application unconfirmed",
  full: "radius/border_radius_round",
};

export function RadiusPage() {
  const steps = Object.entries(radius) as [keyof typeof radius, number][];

  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Foundations"
        title="Radius"
        lede="Figma carries two parallel radius systems that disagree on what md, lg and xl mean. Canonical names here are assigned by the ascending rank of the confirmed numeric value, so a name always maps to exactly one number."
      />

      <Section
        title="The collision, and how it was resolved"
        description="This was the audit's highest-priority naming defect."
      >
        <div className="sk-notes">
          <p className="sk-notes__title">Two systems, same labels, different numbers</p>
          <ul>
            <li>
              <span className="sk-inline-code">radius/custom/md</span> is 10, but{" "}
              <span className="sk-inline-code">radius/border_radius_md</span> is 12.
            </li>
            <li>
              <span className="sk-inline-code">radius/border_radius_sm</span> is 8, but{" "}
              <span className="sk-inline-code">radius/border_radius_sm_2</span> is 10.
            </li>
            <li>
              Resolution: rank by value across both systems combined. Canonical{" "}
              <span className="sk-inline-code">radius.lg</span> is 12, sourced from{" "}
              <span className="sk-inline-code">radius/custom/lg</span> — not from{" "}
              <span className="sk-inline-code">radius/border_radius_lg</span>, which is 16 and
              becomes <span className="sk-inline-code">radius.xl</span>.
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Scale">
        {steps.map(([name, value]) => (
          <div className="sk-specimen-row" key={name}>
            <div
              className="sk-specimen-row__demo"
              style={{ borderRadius: Math.min(value, 28), background: "var(--sk-brand-soft)" }}
            />
            <div className="sk-specimen-row__info">
              <div className="sk-specimen-row__name">
                radius.{name.includes("x") && name !== "xs" ? `["${name}"]` : name} = {value}
              </div>
              <div className="sk-specimen-row__detail">{SOURCE_NOTES[name] ?? "—"}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section
        title="Deprecated aliases"
        description="Kept only where the audit confirmed an exact value collision between the two legacy systems. Do not use these in new code."
      >
        <PropsTable
          rows={Object.entries(radiusLegacyAliases).map(([name, value]) => ({
            name: `radiusLegacyAliases.${name}`,
            type: String(value),
            description: `Deprecated — use radius.${
              value === radius.md ? "md" : value === radius.lg ? "lg" : "xl"
            } instead.`,
          }))}
        />
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { radius } from "@shikho/tokens";

const card = {
  borderRadius: radius.lg,      // 12
  // multi-word steps need bracket access
  outerRadius: radius["2xl"],   // 20
};`}
        />
      </Section>
    </div>
  );
}
