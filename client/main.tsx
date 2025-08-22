import React from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// Ensure DOM is ready
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// App wrapper with error boundary
const AppWithErrorBoundary = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Check if root already exists on the container
const getOrCreateRoot = (container: HTMLElement): Root => {
  // Use a data attribute to track if root exists
  const existingRootId = container.getAttribute('data-react-root');
  
  if (existingRootId && (container as any).__reactRoot) {
    // Return existing root
    return (container as any).__reactRoot;
  } else {
    // Create new root and store reference
    const newRoot = createRoot(container);
    (container as any).__reactRoot = newRoot;
    container.setAttribute('data-react-root', 'true');
    return newRoot;
  }
};

// Get or create the root
const root = getOrCreateRoot(container);

// Render the app
root.render(<AppWithErrorBoundary />);

// For development: enable HMR
if (import.meta.hot) {
  import.meta.hot.accept("./App", () => {
    // Re-render using existing root
    root.render(<AppWithErrorBoundary />);
  });

  // Handle module disposal
  import.meta.hot.dispose(() => {
    console.log("HMR: Module reloading...");
  });
}

// Set up global error handlers (only once)
if (!window.__ERROR_HANDLERS_SETUP__) {
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    event.preventDefault(); // Prevent default browser error handling
  });

  (window as any).__ERROR_HANDLERS_SETUP__ = true;
}
