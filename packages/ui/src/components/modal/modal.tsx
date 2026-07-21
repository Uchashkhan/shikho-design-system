import {
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { color, elevation, radius } from "@shikho/tokens";

// docs/audit/modal-deep-audit.md §1 — modal: exactly one property, `type` (default,
// confirmation). No `size` or `state` property exists.
export type ModalType = "default" | "confirmation";

const shadowToCss = (layers: readonly { x: number; y: number; blur: number; spread: number; color: string }[]) =>
  layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(", ");

// docs/audit/modal-deep-audit.md §3 — confirmed genuine elevation difference by type: the
// smaller confirmation dialog carries the heavier e6 shadow (identical to Toast's), while the
// larger default dialog uses e5.
const shellShadow: Record<ModalType, string> = {
  default: shadowToCss(elevation.e5),
  confirmation: shadowToCss(elevation.e6),
};

// docs/audit/modal-deep-audit.md §4 — confirmed 2-layer inset overlay on the close button and
// both action buttons, the same combination confirmed throughout this library (Date Picker,
// Button Group, Toast).
const restingInsetShadow = `inset 0px 1px 3px -2px ${color.white[50]}, inset 0px -1px 3px -2px rgba(0,0,0,0.07)`;
const primaryInsetShadow = `inset 0px 3px 4px -3px ${color.white[600]}, inset 0px 0px 8px -2px ${color.white[500]}`;
const iconShadowFilter = `drop-shadow(0px 1px 0.5px ${elevation.e2[0].color}) drop-shadow(0px 3px 1.5px ${elevation.e2[0].color})`;

// docs/audit/modal-deep-audit.md §5 — confirmed gradient stops for the feature-icon container.
const featureIconGradient = `linear-gradient(180deg, ${color.primary[500]}1f, ${color.primary[500]}33)`;

function CloseButton({ onClick, label }: { onClick?: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        padding: "0.5rem",
        border: `1px solid ${color.black[50]}`,
        borderRadius: radius.full,
        backgroundColor: color.white[950],
        boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
        cursor: "pointer",
      }}
    >
      <span style={{ width: 18, height: 18, filter: iconShadowFilter }}>
        <CloseIcon />
      </span>
    </button>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 18 18" width={18} height={18} fill="none" aria-hidden>
      <path
        d="M4.5 4.5 13.5 13.5M13.5 4.5 4.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FeatureIcon({ size, radiusValue, padding, children }: { size: number; radiusValue: number; padding: number; children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding,
        borderRadius: radiusValue,
        background: featureIconGradient,
        boxShadow: "0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04)",
      }}
    >
      <span style={{ width: size, height: size, filter: iconShadowFilter, color: color.primary[500] }}>
        {children}
      </span>
    </div>
  );
}

