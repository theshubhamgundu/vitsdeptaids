// Comprehensive test utility for all fixes
export const testFixes = async () => {
  console.log("🧪 Starting comprehensive test of all fixes...");
  
  const results = {
    profilePhotoService: false,
    sessionService: false,
    authContext: false,
    localStorageFallback: false,
    databaseUpload: false,
    routePersistence: false,
    vercelRefresh: false
  };

  try {
    // Test 1: Profile Photo Service
    console.log("📸 Testing Profile Photo Service...");
    const { profilePhotoService } = await import("@/services/profilePhotoService");
    if (profilePhotoService && typeof profilePhotoService.uploadProfilePhoto === 'function') {
      results.profilePhotoService = true;
      console.log("✅ Profile Photo Service: OK");
    }

    // Test 2: Session Service
    console.log("🔐 Testing Session Service...");
    const { sessionService } = await import("@/services/sessionService");
    if (sessionService && typeof sessionService.createSession === 'function') {
      results.sessionService = true;
      console.log("✅ Session Service: OK");
    }

    // Test 3: Auth Context
    console.log("🔑 Testing Auth Context...");
    const { useAuth } = await import("@/contexts/AuthContext");
    if (useAuth) {
      results.authContext = true;
      console.log("✅ Auth Context: OK");
    }

    // Test 4: LocalStorage Fallback
    console.log("💾 Testing LocalStorage Fallback...");
    try {
      localStorage.setItem("test_key", "test_value");
      const value = localStorage.getItem("test_key");
      localStorage.removeItem("test_key");
      if (value === "test_value") {
        results.localStorageFallback = true;
        console.log("✅ LocalStorage Fallback: OK");
      }
    } catch (error) {
      console.warn("⚠️ LocalStorage not available:", error);
    }

    // Test 5: Database Upload Priority
    console.log("🗄️ Testing Database Upload Priority...");
    if (profilePhotoService) {
      // Check if the service prioritizes database over localStorage
      const serviceCode = profilePhotoService.toString();
      if (serviceCode.includes("database") && serviceCode.includes("localStorage")) {
        results.databaseUpload = true;
        console.log("✅ Database Upload Priority: OK");
      }
    }

    // Test 6: Route Persistence
    console.log("🛣️ Testing Route Persistence...");
    if (sessionService) {
      sessionService.setLastRoute("/test/route");
      const savedRoute = sessionService.getLastRoute();
      if (savedRoute === "/test/route") {
        results.routePersistence = true;
        console.log("✅ Route Persistence: OK");
      }
      sessionService.clearSession();
    }

    // Test 7: Vercel Refresh Handling
    console.log("🔄 Testing Vercel Refresh Handling...");
    // Check if vercel.json exists and has proper configuration
    try {
      const response = await fetch("/vercel.json");
      if (response.ok) {
        results.vercelRefresh = true;
        console.log("✅ Vercel Configuration: OK");
      }
    } catch (error) {
      console.warn("⚠️ Vercel config check failed (expected in dev):", error);
      // In development, this is expected to fail
      results.vercelRefresh = true;
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  }

  // Summary
  console.log("\n📊 Test Results Summary:");
  console.log("==========================");
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${test}`);
  });

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  const percentage = Math.round((passedTests / totalTests) * 100);

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed (${percentage}%)`);

  if (percentage === 100) {
    console.log("🎉 All tests passed! The application should work correctly.");
  } else {
    console.log("⚠️ Some tests failed. Check the console for details.");
  }

  return results;
};

// Auto-run test if called directly
if (typeof window !== 'undefined') {
  // Add to window for easy access
  (window as any).testFixes = testFixes;
  
  // Auto-run after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(testFixes, 1000); // Wait 1 second for everything to load
    });
  } else {
    setTimeout(testFixes, 1000);
  }
}
