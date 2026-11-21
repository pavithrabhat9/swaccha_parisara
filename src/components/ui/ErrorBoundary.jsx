import React from 'react';
import ErrorState from './ErrorState';

/**
 * ErrorBoundary — Route & Shell resilience boundary for production scaling.
 * Catches unexpected render/chunk-load failures and offers a clean recovery action.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto px-4 py-12">
          <ErrorState
            title="Something went wrong"
            description={this.state.error?.message || 'An unexpected error occurred while rendering this view.'}
            retryLabel="Reload App"
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

