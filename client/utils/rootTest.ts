import React from "react";

// Utility to test React root creation and detect potential issues

export const testReactRoot = () => {
  const container = document.getElementById("root");
  
  if (!container) {
    console.error("❌ Root container not found");
    return false;
  }

  console.log("🔍 React Root Test:");
  console.log("📦 Container:", container);
  console.log("📝 Container HTML:", container.innerHTML.length > 0 ? "Has content" : "Empty");
  
  // Check for React fiber properties
  const keys = Object.keys(container);
  const reactKeys = keys.filter(key => 
    key.startsWith('__react') || 
    key.startsWith('_react')
  );
  
  console.log("🔧 React keys on container:", reactKeys);
  
  // Check if global root exists
  if ((window as any).__REACT_ROOT__) {
    console.log("✅ Global React root found");
  } else {
    console.log("⚠️ No global React root reference");
  }

  // Check React version
  const reactVersion = React?.version || "Unknown";
  console.log("⚛️ React version:", reactVersion);

  return true;
};

// Auto-run in development
if (import.meta.env.DEV) {
  // Run test after a short delay to allow React to initialize
  setTimeout(() => {
    testReactRoot();
  }, 1000);
}
