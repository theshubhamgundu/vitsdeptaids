import { createClient } from "@supabase/supabase-js";

// Supabase configuration with actual database credentials
const supabaseUrl = "https://plthigkzjkcxunifsptr.supabase.co";
const supabaseAnonKey = "sb_publishable_Fycw0l0nn80UBgrO75xcZg_kdA5-3Nl";

// Check if Supabase is configured and key is valid
const isKeyValid = (key: string) => {
  if (!key) return false;
  // Simple check - if key starts with 'sb_' it's a valid Supabase key
  return key.startsWith('sb_');
};

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  isKeyValid(supabaseAnonKey)
);

// Debug logging
console.log('🔧 Supabase Configuration Debug:');
console.log('URL:', supabaseUrl);
console.log('Key valid:', isKeyValid(supabaseAnonKey));
console.log('Configured:', isSupabaseConfigured);

// Create Supabase client only if environment variables are available
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Helper functions for common operations (with null checks)
export const auth = supabase?.auth || null;
export const storage = supabase?.storage || null;

// Database table helpers with null checks and error handling
export const tables = {
  userProfiles: () => {
    try {
      return supabase?.from("user_profiles") || null;
    } catch (error) {
      console.warn("user_profiles table not available:", error);
      return null;
    }
  },
  students: () => {
    try {
      return supabase?.from("students") || null;
    } catch (error) {
      console.warn("students table not available:", error);
      return null;
    }
  },
  studentsList: () => {
    try {
      return supabase?.from("student_data") || null;
    } catch (error) {
      console.warn("student_data table not available:", error);
      return null;
    }
  },
  faculty: () => {
    try {
      return supabase?.from("faculty") || null;
    } catch (error) {
      console.warn("faculty table not available:", error);
      return null;
    }
  },
  courses: () => {
    try {
      return supabase?.from("courses") || null;
    } catch (error) {
      console.warn("courses table not available:", error);
      return null;
    }
  },
  enrollments: () => {
    try {
      return supabase?.from("enrollments") || null;
    } catch (error) {
      console.warn("enrollments table not available:", error);
      return null;
    }
  },
  results: () => {
    try {
      return supabase?.from("results") || null;
    } catch (error) {
      console.warn("results table not available:", error);
      return null;
    }
  },
  attendance: () => {
    try {
      return supabase?.from("attendance") || null;
    } catch (error) {
      console.warn("attendance table not available:", error);
      return null;
    }
  },
  leaveApplications: () => {
    try {
      return supabase?.from("leave_applications") || null;
    } catch (error) {
      console.warn("leave_applications table not available:", error);
      return null;
    }
  },
  studyMaterials: () => {
    try {
      return supabase?.from("study_materials") || null;
    } catch (error) {
      console.warn("study_materials table not available:", error);
      return null;
    }
  },
  timetables: () => {
    try {
      return supabase?.from("timetables") || null;
    } catch (error) {
      console.warn("timetables table not available:", error);
      return null;
    }
  },
  notifications: () => {
    try {
      return supabase?.from("notifications") || null;
    } catch (error) {
      console.warn("notifications table not available:", error);
      return null;
    }
  },
  time_slots: () => {
    try {
      return supabase?.from("time_slots") || null;
    } catch (error) {
      console.warn("time_slots table not available:", error);
      return null;
    }
  },
  messages: () => {
    try {
      return supabase?.from("messages") || null;
    } catch (error) {
      console.warn("messages table not available:", error);
      return null;
    }
  },
  // New faculty assignment tables
  facultyAssignments: () => {
    try {
      return supabase?.from("faculty_assignments") || null;
    } catch (error) {
      console.warn("faculty_assignments table not available:", error);
      return null;
    }
  },
  studentCounsellorAssignments: () => {
    try {
      return supabase?.from("student_counsellor_assignments") || null;
    } catch (error) {
      console.warn("student_counsellor_assignments table not available:", error);
      return null;
    }
  },
  // Expose supabase client for RPC calls
  supabase: () => supabase,
};

// Storage bucket helpers with null checks and error handling
export const buckets = {
  profiles: async () => {
    try {
      // Use a single, consistent bucket name for profile photos
      const BUCKET_NAME = "avatars";
      let bucket = storage?.from(BUCKET_NAME);
      if (!bucket) {
        console.log("🔄 Profiles bucket not found, attempting to create...", BUCKET_NAME);
        try {
          await storage?.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
            fileSizeLimit: 5242880, // 5MB
          });
          bucket = storage?.from(BUCKET_NAME);
          console.log("✅ Profiles bucket created successfully");
        } catch (createError) {
          console.warn("⚠️ Could not create profiles bucket:", createError);
          return null;
        }
      }
      return bucket;
    } catch (error) {
      console.warn("profiles bucket not available:", error);
      return null;
    }
  },
  documents: async () => {
    try {
      let bucket = storage?.from("documents");
      if (!bucket) {
        console.log("🔄 Documents bucket not found, attempting to create...");
        try {
          await storage?.createBucket("documents", { public: true });
          bucket = storage?.from("documents");
          console.log("✅ Documents bucket created successfully");
        } catch (createError) {
          console.warn("⚠️ Could not create documents bucket:", createError);
          return null;
        }
      }
      return bucket;
    } catch (error) {
      console.warn("documents bucket not available:", error);
      return null;
    }
  },
  materials: async () => {
    try {
      let bucket = storage?.from("materials");
      if (!bucket) {
        console.log("🔄 Materials bucket not found, attempting to create...");
        try {
          await storage?.createBucket("materials", { public: true });
          bucket = storage?.from("materials");
          console.log("✅ Materials bucket created successfully");
        } catch (createError) {
          console.warn("⚠️ Could not create materials bucket:", createError);
          return null;
        }
      }
      return bucket;
    } catch (error) {
      console.warn("materials bucket not available:", error);
      return null;
    }
  },
  timetables: async () => {
    try {
      let bucket = storage?.from("timetables");
      if (!bucket) {
        console.log("🔄 Timetables bucket not found, attempting to create...");
        try {
          await storage?.createBucket("timetables", { public: true });
          bucket = storage?.from("timetables");
          console.log("✅ Timetables bucket created successfully");
        } catch (createError) {
          console.warn("⚠️ Could not create timetables bucket:", createError);
          return null;
        }
      }
      return bucket;
    } catch (error) {
      console.warn("timetables bucket not available:", error);
      return null;
    }
  },
};

