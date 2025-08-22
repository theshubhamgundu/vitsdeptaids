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

// Check if React root already exists on this container
const hasReactRoot = (element: HTMLElement): boolean => {
  // Check for React 18 internal fiber node properties
  const keys = Object.keys(element);
  return keys.some(key => 
    key.startsWith('__reactContainer') || 
    key.startsWith('_reactRootContainer') ||
    key.startsWith('__reactInternalInstance')
  );
};

// Store root instance to prevent multiple creation
let rootInstance: Root | null = null;

// Only create root if it doesn't exist
if (!hasReactRoot(container) && !rootInstance) {
  console.log("Creating new React root");
  rootInstance = createRoot(container);
} else if (rootInstance) {
  console.log("Reusing existing React root instance");
} else {
  console.log("React root already exists on container");
  // If root exists on container but we don't have instance, create new one
  // This handles HMR case where the module reloads but DOM wasn't cleared
  rootInstance = createRoot(container);
}

// Render the app
if (rootInstance) {
  rootInstance.render(<AppWithErrorBoundary />);
}

// For development: enable HMR
if (import.meta.hot && rootInstance) {
  import.meta.hot.accept("./App", () => {
    // Re-render using existing root
    if (rootInstance) {
      console.log("HMR: Re-rendering app");
      rootInstance.render(<AppWithErrorBoundary />);
    }
  });

  // Handle module disposal
  import.meta.hot.dispose(() => {
    console.log("HMR: Module disposing");
  });

  // Cleanup on page unload
  import.meta.hot.prune(() => {
    console.log("HMR: Pruning unused modules");
  });
}

// Set up global error handlers (only once)
if (typeof window !== 'undefined' && !(window as any).__ERROR_HANDLERS_SETUP__) {
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    event.preventDefault(); // Prevent default browser error handling
  });

  (window as any).__ERROR_HANDLERS_SETUP__ = true;
}
