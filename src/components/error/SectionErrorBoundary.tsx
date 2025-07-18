import React, { Component, ErrorInfo, ReactNode } from 'react';

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

/**
 * SectionErrorBoundary component that catches errors in specific sections
 * of the application, preventing the entire page from crashing.
 */
class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Error in ${this.props.sectionName} section:`, error, errorInfo);
    // Log to error tracking service if available
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm my-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {this.props.sectionName} section could not be loaded
          </h3>
          <p className="text-gray-600 mb-4">
            We're having trouble displaying this content. Please try again later.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;