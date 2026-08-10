import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  Chip,
  Field,
  InputHint,
  InputLabel,
  NewBlueButton,
  Toggle,
} from "@shikho/ui";
import { CheckIcon, ChevronRightIcon } from "@shikho/icons";
import { componentRegistry } from "../registry";
import {
  ComponentsMark,
  FoundationsMark,
  PatternsMark,
  PlaygroundMark,
  ReactMark,
  TypeScriptMark,
} from "../ui/DocsIcons";

/**
 * Landing page for the Shikho Design System.
 *
 * Every element inside a preview card is a *real* `@shikho/ui` component rendered with its own
 * props — nothing is a screenshot, a mock, or a restyled copy. The surrounding chrome (hero grid,
 * cards, discovery row) is page-level docs styling only, themed through the `--sk-*` custom
 * properties in `theme.ts`, which are themselves derived from `@shikho/tokens`.
 */
export function HomePage() {
  const navigate = useNavigate();
  const componentCount = componentRegistry.length;

  return (
    <div className="lp">
      <div className="lp__inner">
        <div className="lp__hero">
          <HeroCopy componentCount={componentCount} onNavigate={navigate} />
          <Showcase />
        </div>

        <DiscoveryRow onNavigate={navigate} />

        {/* The reference footer also carries an "MIT License" item. It is deliberately omitted:
            the packages have no license field yet and the choice is still an open organizational
            decision, so stating one here would be inventing a legal claim the repo doesn't make. */}
        <footer className="lp-footer lp-fade" style={{ ["--lp-delay" as string]: "600ms" }}>
          <span>
            Made with <span className="lp-footer__heart">♥</span> by the Shikho UI team
          </span>
          <span className="lp-footer__meta">
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              @shikho/ui
            </a>
            <span aria-hidden>·</span>
            React
            <span aria-hidden>·</span>
            TypeScript
          </span>
        </footer>
      </div>
    </div>
  );
}

const REPO_URL = "https://github.com/Uchashkhan/shikho-design-system";

/* ------------------------------------------------------------------ hero (left column) */

function HeroCopy({
  componentCount,
  onNavigate,
}: {
  componentCount: number;
  onNavigate: (to: string) => void;
}) {
  return (
    <div className="lp__copy">
      <div className="lp__badges lp-fade" style={{ ["--lp-delay" as string]: "0ms" }}>
        <span className="lp__badge">Shikho Design System</span>
        <span className="lp__badge lp__badge--version">
          v0.1
          <span className="lp__badge-dot" aria-hidden />
        </span>
      </div>

      <h1 className="lp__title lp-fade" style={{ ["--lp-delay" as string]: "80ms" }}>
        Build consistent products,{" "}
        <span className="lp__title-accent">faster.</span>
      </h1>

      <p className="lp__lede lp-fade" style={{ ["--lp-delay" as string]: "160ms" }}>
        Reusable React components, shared design tokens, and living documentation — one source of
        truth for every Shikho product, so teams ship coherent interfaces without rebuilding the
        basics.
      </p>

      <div className="lp__ctas lp-fade" style={{ ["--lp-delay" as string]: "240ms" }}>
        <NewBlueButton
          size="lg"
          type="Primary"
          onClick={() => onNavigate("/components")}
          rightIcon
          selectRightIcon={<ChevronRightIcon size={16} />}
        >
          Browse components
        </NewBlueButton>
        <NewBlueButton
          size="lg"
          type="Outline"
          onClick={() => onNavigate("/foundations/colors")}
        >
          Read documentation
        </NewBlueButton>
      </div>

      <ul className="lp__meta lp-fade" style={{ ["--lp-delay" as string]: "320ms" }}>
        <li>
          <ComponentsMark size={13} />
          {componentCount} components
        </li>
        <li>
          <ReactMark size={13} />
          React
        </li>
        <li>
          <TypeScriptMark size={13} />
          TypeScript
        </li>
        <li>
          <CheckIcon size={14} />
          Actively maintained
        </li>
      </ul>
    </div>
  );
}

