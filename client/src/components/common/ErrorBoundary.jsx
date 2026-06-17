import { Component } from 'react';
import Logo from './Logo.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('CineVault crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 text-center film-grain relative">
          <div className="relative z-10 flex flex-col items-center">
            <Logo size="lg" />
            <div className="mt-8 w-16 h-16 rounded-full bg-brand-danger/10 border border-brand-danger/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h1 className="mt-6 font-display text-2xl font-semibold text-brand-textPrimary">
              Something went off-script
            </h1>
            <p className="mt-3 text-brand-textSecondary max-w-sm">
              An unexpected error interrupted this scene. Try reloading — your session is safe.
            </p>
            <button onClick={this.handleReload} className="btn-primary mt-8 px-8">
              Reload CineVault
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
