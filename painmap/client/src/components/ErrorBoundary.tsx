import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof console !== 'undefined') {
      console.error('PainMap crashed:', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-fallback">
        <div className="error-fallback-card">
          <h1 className="error-fallback-headline">Something went wrong.</h1>
          <p className="error-fallback-sub">
            PainMap hit an unexpected error. Refresh the page or return to the body map to continue.
          </p>
          <div className="error-fallback-actions">
            <button type="button" className="error-fallback-btn" onClick={this.handleReset}>
              Return home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
