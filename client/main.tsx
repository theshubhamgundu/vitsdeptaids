import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Ensure DOM is ready
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Create React root only once
const root = createRoot(container);

// App wrapper with error boundary
const AppWithErrorBoundary = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Render the app
root.render(<AppWithErrorBoundary />);

// For development: enable HMR
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    // Re-render the app when App.tsx changes
    root.render(<AppWithErrorBoundary />);
  });
}

// Handle global errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
