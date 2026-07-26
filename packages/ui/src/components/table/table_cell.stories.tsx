import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableCell, type TableCellType } from "./table_cell";

const types: TableCellType[] = ["header", "header_compact", "default", "default_compact"];
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

const meta: Meta<typeof TableCell> = {
  title: "Table/table_cell",
  component: TableCell,
  args: {
    type: "default",
    heading: "Jane Doe",
    supportText: "Admin",
    description: "jane@example.com",
    checkbox: true,
    avatar: { size: "sm", src: AVATAR, alt: "Jane Doe" },
    tag1: "Active",
    tag2: "Verified",
  },
  argTypes: {
    type: { control: "select", options: types },
  },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof TableCell>;

export const Playground: Story = {};

/** Confirmed: header types have no description line and only one avatar slot (docs/audit/table-deep-audit.md §2). */
export const AllTypes: Story = {
  render: () => (
    <div style={{ width: 700, border: "1px solid #f4f4f6", borderRadius: 8 }}>
      {types.map((type) => (
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
};

/** Confirmed rich composition — checkbox, avatar, tags, dropdown, and an icon-button action. */
export const FullComposition: Story = {
  render: () => (
    <div style={{ width: 700, border: "1px solid #f4f4f6", borderRadius: 8 }}>
      <TableCell
        type="header"
        heading="Name"
        supportText="5 rows"
      />
      <TableCell
        checkbox
        avatar={{ size: "sm", src: AVATAR, alt: "Jane Doe" }}
        heading="Jane Doe"
        supportText="Admin"
        description="jane@example.com"
        tag1="Active"
        tag2="Verified"
        dropdownContent={
          <>
            Admin <ChevronDownIcon />
          </>
        }
        actionIcon={<DotsIcon />}
      />
    </div>
  ),
};

/** Confirmed skeleton-loading row (docs/audit/table-deep-audit.md §4) — not the real content dimmed. */
export const LoadingState: Story = {
  render: () => (
    <div style={{ width: 700, border: "1px solid #f4f4f6", borderRadius: 8 }}>
      {[1, 2, 3].map((i) => (
        <TableCell key={i} state="loading" />
      ))}
    </div>
  ),
};

/**
 * Confirmed corrections from a fresh get_design_context re-audit (docs/audit/table-deep-audit.md
 * §6): the header family's avatar is fixed at 24px (not scaled per header/header_compact); only
 * `header_compact` drops its heading text to caption_2 (12/16); `default`/`default_compact`'s
 * heading is Medium(500) weight, not SemiBold like the header family; and `default_compact`'s
 * root gap (8px) is narrower than `default`'s (12px).
 */
export const ConfirmedCorrections: Story = {
  render: () => (
    <div style={{ width: 700, border: "1px solid #f4f4f6", borderRadius: 8 }}>
      <TableCell type="header" heading="header (SemiBold, 13/20, 24px avatar)" avatar={{ size: "md", src: AVATAR }} />
      <TableCell
        type="header_compact"
        heading="header_compact (SemiBold, 12/16, still 24px avatar)"
        avatar={{ size: "sm", src: AVATAR }}
      />
      <TableCell type="default" heading="default (Medium, 13/20, 12px gap)" avatar={{ size: "sm", src: AVATAR }} />
      <TableCell
        type="default_compact"
        heading="default_compact (Medium, 13/20, 8px gap)"
        avatar={{ size: "sm", src: AVATAR }}
      />
    </div>
  ),
};

/** Interactive row-selection checkbox. */
export const InteractiveSelection: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <div style={{ width: 700, border: "1px solid #f4f4f6", borderRadius: 8 }}>
          <TableCell
            checkbox
            checked={checked}
            onCheckedChange={setChecked}
            avatar={{ size: "sm", src: AVATAR }}
            heading="Jane Doe"
            description="jane@example.com"
          />
        </div>
      );
    }
    return <Demo />;
  },
};
