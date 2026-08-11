import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  /** Change this to force the boundary to drop any caught error and try rendering again —
      used as `key={pathname}` where it wraps a route's `<Outlet />`, so navigating away from a
      route that crashed always gets a clean boundary instead of staying stuck on the fallback. */
  resetKey?: string;
  /** Shown when nothing has crashed — the route tree under this boundary. */
  children: ReactNode;
  /** Optional label included in the diagnostic log line, e.g. "app-shell" vs "root". */
  label?: string;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors in its subtree instead of letting React unmount the whole app to a
 * blank page (the failure mode this exists to prevent — see the investigation in git history for
 * the specific bug this was written to guard against, in `ComponentDetailPage`/`@shikho/ui`
 * button internals).
 *
 * Deliberate limits, per the React error boundary contract: this does NOT catch errors thrown
 * from event handlers, `setTimeout`/`Promise` callbacks, or errors thrown during the boundary's
 * own render — those are handled instead by the `window.onerror` / `unhandledrejection` listeners
 * registered in `main.tsx`, which log but (correctly) cannot stop the crash the way a boundary
 * can for render errors.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Tagged and structured so it's easy to grep out of a Vercel function/browser console log,
    // and includes the component stack React already computed rather than just the error itself.
    console.error(
      `[docs:error-boundary${this.props.label ? `:${this.props.label}` : ""}] Caught a render error at ${window.location.pathname}`,
      error,
      info.componentStack,
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="sk-container" style={{ paddingTop: 48 }}>
          <div className="sk-notes">
            <p className="sk-notes__title">Something went wrong rendering this page</p>
            <p style={{ margin: "8px 0 0", fontSize: 13 }}>
              {this.state.error.message || "An unexpected error occurred."}
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 13 }}>
              Try{" "}
              <a
                href={window.location.pathname}
                style={{ color: "var(--sk-brand)", fontWeight: 600 }}
              >
                reloading this page
              </a>
              , or use the navigation above to go somewhere else — the rest of the site is still
              up.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
