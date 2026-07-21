import { Link, type LinkSize, type LinkState, type LinkType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const SIZES: LinkSize[] = ["xl", "lg", "md", "sm", "xs"];
const TYPES: LinkType[] = ["primary", "quaternary"];
const STATES: LinkState[] = ["default", "hover", "disabled"];

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original overview audit deliberately never ran get_design_context. A deep re-audit confirmed the real internal structure across all 30 variants (5 sizes × 2 types × 3 states): an icon/text/icon row with 3 booleans and 2 instance-swap slots, a confirmed elevation.e2-derived icon shadow, and a confirmed absence of any focus state — unlike every other interactive component in this library.",
  variants: [
    { name: "size", values: SIZES, note: "lg and md resolve to numerically identical typography, differing only in icon size — reconfirming typography.md's own documented Title/13 vs. Body/13 duplication." },
    { name: "type", values: TYPES, note: "primary is SemiBold with brand-color text; quaternary is Medium with neutral gray text." },
    { name: "state", values: STATES, note: "No focus state exists at all — a confirmed gap unlike every other interactive component audited." },
  ],
  states: STATES,
  gaps: [
    "No focus state exists anywhere in this component's export — this implementation relies on the browser's native :focus-visible outline rather than inventing a custom ring.",
    "type=quaternary's Medium-weight substitution was only directly confirmed at size=xl and is applied uniformly across all sizes as the least-invented extension.",
    "Rendering as a real <a> (with a role/tabIndex fallback when no href is supplied) is a functional necessity — Figma's own export never distinguishes an anchor element from any other container.",
    "The real icon glyph content is unconfirmed — no @shikho/icons inventory exists yet, so leftIcon/rightIcon render empty unless selectLeftIcon/selectRightIcon supply content.",
  ],
  usageExample: `import { Link } from "@shikho/ui";

function Example() {
  return (
    <Link href="/docs" size="md" type="primary">
      Read the docs
    </Link>
  );
}`,
  props: [
    { name: "size", type: "xl | lg | md | sm | xs", defaultValue: "md", description: "Confirmed per-size gap, icon size and typography." },
    { name: "type", type: "primary | quaternary", defaultValue: "primary", description: "Confirmed color/weight family — primary is brand-colored SemiBold, quaternary is neutral Medium." },
    { name: "state", type: "default | hover | disabled", defaultValue: "default", description: "No focus state exists — confirmed absent." },
    { name: "leftIcon / rightIcon / text", type: "boolean", defaultValue: "true", description: "The 3 confirmed boolean slots." },
    { name: "selectLeftIcon / selectRightIcon", type: "ReactNode | null", defaultValue: "null", description: "Confirmed instance-swap slots." },
    { name: "…", type: "AnchorHTMLAttributes<HTMLAnchorElement>", description: "Rendered as a real <a>; href and other native anchor props are forwarded." },
  ],
  preview: () => (
    // No href here deliberately — the gallery card itself is a navigation <a>, and Link renders
    // a <span role="link"> instead of a real anchor whenever href is omitted, avoiding invalid
    // <a>-in-<a> nesting (see the component's own href-conditional rendering).
    <>
      <Link type="primary">Primary link</Link>
      <Link type="quaternary">Quaternary link</Link>
    </>
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "md",
        options: SIZES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "type",
        label: "Type",
        defaultValue: "primary",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "default",
        options: STATES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <Link href="#" size={v.size as LinkSize} type={v.type as LinkType} state={v.state as LinkState}>
        Link
      </Link>
    ),
  },
  showcases: [
    {
      title: "All five confirmed sizes",
      render: () => (
        <>
          {SIZES.map((size) => (
            <Link key={size} href="#" size={size}>
              {size}
            </Link>
          ))}
        </>
      ),
    },
    {
      title: "The two confirmed types",
      description: "primary (SemiBold, brand color) vs. quaternary (Medium, neutral gray).",
      render: () => (
        <>
          {TYPES.map((type) => (
            <Link key={type} href="#" type={type}>
              {type}
            </Link>
          ))}
        </>
      ),
    },
    {
      title: "States — no focus exists",
      description: "default, hover, disabled — confirmed absent: a distinct focus treatment.",
      render: () => (
        <>
          {STATES.map((state) => (
            <Link key={state} href="#" state={state}>
              {state}
            </Link>
          ))}
        </>
      ),
    },
  ],
};
