import { Component, type ErrorInfo, type ReactNode } from 'react';
import i18n from '../i18n';

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

    // Class component, so no useTranslation hook: read off the i18n instance
    // directly. This screen won't re-render on a language switch, which is
    // fine for a terminal error state whose only action is a full reload.

    return (
      <div className="error-fallback">
        <div className="error-fallback-card">
          <h1 className="error-fallback-headline">{i18n.t('errorBoundary.title')}</h1>
          <p className="error-fallback-sub">{i18n.t('errorBoundary.body')}</p>
          <div className="error-fallback-actions">
            <button type="button" className="error-fallback-btn" onClick={this.handleReset}>
              {i18n.t('errorBoundary.action')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
