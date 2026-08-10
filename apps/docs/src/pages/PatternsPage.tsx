import { Link as RouterLink } from "react-router-dom";
import { PageHeader } from "../ui/primitives";

/**
 * The homepage reference lists "Patterns" as a primary destination, but the design system does
 * not have a patterns library yet — no pattern has been through the Figma audit that every
 * component in `@shikho/ui` went through.
 *
 * Rather than drop the nav item or point it at a 404, this route says so plainly. Stating the
 * gap is more honest than shipping invented pattern documentation that would not be backed by
 * the audit trail the rest of the site rests on.
 */
export function PatternsPage() {
  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Coming soon"
        title="Patterns"
        lede="Common UI patterns and layouts for real product scenarios."
      />

      <div className="sk-notes" style={{ marginTop: 24 }}>
        <p className="sk-notes__title">Not documented yet</p>
        <ul>
          <li>
            Every component in this system is published only after it has been verified against
            its Figma source. No composed pattern has been through that process yet, so there is
            nothing here that would meet the same bar.
          </li>
          <li>
            In the meantime, the{" "}
            <RouterLink to="/components" style={{ color: "var(--sk-brand)", fontWeight: 600 }}>
              component reference
            </RouterLink>{" "}
            documents each primitive, and the{" "}
            <RouterLink to="/playground" style={{ color: "var(--sk-brand)", fontWeight: 600 }}>
              playground
            </RouterLink>{" "}
            can be used to compose and test combinations directly.
          </li>
        </ul>
      </div>
    </div>
  );
}
