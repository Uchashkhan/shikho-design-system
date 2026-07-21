import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chip } from "@shikho/ui";
import { componentRegistry } from "../registry";
import { PageHeader, Section } from "../ui/primitives";

const playable = componentRegistry.filter((entry) => entry.playground);

export function PlaygroundPage() {
  const [slug, setSlug] = useState(playable[0]?.slug ?? "");
  const entry = playable.find((candidate) => candidate.slug === slug) ?? playable[0];

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const control of entry?.playground?.controls ?? []) {
      values[control.prop] = control.defaultValue;
    }
    return values;
  }, [entry]);

  const [valuesBySlug, setValuesBySlug] = useState<Record<string, Record<string, string>>>({});
  const values = valuesBySlug[entry?.slug ?? ""] ?? initialValues;

  if (!entry?.playground) {
    return (
      <div className="sk-container">
        <PageHeader title="Playground" lede="No component currently exposes a playground." />
      </div>
    );
  }

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
              key={candidate.slug}
              size="md"
              type={candidate.slug === entry.slug ? "selected" : "unselected"}
              textContent={candidate.name}
              leftIcon={false}
              rightIcon={false}
              onClick={() => setSlug(candidate.slug)}
              aria-pressed={candidate.slug === entry.slug}
            />
          ))}
        </div>
      </Section>

      <Section title={entry.name} description={entry.summary}>
        <div className="sk-preview">{entry.playground.render(values)}</div>
        <div className="sk-controls">
          {entry.playground.controls.map((control) => (
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
