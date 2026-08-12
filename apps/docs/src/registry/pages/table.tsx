import { useState } from "react";
import { TableCell, type TableCellType } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

const TYPES: TableCellType[] = ["header", "header_compact", "default", "default_compact"];
const AVATAR = "https://i.pravatar.cc/64?img=12";

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg viewBox="0 0 22 22" width={22} height={22} fill="none" aria-hidden>
      <circle cx="11" cy="5" r="1.5" fill="currentColor" />
      <circle cx="11" cy="11" r="1.5" fill="currentColor" />
      <circle cx="11" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

function InteractivePreview() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ width: 500, border: "1px solid #f4f4f6", borderRadius: 8 }}>
      <TableCell
        checkbox
        checked={checked}
        onCheckedChange={setChecked}
        avatar={{ size: "sm", src: AVATAR, alt: "Jane Doe" }}
        heading="Jane Doe"
        supportText="Admin"
        description="jane@example.com"
        tag1="Active"
        tag2="Verified"
      />
    </div>
  );
}

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The original overview audit never ran get_design_context and, based on table_cell exposing \"zero boolean properties in this metadata,\" speculated it might be a simple two-property leaf. A deep re-audit confirms the opposite: table_cell is one of the richest single components audited in this entire library, composing a real nested Checkbox, up to 3 avatar-style image slots, 2 Tags, a dropdown action, and an icon-button action — resolving nearly every open question the original audit left about row selection, avatars, tags, and actions.",
  variants: [
    { name: "type", values: TYPES, note: "header/header_compact are confirmed structurally simpler — no description line, only one avatar slot, no tag/dropdown/action slots." },
    { name: "state", values: ["default", "loading"], note: "loading renders a real skeleton row, not the real content dimmed — but the composition genuinely differs by type (P18): header/header_compact are just a thin bar with no circles at all; default/default_compact each have their own confirmed circle sizes, not a shared 2-circle + bar template." },
  ],
  states: ["default", "loading"],
  gaps: [
    "The audited default instance showed all 3 avatar slots, both tags, and every icon slot on simultaneously — treated here as a spec-sheet illustration, not a literal confirmed default. Every optional slot defaults to hidden, requiring explicit opt-in.",
    "header_compact's padding, gap, avatar size, icon size, and heading typography are all independently confirmed (a fresh get_design_context re-check) — it is NOT simply header/default_compact scaled: its avatar stays fixed at 24px (same as header, unlike default's compact scaling), while its heading text genuinely shrinks to caption_2 (12/16), unlike every other type's body_1 (13/20).",
    "The dropdown and icon-button action slots are implemented inline with table_cell's own confirmed exact values, rather than composing the Input family's own Dropdown component (whose confirmed radius doesn't match).",
    "Sorting, column alignment, pagination controls, expandable rows, status indicators, and sticky headers do not appear in any audited instance — not implemented.",
    "table (the bare Figma instance) was never expanded internally — not implemented, consistent with the existing sidebar_nav/tab_nav precedent.",
  ],
  usageExample: `import { TableCell } from "@shikho/ui";

function UserRow() {
  return (
    <TableCell
      checkbox
      avatar={{ size: "sm", src: "/jane.png", alt: "Jane Doe" }}
      heading="Jane Doe"
      supportText="Admin"
      description="jane@example.com"
      tag1="Active"
      tag2="Verified"
    />
  );
}`,
  props: [
    { name: "type", type: "header | header_compact | default | default_compact", defaultValue: "default", description: "Density folded into type, not a separate property — confirmed." },
    { name: "state", type: "default | loading", defaultValue: "default", description: "loading renders a confirmed skeleton row, not dimmed real content." },
    { name: "checkbox / checked / onCheckedChange", type: "boolean / boolean / (checked) => void", description: "Confirmed real nested Checkbox dependency." },
    { name: "avatar", type: "{ size: \"xs\"|\"sm\"|\"md\"; src?; alt? }", description: "Confirmed avatar-style image slot, pixel sizes vary by density." },
    { name: "heading / supportText / description", type: "ReactNode", description: "description is confirmed absent on header types." },
    { name: "tag1 / tag2", type: "ReactNode", description: "Reuse the real Tags component — secondary and primary_light types respectively." },
    { name: "dropdownContent / onDropdownClick", type: "ReactNode / () => void", description: "Confirmed default/default_compact-only action." },
    { name: "actionIcon / onActionClick / actionLabel", type: "ReactNode / () => void / string", description: "Confirmed icon-button action, 40×40." },
  ],
  preview: () => <InteractivePreview />,
  playground: {
    controls: [
      {
        prop: "type",
        label: "Type",
        defaultValue: "default",
        options: TYPES.map((v) => ({ label: v, value: v })),
      },
    ],
    render: (v) => (
      <div style={{ width: 500, border: "1px solid #f4f4f6", borderRadius: 8 }}>
        <TableCell
          type={v.type as TableCellType}
          checkbox={!(v.type as string).startsWith("header")}
          avatar={{ size: "sm", src: AVATAR }}
          heading="Jane Doe"
          supportText="Admin"
          description="jane@example.com"
        />
      </div>
    ),
  },
  showcases: [
    {
      title: "All four confirmed types",
      description: "header/header_compact omit the description line and extra slots.",
      render: () => (
        <div style={{ width: 500, border: "1px solid #f4f4f6", borderRadius: 8 }}>
          {TYPES.map((type) => (
            <TableCell
              key={type}
              type={type}
              heading={type}
              supportText="Admin"
              description="jane@example.com"
              checkbox={!type.startsWith("header")}
              avatar={{ size: "sm", src: AVATAR }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Full composition",
      description: "Checkbox, avatar, tags, dropdown, and an icon-button action — all confirmed slots at once.",
      render: () => (
        <div style={{ width: 500, border: "1px solid #f4f4f6", borderRadius: 8 }}>
          <TableCell
            checkbox
            avatar={{ size: "sm", src: AVATAR, alt: "Jane Doe" }}
            heading="Jane Doe"
            supportText="Admin"
            description="jane@example.com"
            tag1="Active"
            tag2="Verified"
            dropdownContent={<>Admin <ChevronDownIcon /></>}
            actionIcon={<DotsIcon />}
          />
        </div>
      ),
    },
    {
      title: "Confirmed skeleton loading state — genuinely differs by type",
      description:
        "Not the real content dimmed. Re-checked against fresh get_design_context pulls on all 4 types (P18): header/header_compact are just a single thin bar with NO circles at all; default has its own confirmed 32px+24px circles and 16px bar; default_compact has its own smaller 24px+20px circles and 12px bar — none of the 4 share one template.",
      layout: "stack",
      render: () => (
        <>
          {TYPES.map((type) => (
            <div key={type}>
              <p style={{ fontSize: 11, color: "#8c929c", margin: "0 0 4px" }}>{type}</p>
              <div style={{ width: 500, border: "1px solid #f4f4f6", borderRadius: 8 }}>
                <TableCell type={type} state="loading" />
              </div>
            </div>
          ))}
        </>
      ),
    },
  ],
};
