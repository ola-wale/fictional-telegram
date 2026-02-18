import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  resetKeys?: unknown[];
}

interface State {
  hasError: boolean;
  retryAttempted: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryAttempted: false };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      (this.props.resetKeys.length !== prevProps.resetKeys.length ||
        this.props.resetKeys.some((key, i) => key !== prevProps.resetKeys![i]))
    ) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50/50 p-6">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <div className="flex gap-2">
            {!this.state.retryAttempted && (
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false, retryAttempted: true })}
              >
                Try Again
              </Button>
            )}
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
