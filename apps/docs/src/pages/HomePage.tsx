import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Chip, Field, NewBlueButton, Toggle } from "@shikho/ui";
import { componentRegistry } from "../registry";
import { ShikhoLogo } from "../ui/ShikhoLogo";

/**
 * Compact, hero-only landing page for the Shikho Design System.
 *
 * Every preview below renders a *real* component from `@shikho/ui` — nothing is a screenshot and
 * nothing restyles the components. The surrounding card/hero chrome is docs-only styling, themed
 * from `@shikho/tokens` through the `--sk-*` custom properties defined in `theme.ts` / `styles.css`.
 */
export function HomePage() {
  const navigate = useNavigate();
  const componentCount = componentRegistry.length;

  return (
    <div className="lp">
      <div className="lp__grid" aria-hidden />
      <div className="lp__glow lp__glow--a" aria-hidden />
      <div className="lp__glow lp__glow--b" aria-hidden />

      <div className="lp__inner">
        <div className="lp__logo lp-fade" style={{ ["--lp-delay" as string]: "0ms" }}>
          <ShikhoLogo height={56} />
        </div>
        <p className="lp__eyebrow lp-fade" style={{ ["--lp-delay" as string]: "80ms" }}>
          Shikho Design System
        </p>

        <h1 className="lp__title lp-fade" style={{ ["--lp-delay" as string]: "160ms" }}>
          Build consistent products, <span className="lp__title-accent">faster.</span>
        </h1>

        <p className="lp__lede lp-fade" style={{ ["--lp-delay" as string]: "240ms" }}>
          Reusable React components, shared design tokens, and living documentation — one source of
          truth for every Shikho product, so teams ship coherent interfaces without rebuilding the
          basics.
        </p>

        <div className="lp__ctas lp-fade" style={{ ["--lp-delay" as string]: "320ms" }}>
          <NewBlueButton size="lg" type="Primary" onClick={() => navigate("/components")}>
            Browse components
          </NewBlueButton>
          <NewBlueButton size="lg" type="Outline" onClick={() => navigate("/foundations/colors")}>
            Read documentation
          </NewBlueButton>
        </div>

        <p className="lp__tech lp-fade" style={{ ["--lp-delay" as string]: "400ms" }}>
          <span className="lp__tech-pkg">@shikho/ui</span>
          <span className="lp__tech-dot" aria-hidden>
            ·
          </span>
          React
          <span className="lp__tech-dot" aria-hidden>
            ·
          </span>
          TypeScript
          <span className="lp__tech-dot" aria-hidden>
            ·
          </span>
          {componentCount} components
        </p>

        <div className="lp__cards">
          <PreviewCard label="Buttons" lift delay={480}>
            <div className="lp-stack">
              <NewBlueButton size="md" type="Primary">
                Get started
              </NewBlueButton>
              <NewBlueButton size="md" type="Outline">
                Learn more
              </NewBlueButton>
            </div>
          </PreviewCard>

          <PreviewCard label="Input" delay={550}>
            <div className="lp-field">
              <span className="lp-field__label">Work email</span>
              <Field
                textContent="jane@shikho.com"
                leftGroup={false}
                rightGroup={false}
                supportText={false}
                style={{ width: "100%" }}
              />
            </div>
          </PreviewCard>

          <PreviewCard label="Selection" lift delay={620}>
            <SelectionPreview />
          </PreviewCard>

          <PreviewCard label="Chips" delay={690}>
            <div className="lp-chiprow">
              <Chip size="md" type="selected">
                Components
              </Chip>
              <Chip size="md" type="unselected">
                Tokens
              </Chip>
              <Chip size="md" type="Green">
                Stable
              </Chip>
            </div>
          </PreviewCard>
        </div>
      </div>
    </div>
  );
}

function PreviewCard({
  label,
  lift = false,
  delay = 0,
  children,
}: {
  label: string;
  lift?: boolean;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={"lp-card lp-fade" + (lift ? " lp-card--lift" : "")}
      style={{ ["--lp-delay" as string]: `${delay}ms` }}
    >
      <span className="lp-card__label">{label}</span>
      <div className="lp-card__body">{children}</div>
    </div>
  );
}

/** Interactive so the hero feels alive; defaults are a composed on/off mix. */
function SelectionPreview() {
  const [digest, setDigest] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="lp-rows">
      <label className="lp-row">
        <Checkbox
          size="sm"
          checked={digest}
          onChange={(e) => setDigest(e.target.checked)}
          aria-label="Weekly digest"
        />
        <span>Weekly digest</span>
      </label>
      <label className="lp-row">
        <Checkbox
          size="sm"
          checked={updates}
          onChange={(e) => setUpdates(e.target.checked)}
          aria-label="Product updates"
        />
        <span>Product updates</span>
      </label>
      <label className="lp-row">
        <Toggle
          size="sm"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          aria-label="Notifications"
        />
        <span>Notifications</span>
      </label>
    </div>
  );
}
