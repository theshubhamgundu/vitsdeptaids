import React from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// Import diagnostic utility in development
if (import.meta.env.DEV) {
  import("./utils/rootTest").catch(() => {
    console.log("Root test utility not available");
  });
}

// Get DOM container
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// Clear any existing content to prevent conflicts
if (container.innerHTML) {
  console.log("🧹 Clearing existing container content");
  container.innerHTML = '';
}

// App wrapper with error boundary
const AppWithErrorBoundary = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Create root - this will only run once per module load
console.log("🚀 Creating React root for container");
const root = createRoot(container);

// Initial render
console.log("🎨 Initial render");
root.render(<AppWithErrorBoundary />);

// Handle HMR for development
if (import.meta.hot) {
  import.meta.hot.accept("./App", () => {
    console.log("🔄 HMR: App module updated, re-rendering");
    root.render(<AppWithErrorBoundary />);
  });

  // Cleanup on disposal
  import.meta.hot.dispose(() => {
    console.log("🗑️ HMR: Disposing main module");
  });
}

// Global error handling
window.addEventListener("error", (event) => {
  console.error("💥 Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("💥 Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

// Export for debugging
if (import.meta.env.DEV) {
  (window as any).__REACT_ROOT__ = root;
  console.log("🐛 Debug: React root exported to window.__REACT_ROOT__");
}
