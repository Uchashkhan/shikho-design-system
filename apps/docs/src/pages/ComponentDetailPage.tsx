import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Chip } from "@shikho/ui";
import { InfoCircleIcon } from "@shikho/icons";
import { componentSummaries, getComponent, getPageConfig, totalVariantValues, type Control } from "../registry";
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
  value,
  onChange,
}: {
  control: Control;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="sk-control-group">
      <span className="sk-control__label">{control.label}</span>
      <div className="sk-control__options">
        {control.options.map((option) => (
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

export function ComponentDetailPage() {
  const { slug = "" } = useParams();
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

  const playground = page?.playground;

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
