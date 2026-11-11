import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the console useful for local debugging without losing the UI.
    console.error("SignAI crashed while rendering:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="error-screen" role="alert">
        <div className="card error-card">
          <span className="error-code">Unexpected error</span>
          <h1>Something interrupted the recognition workspace.</h1>
          <p className="text-soft">
            Your data is safe. Try the action again, or reload the app if the
            screen keeps failing.
          </p>

          <details className="error-details">
            <summary>Technical details</summary>
            <pre>{String(error?.stack || error?.message || error)}</pre>
          </details>

          <div className="row mt-6">
            <button type="button" className="btn btn-primary" onClick={this.handleReset}>
              Try again
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => window.location.reload()}
            >
              Reload app
            </button>
            <a className="btn btn-ghost" href="/dashboard">
              Back to overview
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
