// Simple verification of Supabase credentials
import { createClient } from "@supabase/supabase-js";

export const verifySupabaseCredentials = async () => {
  const url = "https://kncqarmijdchduwkrani.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuY3Fhcm1pamRjaGR1d2tyYW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NzY4MDEsImV4cCI6MjA1MTE1MjgwMX0.SShpQfnqGjwdOUWp9Q5lnhJCQXNhVwqw_iZOk4Rau7A";

  console.log("🔍 Verifying Supabase credentials...");
  console.log("🌐 URL:", url);
  console.log("🔑 Key (first 50 chars):", key.substring(0, 50) + "...");

  // Validate key format
  if (!key.startsWith('eyJ') || !key.includes('.')) {
    console.error("❌ Invalid anon key format - key should be a JWT token");
    return false;
  }

  // Check for common issues
  const cleanKey = key.trim().replace(/\s+/g, '');
  if (cleanKey !== key) {
    console.warn("⚠️ Key contains whitespace - using cleaned version");
  }

  try {
    const supabase = createClient(url, cleanKey);

    // Try a simple query that should always work
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Auth session check failed:", error.message);
      return false;
    }

    console.log("✅ Auth session check successful");

    // Try to list tables (this will tell us if the connection works)
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .limit(1);

    if (tablesError) {
      console.log(
        "⚠️ Tables query failed (this is expected if RLS is strict):",
        tablesError.message,
      );

      // Try a simpler test - just attempt to connect to a known table
      const { data: testData, error: testError } = await supabase
        .from("student_data")
        .select("count")
        .limit(1);

      if (testError) {
        if (
          testError.message.includes('relation "student_data" does not exist')
        ) {
          console.log(
            "📋 Database accessible but student_data table doesn't exist",
          );
          console.log(
            "💡 You need to run the SQL scripts to create the tables",
          );
          return true; // Connection works, just missing tables
        } else {
          console.error("❌ Test query failed:", testError.message);
          return false;
        }
      } else {
        console.log("✅ student_data table accessible");
        return true;
      }
    } else {
      console.log("✅ Full database access confirmed");
      return true;
    }
  } catch (error) {
    console.error("❌ Verification failed:", error);
    return false;
  }
};

// Auto-run in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    verifySupabaseCredentials();
  }, 1000);
}
