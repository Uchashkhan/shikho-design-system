import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Chip } from "@shikho/ui";
import { InfoCircleIcon } from "@shikho/icons";
import {
  componentSummaries,
  getComponent,
  getPageConfig,
  resolveControlOptions,
  totalVariantValues,
  type Control,
  type ControlOption,
} from "../registry";
import {
  CodeBlock,
  ConfidencePill,
  FallbackPreview,
  KnownGaps,
  PageHeader,
  PropsTable,
  Section,
  TokenChip,
} from "../ui/primitives";

/**
 * Playground controls are built from the real `Chip` component — the docs site dogfoods the
 * system it documents rather than shipping a parallel set of control widgets.
 */
function ControlGroup({
  control,
  options,
  value,
  onChange,
}: {
  control: Control;
  options: ControlOption[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="sk-control-group">
      <span className="sk-control__label">{control.label}</span>
      <div className="sk-control__options">
        {options.map((option) => (
          <Chip
            key={option.value}
            size="sm"
            type={option.value === value ? "selected" : "unselected"}
            textContent={option.label}
            leftIcon={false}
            rightIcon={false}
            onClick={() => onChange(option.value)}
            aria-pressed={option.value === value}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Thin wrapper so every `:slug` gets a genuinely fresh `ComponentDetailPageContent` instance.
 *
 * Root cause of a real bug found while investigating intermittent blank pages: React Router
 * reuses the same component instance across navigations that match the same route pattern
 * (`/components/:slug` → `/components/:slug`), so without this `key`, `ComponentDetailPageContent`'s
 * own `useState(initialValues)` below only ever ran on the very first mount — switching from one
 * component's detail page to another left `values` holding the PREVIOUS component's control state
 * (e.g. `{ type: "selected" }` from Chip) while rendering the NEW component's `playground.render`.
 * Several `@shikho/ui` button families look up their `type` prop in a fixed table with no
 * fallback for an unrecognized key (see `rampEmphasisStyle` in `packages/ui`, fixed separately to
 * degrade instead of crash) — an unrecognized leftover string reaching one of those was enough to
 * throw during render and, with no error boundary at the time, blank the entire app. `key={slug}`
 * makes React unmount and remount this component on every genuine navigation, so its local state
 * always starts clean for whichever component is actually being viewed.
 */
export function ComponentDetailPage() {
  const { slug = "" } = useParams();
  return <ComponentDetailPageContent key={slug} slug={slug} />;
}

function ComponentDetailPageContent({ slug }: { slug: string }) {
  const entry = getComponent(slug);
  const page = entry ? getPageConfig(entry.slug) : undefined;

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const control of page?.playground?.controls ?? []) {
      values[control.prop] = control.defaultValue;
    }
    return values;
  }, [page]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const playground = page?.playground;

  // Keeps every control's stored value valid whenever a control with DEPENDENT options (e.g.
  // Button's Type, filtered by the selected Family) is affected by another control changing —
  // otherwise the chip row could show nothing highlighted while the preview silently fell back
  // to a different value than what's displayed as selected.
  useEffect(() => {
    if (!playground) return;
    for (const control of playground.controls) {
      const options = resolveControlOptions(control, values);
      const current = values[control.prop];
      if (options.length > 0 && !options.some((o) => o.value === current)) {
        setValues((prev) => ({ ...prev, [control.prop]: options[0].value }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, playground]);

  if (!entry) {
    return (
      <div className="sk-container">
        <PageHeader title="Component not found" lede={`No component is registered at “${slug}”.`} />
        <p style={{ marginTop: 20 }}>
          <Link to="/components" style={{ color: "var(--sk-brand)", fontWeight: 600 }}>
            ← Back to all components
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="sk-container">
      <nav className="sk-breadcrumb">
        <Link to="/components">Components</Link>
        <span aria-hidden>/</span>
        <span>{entry.category}</span>
        <span aria-hidden>/</span>
        <span>{entry.name}</span>
      </nav>

      <PageHeader
        eyebrow={entry.category}
        title={entry.name}
        lede={componentSummaries[entry.slug] ?? entry.description}
      />

      <div className="sk-meta-row">
        <ConfidencePill status={entry.status} />
        <TokenChip>{entry.auditFile}</TokenChip>
        <TokenChip>{entry.storybookTitle}</TokenChip>
        {page && totalVariantValues(entry.slug) > 0 ? (
          <TokenChip>{totalVariantValues(entry.slug)} variants</TokenChip>
        ) : null}
      </div>

      {!page ? (
        <Section title="Documentation coming soon">
          <div className="sk-empty">
            <FallbackPreview name={entry.name} />
            <p style={{ marginTop: 12, fontSize: 13 }}>
              This component has metadata but no custom documentation page yet. It's fully
              implemented in <span className="sk-inline-code">@shikho/ui</span> — see its own
              README under <span className="sk-inline-code">packages/ui/src/components</span> for
              full details, or check{" "}
              <span className="sk-inline-code">{entry.storybookTitle}</span> in Storybook.
            </p>
          </div>
        </Section>
      ) : (
        <>
          {playground ? (
            <Section
              title="Interactive preview"
              description="Controls are built from the real Chip component. Only confirmed variant values are offered."
            >
              <div className="sk-preview">{playground.render(values)}</div>
              <div className="sk-controls">
                {playground.controls.map((control) => (
                  <ControlGroup
                    key={control.prop}
                    control={control}
                    options={resolveControlOptions(control, values)}
                    value={values[control.prop] ?? control.defaultValue}
                    onChange={(next) => setValues((prev) => ({ ...prev, [control.prop]: next }))}
                  />
                ))}
              </div>
            </Section>
          ) : null}

          <Section title="Installation">
            <CodeBlock code={entry.packageImport} />
          </Section>

          <Section title="Usage">
            <CodeBlock code={page.usageExample} />
          </Section>

          {page.longDescription ? (
            <Section title="Audit notes" description="The deeper implementation story behind this component, for when the short summary above isn't enough.">
              <div className="sk-audit-note">
                <InfoCircleIcon size={18} className="sk-audit-note__icon" />
                <p>{page.longDescription}</p>
              </div>
            </Section>
          ) : null}

          <Section
            title="Confirmed variants"
            description="Variant axes and values exactly as the Figma audit confirmed them — nothing inferred or extended."
          >
            <div style={{ display: "grid", gap: 16 }}>
              {page.variants.map((axis) => (
                <div key={axis.name}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span className="sk-table__name">{axis.name}</span>
                    <span className="sk-pill sk-pill--count">{axis.values.length} values</span>
                  </div>
                  <div className="sk-chiprow">
                    {axis.values.map((value) => (
                      <TokenChip key={value}>{value}</TokenChip>
                    ))}
                  </div>
                  {axis.note ? <p className="sk-section__desc">{axis.note}</p> : null}
                </div>
              ))}
            </div>
          </Section>

          {page.states.length > 0 ? (
            <Section
              title="Confirmed states"
              description="States present in the audited component set. States absent here do not exist in the source."
            >
              <div className="sk-chiprow">
                {page.states.map((state) => (
                  <TokenChip key={state}>{state}</TokenChip>
                ))}
              </div>
            </Section>
          ) : null}

          {page.showcases.length > 0 ? (
            <Section title="Variants in context">
              {page.showcases.map((showcase) => (
                <div className="sk-variant-block" key={showcase.title}>
                  <p className="sk-variant-block__title">{showcase.title}</p>
                  {showcase.description ? (
                    <p className="sk-section__desc" style={{ marginBottom: 10 }}>
                      {showcase.description}
                    </p>
                  ) : null}
                  <div
                    className={`sk-variant-block__stage${
                      showcase.layout === "stack" ? " sk-variant-block__stage--stack" : ""
                    }`}
                  >
                    {showcase.render()}
                  </div>
                </div>
              ))}
            </Section>
          ) : null}

          <Section title="Props" description={`Exports from @shikho/ui: ${entry.exports.join(", ")}`}>
            <PropsTable rows={page.props} />
          </Section>

          <Section title="Known limitations">
            <KnownGaps items={page.gaps} />
          </Section>
        </>
      )}
    </div>
  );
}
