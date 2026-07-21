import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chip } from "@shikho/ui";
import { componentRegistry, getPageConfig } from "../registry";
import { PageHeader, Section } from "../ui/primitives";

const playable = componentRegistry
  .map((entry) => ({ entry, page: getPageConfig(entry.slug) }))
  .filter((candidate): candidate is typeof candidate & { page: NonNullable<typeof candidate.page> } =>
    Boolean(candidate.page?.playground),
  );

export function PlaygroundPage() {
  const [slug, setSlug] = useState(playable[0]?.entry.slug ?? "");
  const current = playable.find((candidate) => candidate.entry.slug === slug) ?? playable[0];
  const playground = current?.page.playground;

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const control of playground?.controls ?? []) {
      values[control.prop] = control.defaultValue;
    }
    return values;
  }, [playground]);

  const [valuesBySlug, setValuesBySlug] = useState<Record<string, Record<string, string>>>({});
  const values = valuesBySlug[current?.entry.slug ?? ""] ?? initialValues;

  if (!current || !playground) {
    return (
      <div className="sk-container">
        <PageHeader title="Playground" lede="No component currently exposes a playground." />
      </div>
    );
  }

  const { entry } = current;

  const setValue = (prop: string, next: string) =>
    setValuesBySlug((prev) => ({
      ...prev,
      [entry.slug]: { ...(prev[entry.slug] ?? initialValues), [prop]: next },
    }));

  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Sandbox"
        title="Playground"
        lede="Try any component against its confirmed variant values. Controls only ever offer values the audit confirmed — there is no way to select a variant the design system does not actually have."
      />

      <Section title="Component">
        <div className="sk-chiprow">
          {playable.map((candidate) => (
            <Chip
              key={candidate.entry.slug}
              size="md"
              type={candidate.entry.slug === entry.slug ? "selected" : "unselected"}
              textContent={candidate.entry.name}
              leftIcon={false}
              rightIcon={false}
              onClick={() => setSlug(candidate.entry.slug)}
              aria-pressed={candidate.entry.slug === entry.slug}
            />
          ))}
        </div>
      </Section>

      <Section title={entry.name} description={entry.description}>
        <div className="sk-preview">{playground.render(values)}</div>
        <div className="sk-controls">
          {playground.controls.map((control) => (
            <div key={control.prop}>
              <span className="sk-control__label">{control.label}</span>
              <div className="sk-control__options">
                {control.options.map((option) => (
                  <Chip
                    key={option.value}
                    size="sm"
                    type={
                      option.value === (values[control.prop] ?? control.defaultValue)
                        ? "selected"
                        : "unselected"
                    }
                    textContent={option.label}
                    leftIcon={false}
                    rightIcon={false}
                    onClick={() => setValue(control.prop, option.value)}
                    aria-pressed={option.value === (values[control.prop] ?? control.defaultValue)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="sk-section__desc" style={{ marginTop: 14 }}>
          <Link to={`/components/${entry.slug}`} style={{ color: "var(--sk-brand)", fontWeight: 600 }}>
            Open the full {entry.name} documentation →
          </Link>
        </p>
      </Section>
    </div>
  );
}
