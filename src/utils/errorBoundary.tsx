import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 bg-red-50 rounded-lg text-center">
      <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundaryWrapper: React.FC<Props> = ({ children, fallback }) => {
  const handleError = (error: Error, info: ErrorInfo) => {
    // Log error to your error reporting service
    console.error('Caught error:', error, info);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset any state that might have caused the error
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;