// Authentication helpers with null checks
export const authHelpers = {
  // Sign up a new user
  signUp: async (email: string, password: string, userData: any) => {
    if (!auth)
      return { data: null, error: { message: "Supabase not configured" } };
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    if (!auth)
      return { data: null, error: { message: "Supabase not configured" } };
    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out user
  signOut: async () => {
    if (!auth) return { error: { message: "Supabase not configured" } };
    const { error } = await auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    if (!auth)
      return { user: null, error: { message: "Supabase not configured" } };
    const {
      data: { user },
      error,
    } = await auth.getUser();
    return { user, error };
  },

  // Get user profile with role
  getUserProfile: async (userId: string) => {
    const userProfilesTable = tables.userProfiles();
    if (!userProfilesTable)
      return { data: null, error: { message: "Supabase not configured" } };
    const { data, error } = await userProfilesTable
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },
};

// File upload helpers
export const fileHelpers = {
  // Upload profile photo
  uploadProfilePhoto: async (userId: string, file: File) => {
    try {
      console.log("📤 Starting profile photo upload for user:", userId);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/profile.${fileExt}`;
      
      console.log("📁 Upload path:", fileName);

      // Check if storage is available
      if (!storage) {
        console.warn("⚠️ Supabase storage not available");
        return { data: null, error: { message: "Storage not configured" } };
      }

      // Check if profiles bucket exists
      const profilesBucket = await buckets.profiles();
      if (!profilesBucket) {
        console.warn("⚠️ Profiles bucket not available, using fallback");
        // Graceful fallback: skip storage and let caller save data URI in DB/local cache
        return { data: null, error: { message: "bucket-missing" } };
      }

      console.log("✅ Storage accessible, uploading file...");

      const { data, error } = await profilesBucket.upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

      if (error) {
        console.error("❌ Upload failed:", error);
        return { data: null, error };
      }

      console.log("✅ Upload successful, getting public URL...");

      // Get public URL
      const {
        data: { publicUrl },
      } = profilesBucket.getPublicUrl(fileName);

      console.log("✅ Public URL generated:", publicUrl);

      return { data: { ...data, publicUrl }, error: null };
    } catch (error) {
      console.error("❌ Unexpected error in uploadProfilePhoto:", error);
      return { data: null, error };
    }
  },

  // Upload document
  uploadDocument: async (
    userId: string,
    file: File,
    folder: string = "general",
  ) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

    const bucket = await buckets.documents();
    if (!bucket) return { data: null, error: { message: "Documents bucket not configured" } };

    const { data, error } = await bucket.upload(fileName, file, {
      cacheControl: "3600",
    });

    if (error) return { data: null, error };

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(fileName);

    return { data: { ...data, publicUrl }, error: null };
  },

  // Upload study material
  uploadStudyMaterial: async (courseId: string, file: File, title: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${courseId}/${Date.now()}-${title}.${fileExt}`;

    const bucket = await buckets.materials();
    if (!bucket) return { data: null, error: { message: "Materials bucket not configured" } };

    const { data, error } = await bucket.upload(fileName, file, {
      cacheControl: "3600",
    });

    if (error) return { data: null, error };

    // Get public URL
    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(fileName);

    return { data: { ...data, publicUrl }, error: null };
  },
};

// Real-time subscription helpers
export const realtimeHelpers = {
  // Subscribe to table changes
  subscribeToTable: (tableName: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`${tableName}_changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        callback,
      )
      .subscribe();
  },

  // Subscribe to user-specific notifications
  subscribeToUserNotifications: (
    userId: string,
    callback: (payload: any) => void,
  ) => {
    return supabase
      .channel("user_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe();
  },
};

// Data validation helpers
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  },

  hallTicket: (hallTicket: string) => {
    const hallTicketRegex = /^\d{2}[A-Z]{2,4}\d{3}$/;
    return hallTicketRegex.test(hallTicket);
  },

  employeeId: (employeeId: string) => {
    const employeeIdRegex = /^VIT-[A-Z]{2,4}-\d{3}$/;
    return employeeIdRegex.test(employeeId);
  },
};

export default supabase;
