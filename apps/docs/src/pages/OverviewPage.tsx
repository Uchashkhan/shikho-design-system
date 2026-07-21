import { Link } from "react-router-dom";
import { color, elevation, radius } from "@shikho/tokens";
import { componentRegistry, foundationRegistry } from "../registry";
import { PageHeader, Section } from "../ui/primitives";

const colorRampCount = Object.keys(color).length;
const radiusStepCount = Object.keys(radius).length;
const elevationLevelCount = Object.keys(elevation).length;

export function OverviewPage() {
  const deepAudited = componentRegistry.filter((c) => c.confidence === "deep-audited").length;

  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Shikho Design System"
        title="A design system built strictly from what the audit confirmed"
        lede="Every token value and component variant here traces back to a specific line in the Figma audit. Where the audit could not confirm something, it is documented as a gap rather than approximated — so you always know which parts are ground truth and which are still open."
      />

      <Section title="At a glance">
        <div className="sk-meta-grid">
          <div className="sk-meta-card">
            <div className="sk-meta-card__label">Components</div>
            <div className="sk-meta-card__value">{componentRegistry.length}</div>
            <p className="sk-meta-card__hint">{deepAudited} backed by a deep audit</p>
          </div>
          <div className="sk-meta-card">
            <div className="sk-meta-card__label">Colour ramps</div>
            <div className="sk-meta-card__value">{colorRampCount}</div>
            <p className="sk-meta-card__hint">All values quoted verbatim</p>
          </div>
          <div className="sk-meta-card">
            <div className="sk-meta-card__label">Radius steps</div>
            <div className="sk-meta-card__value">{radiusStepCount}</div>
            <p className="sk-meta-card__hint">Rank-based, collisions resolved</p>
          </div>
          <div className="sk-meta-card">
            <div className="sk-meta-card__label">Elevation levels</div>
            <div className="sk-meta-card__value">{elevationLevelCount}</div>
            <p className="sk-meta-card__hint">Fully resolved, e1 through e6</p>
          </div>
        </div>
      </Section>

      <Section
        title="Packages"
        description="Three published packages, consumed by this site exactly as any other consumer would."
      >
        <div className="sk-linklist">
          <div className="sk-linkcard">
            <div className="sk-linkcard__title">@shikho/tokens</div>
            <p className="sk-linkcard__desc">
              Colour, radius and elevation. Typography, spacing, gradients and subject colours are
              deliberately not exported yet — their values were never confirmed.
            </p>
          </div>
          <div className="sk-linkcard">
            <div className="sk-linkcard__title">@shikho/ui</div>
            <p className="sk-linkcard__desc">
              React components built with tailwind-variants, consuming only confirmed tokens.
            </p>
          </div>
          <div className="sk-linkcard">
            <div className="sk-linkcard__title">@shikho/icons</div>
            <p className="sk-linkcard__desc">
              Scaffolded but intentionally empty — no icon inventory exists in the audit, so no
              glyphs were invented. Components accept icons as slots instead.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Foundations">
        <div className="sk-linklist">
          {foundationRegistry.map((foundation) => (
            <Link
              key={foundation.slug}
              to={`/foundations/${foundation.slug}`}
              className="sk-linkcard"
            >
              <div className="sk-linkcard__title">{foundation.name}</div>
              <p className="sk-linkcard__desc">{foundation.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="Components"
        description="Jump straight into any component, or browse the full library."
      >
        <div className="sk-linklist">
          {componentRegistry.map((entry) => (
            <Link key={entry.slug} to={`/components/${entry.slug}`} className="sk-linkcard">
              <div className="sk-linkcard__title">{entry.name}</div>
              <p className="sk-linkcard__desc">{entry.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="How to read this documentation"
        description="Two labels appear throughout, and they mean specific things."
      >
        <div className="sk-linklist">
          <div className="sk-linkcard">
            <div className="sk-linkcard__title">Deep-audited</div>
            <p className="sk-linkcard__desc">
              At least one instance was inspected with Figma's full design context, so its layout,
              spacing and colours are exact — not inferred from a name or a screenshot.
            </p>
          </div>
          <div className="sk-linkcard">
            <div className="sk-linkcard__title">Partly derived</div>
            <p className="sk-linkcard__desc">
              Variant names and structure are confirmed, but some visual values were derived from
              already-confirmed tokens because the audit never captured them. Each component's
              “Known limitations” section lists exactly which.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