function ActionButtons({
  primaryActionContent,
  secondaryActionContent,
  onPrimaryAction,
  onSecondaryAction,
}: {
  primaryActionContent?: ReactNode;
  secondaryActionContent?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
      <button
        type="button"
        onClick={onSecondaryAction}
        style={{
          flex: "1 0 0",
          padding: "0.75rem 1rem",
          borderRadius: radius.lg,
          border: "none",
          backgroundColor: color.gray[100],
          boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), ${restingInsetShadow}`,
          color: color.gray[700],
          fontSize: 13,
          lineHeight: "20px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {secondaryActionContent}
      </button>
      <button
        type="button"
        onClick={onPrimaryAction}
        style={{
          flex: "1 0 0",
          padding: "0.75rem 1rem",
          borderRadius: radius.lg,
          border: `1px solid ${color.black[150]}`,
          backgroundColor: color.primary[500],
          boxShadow: `0px 1px 1px -0.5px rgba(0,0,0,0.04), 0px 3px 3px -1.5px rgba(0,0,0,0.04), ${primaryInsetShadow}`,
          color: color.white[950],
          fontSize: 13,
          lineHeight: "20px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {primaryActionContent}
      </button>
    </div>
  );
}

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  type?: ModalType;
  /** Confirmed boolean, default `true` (§5). */
  modalIcon?: boolean;
  featureIconContent?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  primaryActionContent?: ReactNode;
  secondaryActionContent?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onClose?: () => void;
  closeButtonLabel?: string;
  /** Whether the modal is mounted/visible. Not a Figma-confirmed property — a functional
   * necessity for any real dialog (docs/audit/modal-deep-audit.md §7). Defaults to `true` so the
   * component still renders standalone (e.g. inside Storybook/a docs preview). */
  open?: boolean;
  /** Fires on Escape or backdrop click, in addition to `onClose` — not a confirmed Figma
   * behavior, the same "functional necessity" reasoning already applied to Date Picker. */
  onDismiss?: () => void;
  /** Renders through a portal into `document.body` instead of in place. Defaults to `true`. */
  usePortal?: boolean;
  /** Renders just the dialog card in normal document flow — no fixed backdrop, no portal, no
   * Escape/backdrop dismissal. Not a Figma-confirmed variant; a documentation/style-guide
   * affordance so this component can be shown safely inside a bounded preview card instead of
   * covering the whole viewport. Defaults to `false` (the real floating-overlay behavior). */
  inline?: boolean;
}

/**
 * `modal` (docs/audit/modal-deep-audit.md, deep-audited across both `type` variants). `default`
 * and `confirmation` are genuinely different compositions, not one shared shell resized — this
 * branches its rendering by `type` to match. No overlay/backdrop or dismiss behavior is confirmed
 * by Figma (§7); both are implemented as ordinary, minimal, documented functional additions
 * (`role="dialog"`, Escape/backdrop-click dismiss) since a floating dialog is meaningless
 * without them — the same category of necessary-but-unconfirmed addition already made for Date
 * Picker's calendar interactions.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      type = "default",
      modalIcon = true,
      featureIconContent,
      title,
      description,
      primaryActionContent,
      secondaryActionContent,
      onPrimaryAction,
      onSecondaryAction,
      onClose,
      closeButtonLabel = "Close",
      open = true,
      onDismiss,
      usePortal = true,
      inline = false,
      style,
      ...props
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!open || inline) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onDismiss?.();
          onClose?.();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      dialogRef.current?.focus();
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, inline, onDismiss, onClose]);

    if (!open) return null;

    const handleBackdropClick = () => {
      onDismiss?.();
      onClose?.();
    };

    const shellStyle = {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center" as const,
      width: type === "default" ? 544 : 480,
      backgroundColor: color.white[950],
      border: `1px solid ${color.gray[200]}`,
      borderRadius: radius["4xl"],
      boxShadow: shellShadow[type],
      position: "relative" as const,
      ...style,
    };

    const dialogElement = (
      <div
        ref={(node) => {
          dialogRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
        data-type={type}
        style={shellStyle}
        onClick={inline ? undefined : (event) => event.stopPropagation()}
          {...props}
        >
          {type === "default" ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  width: "100%",
                  padding: "1.5rem 2rem",
                  borderBottom: `1px solid ${color.gray[100]}`,
                }}
              >
                <p
                  id="modal-title"
                  style={{
                    flex: "1 0 0",
                    margin: 0,
                    textAlign: "center",
                    fontSize: 22,
                    lineHeight: "32px",
                    fontWeight: 600,
                    color: color.gray[950],
                  }}
                >
                  {title}
                </p>
                <CloseButton onClick={onClose} label={closeButtonLabel} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  width: "100%",
                  padding: "0.5rem 1.5rem",
                }}
              >
                {modalIcon && (
                  <div style={{ padding: "1rem 0" }}>
                    <FeatureIcon size={40} radiusValue={radius.xl} padding={12}>
                      {featureIconContent}
                    </FeatureIcon>
                  </div>
                )}
                <p
                  id="modal-description"
                  style={{
                    margin: 0,
                    textAlign: "center",
                    fontSize: 13,
                    lineHeight: "20px",
                    fontWeight: 500,
                    color: color.gray[700],
                  }}
                >
                  {description}
                </p>
              </div>

              <div
                style={{
                  width: "100%",
                  padding: "1rem 2rem 0",
                  borderTop: `1px solid ${color.gray[100]}`,
                  paddingBottom: "2rem",
                }}
              >
                <ActionButtons
                  primaryActionContent={primaryActionContent}
                  secondaryActionContent={secondaryActionContent}
                  onPrimaryAction={onPrimaryAction}
                  onSecondaryAction={onSecondaryAction}
                />
              </div>
            </>
          ) : (
            <>
              <CloseButton onClick={onClose} label={closeButtonLabel} />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "1.5rem 1.5rem 0.5rem",
                }}
              >
                {modalIcon && (
                  <div style={{ paddingBottom: "1rem" }}>
                    <FeatureIcon size={28} radiusValue={radius.lg} padding={10}>
                      {featureIconContent}
                    </FeatureIcon>
                  </div>
                )}
                <p
                  id="modal-title"
                  style={{
                    margin: 0,
                    textAlign: "center",
                    fontSize: 22,
                    lineHeight: "32px",
                    fontWeight: 600,
                    color: color.gray[950],
                  }}
                >
                  {title}
                </p>
                <p
                  id="modal-description"
                  style={{
                    margin: 0,
                    textAlign: "center",
                    fontSize: 13,
                    lineHeight: "20px",
                    fontWeight: 500,
                    color: color.gray[600],
                  }}
                >
                  {description}
                </p>
              </div>

              <div style={{ width: "100%", padding: "1rem 1.5rem 1.5rem" }}>
                <ActionButtons
                  primaryActionContent={primaryActionContent}
                  secondaryActionContent={secondaryActionContent}
                  onPrimaryAction={onPrimaryAction}
                  onSecondaryAction={onSecondaryAction}
                />
              </div>
            </>
          )}
      </div>
    );

    if (inline) {
      return dialogElement;
    }

    const modalContent = (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
        onClick={handleBackdropClick}
      >
        {dialogElement}
      </div>
    );

    if (usePortal && typeof document !== "undefined") {
      return createPortal(modalContent, document.body);
    }
    return modalContent;
  },
);

Modal.displayName = "Modal";
