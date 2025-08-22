import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Ensure DOM is ready
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Create React root only once
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// For development: enable HMR
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    // Re-render the app when App.tsx changes
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}
