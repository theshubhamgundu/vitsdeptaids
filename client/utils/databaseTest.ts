import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const testDatabaseConnection = async () => {
  console.log("Testing database connection...");
  
  if (!isSupabaseConfigured) {
    console.error("❌ Supabase environment variables not configured");
    return false;
  }
  
  console.log("✅ Supabase environment variables configured");
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('student_data').select('count').limit(1);
    
    if (error) {
      console.error("❌ Database connection failed:", error.message);
      
      // Check if table doesn't exist
      if (error.code === 'PGRST116' || error.message.includes('relation "student_data" does not exist')) {
        console.log("📋 The student_data table doesn't exist yet. Please run the SQL scripts:");
        console.log("1. CREATE_STUDENT_DATA_TABLE.sql");
        console.log("2. UPDATE_USER_PROFILES_TABLE.sql");
        return false;
      }
      
      return false;
    }
    
    console.log("✅ Database connection successful");
    console.log("📊 Student data table accessible");
    return true;
    
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return false;
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  testDatabaseConnection();
}
