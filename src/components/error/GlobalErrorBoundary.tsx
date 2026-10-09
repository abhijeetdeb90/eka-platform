import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { Sparkles, RefreshCw, Home, AlertCircle, Copy, Check, ChevronDown } from "lucide-react";

export interface GlobalErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Optional callback fired when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional callback fired when reset is invoked */
  onReset?: () => void;
  /** Custom boundary name for tracking and diagnostics */
  boundaryName?: string;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

/**
 * Global React Error Boundary for the EKA Platform.
 * Gracefully catches unhandled runtime JavaScript errors across the React component tree,
 * logs them to diagnostic telemetry, and presents a calm, serene editorial recovery interface
 * that prevents white-screen crashes.
 */
export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Report error to telemetry
    try {
      reportLovableError(error, {
        boundary: this.props.boundaryName || "global_react_error_boundary",
        componentStack: errorInfo.componentStack || "unavailable",
      });
    } catch (loggingError) {
      console.error("Failed to report error to telemetry:", loggingError);
    }

    // Call custom handler if provided
    this.props.onError?.(error, errorInfo);

    // Development diagnostic console log
    console.error("[EKA Sanctuary ErrorBoundary Caught]:", error, errorInfo);
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  handleReload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleCopyDetails = (): void => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    const { error, errorInfo } = this.state;
    const details = [
      `EKA Platform Error Diagnostic`,
      `Time: ${new Date().toISOString()}`,
      `URL: ${typeof window !== "undefined" ? window.location.href : "SSR"}`,
      `Message: ${error?.message || "Unknown error"}`,
      `Name: ${error?.name || "Error"}`,
      `Stack:\n${error?.stack || "No stack available"}`,
      `Component Stack:\n${errorInfo?.componentStack || "No component stack"}`,
    ].join("\n\n");

    navigator.clipboard.writeText(details).then(() => {
      this.setState({ copied: true });
      setTimeout(() => {
        this.setState({ copied: false });
      }, 3000);
    });
  };

  override render(): ReactNode {
    const { hasError, error, errorInfo, copied } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) {
      return children;
    }

    // Render custom fallback if supplied
    if (fallback) {
      if (typeof fallback === "function") {
        return fallback(error, this.reset);
      }
      return fallback;
    }

    // Default EKA Calm Editorial Sanctuary Error UI
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 text-foreground selection:bg-terracotta/20"
      >
        <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-calm sm:p-10">
          {/* Subtle ambient decorative background */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-terracotta/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sand/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Sanctuary Emblem Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-sm ring-1 ring-border/50">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>

            {/* Typography adhering to Fraunces & Karla */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <AlertCircle className="h-3.5 w-3.5" />
                Sanctuary Resilience System
              </span>
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                A Gentle Pause in the Journey
              </h1>
              <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
                Something interrupted this moment in the living cultural archive. Your reflections,
                saved insights, and place in EKA remain safe and protected.
              </p>
            </div>

            {/* Interactive Recovery Actions */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.reset}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-calm transition-all hover:bg-primary/90 hover:shadow-lift focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Restore Sanctuary
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-card px-5 py-3 text-sm font-medium text-foreground transition-all hover:bg-accent focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                Refresh View
              </button>

              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/80 px-5 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-card hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                Return Home
              </a>
            </div>

            {/* Collapsible Diagnostic Panel */}
            <div className="mt-8 w-full border-t border-border/60 pt-6 text-left">
              <details className="group rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs transition-colors hover:bg-muted/50">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-muted-foreground group-open:text-foreground">
                  <span className="flex items-center gap-2">
                    <span>Technical Diagnostics</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {error.name || "Error"}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleCopyDetails();
                      }}
                      className="inline-flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-medium text-foreground shadow-xs hover:bg-accent"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-green-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Diagnostic</span>
                        </>
                      )}
                    </button>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </div>
                </summary>

                <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
                  <div>
                    <div className="font-semibold text-foreground">Message:</div>
                    <div className="mt-0.5 rounded bg-background/60 p-2 font-mono text-destructive">
                      {error.message || "No error message string"}
                    </div>
                  </div>

                  {error.stack && (
                    <div>
                      <div className="font-semibold text-muted-foreground">Stack Trace:</div>
                      <pre className="mt-0.5 max-h-36 overflow-auto rounded bg-background/80 p-2 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {errorInfo?.componentStack && (
                    <div>
                      <div className="font-semibold text-muted-foreground">Component Stack:</div>
                      <pre className="mt-0.5 max-h-24 overflow-auto rounded bg-background/80 p-2 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Higher-Order Component to wrap any component with GlobalErrorBoundary.
 */
export function withErrorBoundary<P extends object>(
  ComponentToWrap: React.ComponentType<P>,
  errorBoundaryProps?: Omit<GlobalErrorBoundaryProps, "children">
): React.FC<P> {
  const DisplayName = ComponentToWrap.displayName || ComponentToWrap.name || "Component";

  const WrappedComponent: React.FC<P> = (props) => (
    <GlobalErrorBoundary boundaryName={DisplayName} {...errorBoundaryProps}>
      <ComponentToWrap {...props} />
    </GlobalErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${DisplayName})`;
  return WrappedComponent;
}