/* -------------------------------------------------- hero (right column) — real components */

function Showcase() {
  return (
    <div className="lp__showcase" aria-label="Live component previews">
      <PreviewCard label="Button" delay={200}>
        <div className="lp-stack">
          <NewBlueButton size="md" type="Primary">
            Primary
          </NewBlueButton>
          <NewBlueButton size="md" type="Secondary">
            Secondary
          </NewBlueButton>
          <NewBlueButton size="md" type="Outline">
            Outline
          </NewBlueButton>
          <NewBlueButton size="md" type="Text">
            Text
          </NewBlueButton>
        </div>
      </PreviewCard>

      <PreviewCard label="Input" lift delay={280}>
        <div className="lp-field">
          <InputLabel size="md">Work email</InputLabel>
          <Field
            size="md"
            textContent="jane@shikho.com"
            leftGroup={false}
            rightGroup={false}
            supportText={false}
            style={{ width: "100%" }}
          />
          <InputHint
            size="md"
            leftIcon={false}
            supportText={false}
            hintTextContent="We'll never share your email with anyone else."
          />
        </div>
      </PreviewCard>

      <PreviewCard label="Selection" delay={360}>
        <SelectionPreview />
      </PreviewCard>

      <PreviewCard label="Chips" lift delay={440}>
        {/* `Chip` renders its label through `textContent` — passing children is silently dropped.
            Its `leftIcon`/`rightIcon` slots also default to true and reserve ~14px each even when
            empty, so they're switched off for these text-only chips. */}
        <div className="lp-chiprow">
          <Chip size="sm" type="selected" leftIcon={false} rightIcon={false} textContent="Class 10" />
          <Chip size="sm" type="unselected" leftIcon={false} rightIcon={false} textContent="Science" />
          <Chip size="sm" type="Green" leftIcon={false} rightIcon={false} textContent="Premium" />
        </div>
      </PreviewCard>
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
  children: ReactNode;
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

/** Interactive so the hero feels alive — real Checkbox and Toggle components, not mock rows. */
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

/* ------------------------------------------------------------------- discovery row */

const DISCOVERY = [
  {
    tone: "brand",
    icon: <ComponentsMark />,
    title: "Components",
    description: "Production-ready React components built for Shikho products.",
    action: "Explore components",
    to: "/components",
  },
  {
    tone: "violet",
    icon: <FoundationsMark />,
    title: "Foundations",
    description: "Design tokens for color, typography, spacing, radius and more.",
    action: "View foundations",
    to: "/foundations/colors",
  },
  {
    tone: "success",
    icon: <PatternsMark />,
    title: "Patterns",
    description: "Common UI patterns and layouts for real product scenarios.",
    action: "Browse patterns",
    to: "/patterns",
  },
  {
    tone: "pink",
    icon: <PlaygroundMark />,
    title: "Playground",
    description: "Test components, tweak props, and copy code instantly.",
    action: "Open playground",
    to: "/playground",
  },
] as const;

function DiscoveryRow({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <div className="lp-discovery lp-fade" style={{ ["--lp-delay" as string]: "520ms" }}>
      {DISCOVERY.map((item) => (
        <button
          key={item.title}
          type="button"
          className="lp-disc"
          onClick={() => onNavigate(item.to)}
        >
          <span className={`lp-disc__icon lp-disc__icon--${item.tone}`} aria-hidden>
            {item.icon}
          </span>
          <span className="lp-disc__title">{item.title}</span>
          <span className="lp-disc__desc">{item.description}</span>
          <span className={`lp-disc__action lp-disc__action--${item.tone}`}>
            {item.action}
            <ChevronRightIcon size={14} />
          </span>
        </button>
      ))}
    </div>
  );
}
