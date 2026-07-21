import { elevation } from "@shikho/tokens";
import { CodeBlock, PageHeader, Section } from "../../ui/primitives";

const RESOLVED_VIA: Record<string, string> = {
  e1: "Resolved via the Table audit — the last of the six, completing the set.",
  e2: "Resolved directly in the Elevations audit.",
  e3: "Resolved via the Tooltips audit; confirmed applied to Alert's corner button.",
  e4: "Resolved via the Date Picker audit. Breaks the additive-stacking pattern.",
  e5: "Resolved via the Button Group audit; confirmed as Alert's root shadow.",
  e6: "Resolved directly in the Elevations audit; confirmed as Toast's root shadow.",
};

const toCss = (layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]) =>
  layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");

export function ElevationPage() {
  const levels = Object.entries(elevation) as [
    keyof typeof elevation,
    (typeof elevation)["e1"],
  ][];

  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Foundations"
        title="Elevation"
        lede="Six levels, all fully resolved — each one from a different component's audit. Every layer uses the same 3.9%-black shadow colour with a purely vertical offset; depth comes from offset, blur and spread alone."
      />

      <Section
        title="Levels"
        description="Layer count matches the level number in every confirmed case."
      >
        {levels.map(([name, layers]) => (
          <div className="sk-specimen-row" key={name}>
            <div
              className="sk-specimen-row__demo sk-specimen-row__demo--elevation"
              style={{ background: "var(--sk-surface)", boxShadow: toCss(layers) }}
            />
            <div className="sk-specimen-row__info">
              <div className="sk-specimen-row__name">
                elevation.{name} · {layers.length} layer{layers.length === 1 ? "" : "s"}
              </div>
              <div className="sk-specimen-row__detail">{RESOLVED_VIA[name]}</div>
              <div className="sk-specimen-row__detail" style={{ fontSize: 11.5, opacity: 0.8 }}>
                offsets {layers.map((l) => l.y).join(" / ")}
              </div>
            </div>
          </div>
        ))}
      </Section>

      <Section
        title="The additive-stacking pattern"
        description="Mostly holds, with one confirmed exception."
      >
        <div className="sk-notes">
          <p className="sk-notes__title">One level breaks the rule</p>
          <ul>
            <li>
              Each higher level generally retains the layers below it and adds a larger, more
              diffuse one on top — e6&apos;s final two layers are exactly e2&apos;s complete stack.
            </li>
            <li>
              <span className="sk-inline-code">elevation.e4</span> breaks this: it introduces new
              32 and 6 offsets while dropping e3&apos;s distinctive 24 entirely. Shipped as the real
              confirmed value rather than &ldquo;fixed&rdquo; to fit the pattern.
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { elevation } from "@shikho/tokens";

// Levels are structured shadow-layer data, not pre-baked CSS strings —
// so they can target CSS, React Native, or anything else.
const boxShadow = elevation.e2
  .map((l) => \`\${l.x}px \${l.y}px \${l.blur}px \${l.spread}px \${l.color}\`)
  .join(", ");`}
        />
      </Section>
    </div>
  );
}
