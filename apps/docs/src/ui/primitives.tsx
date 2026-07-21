import type { ReactNode } from "react";

/**
 * Docs-site chrome only — cards, tables, code blocks, section headers.
 *
 * Nothing here re-implements or restyles a design-system component. Every design-system
 * component shown on this site is imported from `@shikho/ui` and rendered as-is.
 */

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
}) {
  return (
    <header>
      {eyebrow ? <div className="sk-eyebrow">{eyebrow}</div> : null}
      <h1 className="sk-h1">{title}</h1>
      {lede ? <p className="sk-lede">{lede}</p> : null}
    </header>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="sk-section">
      <div className="sk-section__head">
        <h2 className="sk-h2">{title}</h2>
        {description ? <p className="sk-section__desc">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="sk-code">
      <code>{code}</code>
    </pre>
  );
}

export function PropsTable({
  rows,
}: {
  rows: { name: string; type: string; defaultValue?: string; description: string }[];
}) {
  return (
    <div className="sk-table-scroll">
      <table className="sk-table">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Prop</th>
            <th style={{ width: "26%" }}>Type</th>
            <th style={{ width: "12%" }}>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="sk-table__name">{row.name}</td>
              <td className="sk-table__type">{row.type}</td>
              <td className="sk-table__default">{row.defaultValue ?? "—"}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function KnownGaps({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="sk-notes">
      <p className="sk-notes__title">Known gaps &amp; unresolved audit information</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ConfidencePill({ confidence }: { confidence: "deep-audited" | "partially-derived" }) {
  const isDeep = confidence === "deep-audited";
  return (
    <span className={`sk-pill ${isDeep ? "sk-pill--stable" : "sk-pill--partial"}`}>
      {isDeep ? "Deep-audited" : "Partly derived"}
    </span>
  );
}

export function TokenChip({ children }: { children: ReactNode }) {
  return <span className="sk-token">{children}</span>;
}
