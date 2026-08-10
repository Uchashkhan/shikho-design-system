import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  CheckboxLabel,
  InputField,
  Link,
  NewBlueButton,
  Pagination,
  RadioLabel,
  TableCell,
  ToggleLabel,
} from "@shikho/ui";
import { PageHeader, Section } from "../ui/primitives";

/**
 * Every control below is a real `@shikho/ui` component, used exactly as documented on the
 * component reference — nothing here is a new reusable component. The `.ptn-*` classes in
 * `styles.css` are layout-only wrappers (surface, spacing, rows) that arrange those components
 * into a page-like shape.
 *
 * These are compositions, not a separately audited pattern library: no pattern here has been
 * through the Figma audit the individual components went through, so treat them as a starting
 * layout to adapt, not a confirmed spec.
 */
export function PatternsPage() {
  return (
    <div className="sk-container">
      <PageHeader
        eyebrow="Compositions"
        title="Patterns"
        lede="Common UI patterns and layouts for real product scenarios, composed entirely from existing @shikho/ui components."
      />

      <p className="sk-section__desc" style={{ marginTop: 10 }}>
        Each layout below is built only from components documented on the{" "}
        <RouterLink to="/components" style={{ color: "var(--sk-brand)", fontWeight: 600 }}>
          component reference
        </RouterLink>
        . Copy the shape, then swap in real data.
      </p>

      <SignInPattern />
      <TeamTablePattern />
      <NotificationSettingsPattern />
    </div>
  );
}

function SignInPattern() {
  return (
    <Section
      title="Sign-in form"
      description="Labeled fields, a remember-me choice, and a single primary action."
    >
      <div className="ptn-surface ptn-surface--narrow">
        <div className="ptn-stack">
          <InputField
            state="default"
            labelContent="Work email"
            fieldProps={{ textContent: "jane@shikho.com", style: { width: "100%" } }}
            hintProps={{ hintTextContent: "Use your @shikho.com address." }}
          />
          <InputField
            state="default"
            labelContent="Password"
            fieldProps={{ textContent: "••••••••••", style: { width: "100%" } }}
            hint={false}
          />
          <div className="ptn-row-between">
            <CheckboxLabel
              size="sm"
              labelContent="Remember me"
              caption={false}
              checkboxProps={{ defaultChecked: true }}
            />
            <Link size="sm" type="primary" href="#">
              Forgot password?
            </Link>
          </div>
          <NewBlueButton size="lg" type="Primary" style={{ width: "100%" }}>
            Sign in
          </NewBlueButton>
        </div>
      </div>
    </Section>
  );
}

function TeamTablePattern() {
  const [page, setPage] = useState(1);

  return (
    <Section
      title="Team members table"
      description="A row per person — role, status, and a paginated list."
    >
      <div className="ptn-surface">
        <div className="ptn-toolbar">
          <p className="ptn-toolbar__title">4 of 12 members</p>
          <NewBlueButton size="sm" type="Primary">
            Invite member
          </NewBlueButton>
        </div>

        <div className="ptn-table">
          <TableCell type="header_compact" heading="People with access" />
          <TableCell
            heading="Jane Rahman"
            supportText="jane@shikho.com"
            dropdownContent="Admin"
            tag1="Active"
          />
          <TableCell
            heading="Arif Hossain"
            supportText="arif@shikho.com"
            dropdownContent="Editor"
            tag1="Active"
          />
          <TableCell
            heading="Mitu Akter"
            supportText="mitu@shikho.com"
            dropdownContent="Viewer"
            tag1="Invited"
          />
        </div>

        <Pagination currentPage={page} totalPages={4} onPageChange={setPage} compact />
      </div>
    </Section>
  );
}

function NotificationSettingsPattern() {
  return (
    <Section
      title="Notification preferences"
      description="Grouped toggles and a delivery choice behind a save action."
    >
      <div className="ptn-surface ptn-surface--narrow">
        <Alert
          state="info"
          titleContent="Changes apply to this workspace only"
          descriptionContent="Personal notification settings can be changed later from your profile."
        />

        <div className="ptn-stack" style={{ marginTop: 20 }}>
          <ToggleLabel
            size="md"
            labelContent="Email notifications"
            captionContent="Product updates and weekly summaries"
            toggleProps={{ defaultChecked: true }}
          />
          <ToggleLabel
            size="md"
            labelContent="Push notifications"
            captionContent="Real-time alerts on your devices"
            toggleProps={{ defaultChecked: false }}
          />
          <ToggleLabel
            size="md"
            labelContent="Weekly digest"
            captionContent="A single email every Monday"
            toggleProps={{ defaultChecked: true }}
          />
        </div>

        <div className="ptn-divider" />

        <p className="ptn-group-label">Delivery frequency</p>
        <div className="ptn-stack">
          <RadioLabel
            size="sm"
            labelContent="Instant"
            radioProps={{ name: "frequency", value: "instant", defaultChecked: true }}
          />
          <RadioLabel
            size="sm"
            labelContent="Daily digest"
            radioProps={{ name: "frequency", value: "daily" }}
          />
          <RadioLabel
            size="sm"
            labelContent="Weekly digest"
            radioProps={{ name: "frequency", value: "weekly" }}
          />
        </div>

        <div className="ptn-row-end">
          <NewBlueButton size="md" type="Text">
            Cancel
          </NewBlueButton>
          <NewBlueButton size="md" type="Primary">
            Save changes
          </NewBlueButton>
        </div>
      </div>
    </Section>
  );
}
