import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const testDatabaseConnection = async () => {
  console.log("🔍 Testing database connection...");

  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log(
    "🌐 Supabase URL:",
    supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "❌ Not set",
  );
  console.log(
    "🔑 Anon Key:",
    supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "❌ Not set",
  );

  if (!isSupabaseConfigured) {
    console.error("❌ Supabase environment variables not configured");
    console.log("💡 Make sure these environment variables are set:");
    console.log(
      "   VITE_SUPABASE_URL=https://kncqarmijdchduwkrani.supabase.co",
    );
    console.log(
      "   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    );
    return false;
  }

  console.log("✅ Supabase environment variables configured");

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("student_data")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Database connection failed:", error.message);
      console.error("🔍 Error details:", error);

      // Check specific error types
      if (error.message.includes("Invalid API key")) {
        console.log("🔑 API Key Issue - Please check:");
        console.log("   1. The anon key is correct");
        console.log("   2. The Supabase project is active");
        console.log("   3. RLS policies allow anonymous access");
        return false;
      }

      if (
        error.code === "PGRST116" ||
        error.message.includes('relation "student_data" does not exist')
      ) {
        console.log(
          "📋 The student_data table doesn't exist yet. Please run the SQL scripts:",
        );
        console.log("   1. CREATE_STUDENT_DATA_TABLE.sql");
        console.log("   2. UPDATE_USER_PROFILES_TABLE.sql");
        return false;
      }

      return false;
    }

    console.log("✅ Database connection successful");
    console.log("📊 Student data table accessible");
    return true;
  } catch (error) {
    console.error("❌ Unexpected error:", error);

    if (error.message && error.message.includes("Headers")) {
      console.error("🔑 Headers Error - Anon key appears to be corrupted");
      console.log(
        "💡 The system will use local fallback for student validation",
      );
      console.log("🔧 To fix this properly:");
      console.log("   1. Go to your Supabase dashboard");
      console.log("   2. Get a fresh anon key from Settings → API");
      console.log("   3. Update your environment variables");
    }

    return false;
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  testDatabaseConnection();
}
