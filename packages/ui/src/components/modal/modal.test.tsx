import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as uiRoot from "../../index";
import { Modal } from "./modal";

describe("root export", () => {
  it("exposes Modal from the @shikho/ui package root", () => {
    expect(uiRoot.Modal).toBe(Modal);
  });
});

describe("confirmed structure per type (docs/audit/modal-deep-audit.md §2)", () => {
  it("type=default renders a bordered header block with title and close button", () => {
    render(
      <Modal
        type="default"
        title="Action heading"
        description="Are you sure?"
        usePortal={false}
      />,
    );
    expect(screen.getByText("Action heading")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("type=confirmation renders title/description in one unbordered body block", () => {
    render(
      <Modal
        type="confirmation"
        title="Action heading"
        description="Are you sure?"
        usePortal={false}
      />,
    );
    expect(screen.getByText("Action heading")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders both action buttons for both types", () => {
    render(
      <Modal
        usePortal={false}
        secondaryActionContent="Cancel"
        primaryActionContent="Yes, continue"
      />,
    );
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Yes, continue")).toBeInTheDocument();
  });
});

describe("confirmed shell dimensions and elevation (§1, §3)", () => {
  it("type=default is 544px wide", () => {
    const { container } = render(<Modal type="default" usePortal={false} />);
    const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.style.width).toBe("544px");
  });

  it("type=confirmation is 480px wide", () => {
    const { container } = render(<Modal type="confirmation" usePortal={false} />);
    const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.style.width).toBe("480px");
  });
});

describe("confirmed modalIcon boolean (§5)", () => {
  it("renders the feature icon by default", () => {
    const { container } = render(
      <Modal usePortal={false} featureIconContent={<span data-testid="icon" />} />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(container).toBeTruthy();
  });

  it("hides the feature icon when modalIcon is false", () => {
    render(<Modal usePortal={false} modalIcon={false} featureIconContent={<span data-testid="icon" />} />);
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });
});

describe("action button callbacks", () => {
  it("fires onSecondaryAction when the secondary button is clicked", () => {
    const onSecondaryAction = vi.fn();
    render(
      <Modal
        usePortal={false}
        secondaryActionContent="Cancel"
        onSecondaryAction={onSecondaryAction}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onSecondaryAction).toHaveBeenCalled();
  });

  it("fires onPrimaryAction when the primary button is clicked", () => {
    const onPrimaryAction = vi.fn();
    render(
      <Modal
        usePortal={false}
        primaryActionContent="Yes, continue"
        onPrimaryAction={onPrimaryAction}
      />,
    );
    fireEvent.click(screen.getByText("Yes, continue"));
    expect(onPrimaryAction).toHaveBeenCalled();
  });
});

describe("dismiss behavior (functional, not a confirmed Figma property, §7)", () => {
  it("fires onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<Modal usePortal={false} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("fires onDismiss and onClose on Escape key", () => {
    const onDismiss = vi.fn();
    const onClose = vi.fn();
    render(<Modal usePortal={false} onDismiss={onDismiss} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onDismiss).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("fires onDismiss and onClose on backdrop click, but not on dialog click", () => {
    const onDismiss = vi.fn();
    const { container } = render(<Modal usePortal={false} onDismiss={onDismiss} />);
    const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
    fireEvent.click(dialog);
    expect(onDismiss).not.toHaveBeenCalled();

    const backdrop = dialog.parentElement as HTMLElement;
    fireEvent.click(backdrop);
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe("open/closed rendering", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(<Modal usePortal={false} open={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders when open is true (the default)", () => {
    render(<Modal usePortal={false} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("ARIA semantics", () => {
  it("exposes role=dialog, aria-modal, and labelledby/describedby", () => {
    render(<Modal usePortal={false} title="Heading" description="Description" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
    expect(dialog).toHaveAttribute("aria-describedby", "modal-description");
  });
});

describe("portal rendering", () => {
  it("renders into document.body when usePortal is true (default)", () => {
    render(<Modal title="Portal test" />);
    expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});

// P13 repair — a fresh get_design_context re-pull on the user-supplied node (16124:7815) found
// the close button's "X" was forced to size=18 (stretching it across the whole 18px icon slot),
// but the confirmed glyph ("vector") sits inset 20.83% inside that slot — i.e. its real ink size
// is 10.5×10.5, the same fix already made on alert.tsx/toast.tsx/tooltip.tsx's own close buttons.
// Also found: neither action button had the confirmed text_wrap 4px label padding or flex
// centering, and none of the modal's three buttons responded to a real pointer at all.
describe("confirmed corrections (P13 repair)", () => {
  it("the close icon renders at its confirmed native 10.5px size, not stretched to 18px", () => {
    render(<Modal usePortal={false} onClose={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    const svg = closeButton.querySelector("svg") as SVGSVGElement;
    expect(svg.style.width).toBe("10.5px");
    expect(svg.style.height).toBe("10.5px");
  });

  it("real pointer hover darkens the close button from white to gray-100", () => {
    render(<Modal usePortal={false} onClose={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton.style.backgroundColor).toBe("rgb(255, 255, 255)");
    fireEvent.mouseEnter(closeButton);
    expect(closeButton.style.backgroundColor).toBe("rgb(244, 244, 246)");
    fireEvent.mouseLeave(closeButton);
    expect(closeButton.style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("real pointer hover darkens both action buttons", () => {
    render(
      <Modal usePortal={false} secondaryActionContent="Cancel" primaryActionContent="Yes, continue" />,
    );
    const secondary = screen.getByRole("button", { name: "Cancel" });
    const primary = screen.getByRole("button", { name: "Yes, continue" });
    expect(secondary.style.backgroundColor).toBe("rgb(244, 244, 246)");
    fireEvent.mouseEnter(secondary);
    expect(secondary.style.backgroundColor).toBe("rgb(235, 236, 240)");
    expect(primary.style.backgroundColor).toBe("rgb(84, 104, 255)");
    fireEvent.mouseEnter(primary);
    expect(primary.style.backgroundColor).not.toBe("rgb(84, 104, 255)");
  });
});

describe("inline mode (docs/style-guide affordance, not a confirmed Figma variant)", () => {
  it("renders only the dialog card, with no fixed backdrop wrapper", () => {
    const { container } = render(<Modal inline title="Inline" />);
    const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toBeInTheDocument();
    expect(dialog.parentElement).toBe(container);
    expect(dialog.style.position).not.toBe("fixed");
  });

  it("does not attach an Escape-key listener in inline mode", () => {
    const onDismiss = vi.fn();
    render(<Modal inline onDismiss={onDismiss} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
