import { List, type ListSize, type ListState } from "@shikho/ui";
import type { ComponentPageConfig } from "./types";

export const pageConfig: ComponentPageConfig = {
  longDescription:
    "The first composed component in the library. `list` is one component set — a single row, not a container/child pair — and it nests a real Checkbox via its `leadIcon` boolean. That boolean's name is a confirmed misnomer: it controls a checkbox, not a generic icon, and is preserved rather than renamed.",
  variants: [
    { name: "size", values: ["md", "lg", "xl"], note: "Heights 52, 60 and 76. Only lg was deep-audited." },
    {
      name: "state",
      values: ["default", "hover", "active_primary_accent"],
      note: "Sparser than other families — no disabled, selected, error or focus state exists.",
    },
  ],
  states: ["default", "hover", "active_primary_accent"],
  gaps: [
    "The state named `active_primary_accent` has a confirmed fill of plain Color/Gray — no primary-brand colour appears anywhere in its confirmed bindings. The name/visual mismatch is reproduced faithfully rather than \"corrected\" into what the name implies.",
    "Whether default and hover, or the md and xl sizes, differ structurally from the one deep-audited lg instance is explicitly out of scope in the audit — they share the confirmed visual as a baseline.",
    "The `tags` element's `special_drop` inset shadow is omitted entirely: one of its two shadow layers references a colour with no confirmed hex value anywhere in any audit file.",
    "No default text content is supplied for any slot — the audit's own confirmed instance has a placeholder-content bug where the right-side description repeats the trailing text.",
    "The `leadItem` / `leadItemLg` slots are plain image layers, not confirmed nested Avatar instances; nothing renders without a supplied src.",
    "`drop_menu` appears in the same Figma frame as a bare instance with zero confirmed structure, and is not implemented.",
  ],
  usageExample: `import { List } from "@shikho/ui";

export function SelectableRows({ items, onSelect }) {
  return (
    <div>
      {items.map((item) => (
        <List
          key={item.id}
          size="lg"
          textContent={item.title}
          description1Content={item.subtitle}
          tagContent={item.tag}
          checkboxProps={{
            "aria-label": \`Select \${item.title}\`,
            checked: item.selected,
            onChange: () => onSelect(item.id),
          }}
        />
      ))}
    </div>
  );
}`,
  props: [
    { name: "size", type: "md | lg | xl", defaultValue: "lg", description: "Confirmed size steps. Only lg has confirmed layout data." },
    { name: "state", type: "default | hover | active_primary_accent", defaultValue: "default", description: "Confirmed state enum — note the name/fill discrepancy above." },
    { name: "leadIcon", type: "boolean", defaultValue: "true", description: "Renders the nested Checkbox. Named `leadIcon` in Figma despite controlling a checkbox." },
    { name: "leadItem / leftIcon / rightIcon / tag / text / textGroup1 / description1 / textGroup2 / trailText / description2", type: "boolean", defaultValue: "true", description: "Confirmed slot booleans, all defaulting on." },
    { name: "leadItemLg", type: "boolean", defaultValue: "false", description: "The one confirmed boolean that defaults off." },
    { name: "selectLeftIcon / selectRightIcon", type: "ReactNode | null", defaultValue: "null", description: "Confirmed instance-swap slots." },
    { name: "checkboxProps", type: "Omit<CheckboxProps, \"size\" | \"shape\">", description: "Forwarded to the nested Checkbox. Size and shape are fixed to the confirmed sm/square configuration." },
  ],
  preview: () => (
    <div style={{ width: "100%" }}>
      <List
        size="lg"
        textContent="List item"
        description1Content="Description"
        trailTextContent="Trail text"
        description2Content="Description"
        tagContent="Tag"
        checkboxProps={{ "aria-label": "Select row" }}
      />
    </div>
  ),
  playground: {
    controls: [
      {
        prop: "size",
        label: "Size",
        defaultValue: "lg",
        options: ["md", "lg", "xl"].map((v) => ({ label: v, value: v })),
      },
      {
        prop: "state",
        label: "State",
        defaultValue: "default",
        options: ["default", "hover", "active_primary_accent"].map((v) => ({ label: v, value: v })),
      },
      {
        prop: "leadIcon",
        label: "Checkbox (leadIcon)",
        defaultValue: "true",
        options: [
          { label: "shown", value: "true" },
          { label: "hidden", value: "false" },
        ],
      },
      {
        prop: "tag",
        label: "Tag",
        defaultValue: "true",
        options: [
          { label: "shown", value: "true" },
          { label: "hidden", value: "false" },
        ],
      },
    ],
    render: (v) => (
      <div style={{ width: "100%" }}>
        <List
          size={v.size as ListSize}
          state={v.state as ListState}
          leadIcon={v.leadIcon === "true"}
          tag={v.tag === "true"}
          textContent="List item"
          description1Content="Description"
          trailTextContent="Trail text"
          description2Content="Description"
          tagContent="Tag"
          checkboxProps={{ "aria-label": "Select row" }}
        />
      </div>
    ),
  },
  showcases: [
    {
      title: "Composed rows",
      description: "Stacked rows form a list — each row carries its own confirmed bottom divider.",
      layout: "stack",
      render: () => (
        <div>
          <List
            textContent="Row with all slots"
            description1Content="Description text"
            trailTextContent="Trail text"
            description2Content="Description text"
            tagContent="Tag"
            checkboxProps={{ "aria-label": "Row one" }}
          />
          <List
            textContent="Row with fewer slots"
            description1Content="Description text"
            tag={false}
            textGroup2={false}
            checkboxProps={{ "aria-label": "Row two" }}
          />
          <List
            leadIcon={false}
            textContent="Row without a checkbox"
            description1Content="Description text"
            tagContent="Tag"
          />
        </div>
      ),
    },
    {
      title: "The nested Checkbox",
      description:
        "leadIcon composes the real Checkbox component — checked, unchecked and disabled all work through it.",
      layout: "stack",
      render: () => (
        <div>
          <List
            textContent="Unchecked"
            checkboxProps={{ "aria-label": "Unchecked row", defaultChecked: false }}
          />
          <List
            textContent="Checked"
            checkboxProps={{ "aria-label": "Checked row", defaultChecked: true }}
          />
          <List
            textContent="Disabled checkbox"
            checkboxProps={{ "aria-label": "Disabled row", disabled: true }}
          />
        </div>
      ),
    },
    {
      title: "Sizes",
      layout: "stack",
      render: () => (
        <div>
          {(["md", "lg", "xl"] as ListSize[]).map((size) => (
            <List
              key={size}
              size={size}
              textContent={`size = ${size}`}
              description1Content="Description"
              checkboxProps={{ "aria-label": `${size} row` }}
            />
          ))}
        </div>
      ),
    },
  ],
};
