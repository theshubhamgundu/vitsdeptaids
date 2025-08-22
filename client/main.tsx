import React from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// Ensure DOM is ready
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// Global variable to store the root instance
declare global {
  var __REACT_ROOT__: Root | undefined;
}

// App wrapper with error boundary
const AppWithErrorBoundary = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Create React root only once using singleton pattern
let root: Root;

if (globalThis.__REACT_ROOT__) {
  // Reuse existing root (for HMR)
  root = globalThis.__REACT_ROOT__;
} else {
  // Create new root and store globally
  root = createRoot(container);
  globalThis.__REACT_ROOT__ = root;
}

// Render the app
root.render(<AppWithErrorBoundary />);

// For development: enable HMR
if (import.meta.hot) {
  import.meta.hot.accept("./App", () => {
    // Re-render using existing root
    root.render(<AppWithErrorBoundary />);
  });

  // Clean up on module disposal
  import.meta.hot.dispose(() => {
    // Don't unmount in development to preserve state
    console.log("HMR: Module disposed");
  });
}

// Handle global errors
if (!globalThis.__ERROR_HANDLERS_SETUP__) {
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
  });

  globalThis.__ERROR_HANDLERS_SETUP__ = true;
}
