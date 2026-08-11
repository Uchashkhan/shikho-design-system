import { useState } from "react";
import { color, focusRingColor, subjectColor } from "@shikho/tokens";
import { CheckIcon } from "@shikho/icons";
import { PageHeader, Section, TokenChip } from "../../ui/primitives";
import { CopyMark } from "../../ui/DocsIcons";

/**
 * A color swatch that copies its own hex on click. The chip itself is the button — a bigger,
 * more forgiving click target than the small copy icon alone — with the icon as a visual hint
 * that it's interactive, swapping to a checkmark for a moment once the copy succeeds.
 */
function Swatch({ label, hex }: { label: string; hex: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="sk-swatch">
      <button
        type="button"
        className="sk-swatch__chip"
        style={{ background: hex, boxShadow: "inset 0 0 0 1px var(--sk-border)" }}
        onClick={copy}
        aria-label={`Copy ${hex}`}
      >
        <span className="sk-swatch__copy" aria-hidden>
          {copied ? <CheckIcon size={14} /> : <CopyMark size={13} />}
        </span>
      </button>
      <div className="sk-swatch__meta">
        <div className="sk-swatch__step">{label}</div>
        <div className="sk-swatch__hex">{copied ? "Copied!" : hex}</div>
      </div>
    </div>
  );
}

/** `subjectColor` keys are camelCase (a code-normalization concern); these are the verbatim
    Figma subject names for display, in the same order docs/audit/colors.md lists them. */
const SUBJECT_LABELS: Record<string, string> = {
  bengali: "Bengali",
  english: "English",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  generalMath: "General Math",
  higherMath: "Higher Math",
  generalScience: "General Science",
  ict: "ICT",
  geography: "Geography",
  businessStudies: "Business Studies",
  finance: "Finance",
  economics: "Economics",
  history: "History",
  accounting: "Accounting",
  statistics: "Statistics",
  islamAndNoitik: "Islam & Noitik…",
  marketing: "Marketing (বিপণন)",
  civics: "Civics (পৌরনীতি)",
  logic: "Logic (যুক্তি বিদ্যা)",
  businessOrgAndManagement: "Business Org. & Management",
  productionManagementAndMarketing: "Production Management & Marketing",
  businessMath: "Business Math",
  agriculture: "Agriculture",
  sociology: "Sociology",
  socialWork: "Social Work",
  psychology: "Psychology",
  bangladeshAndGlobalStudies: "Bangladesh & Global Studies",
  generalKnowledge: "General Knowledge",
  spokenEnglish: "Spoken English",
  practicalAi: "Practical AI",
  quarterFinalExam: "Quarter Final Exam",
};

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
            <Swatch key={name} label={name} hex={value} />
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
                <Swatch key={step} label={step} hex={hex} />
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section
        title="Subject colors"
        description="All 32 subjects named in the audited layer tree, each with a Main/Dark/Light triad. Up to ~3 more subjects may exist with no name captured anywhere — see Known limitations below."
      >
        {Object.entries(subjectColor).map(([key, triad]) => (
          <div className="sk-ramp" key={key}>
            <h3 className="sk-ramp__name">
              {SUBJECT_LABELS[key] ?? key}
              <span className="sk-ramp__source">{`Subject Colors/${SUBJECT_LABELS[key] ?? key}`}</span>
            </h3>
            <div className="sk-swatch-grid">
              {(["main", "dark", "light"] as const).map((step) => (
                <Swatch key={step} label={step} hex={triad[step]} />
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
          <TokenChip>{`subjectColor.generalKnowledge.main`}</TokenChip>
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
              Subject colours — all 32 subjects named anywhere in the audited layer tree are
              shown above. Up to ~3 more may exist with no name captured in any pass so far, so
              they are not stubbed here without a confirmed value.
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
