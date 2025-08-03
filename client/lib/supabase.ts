import { createClient } from '@supabase/supabase-js';

// These environment variables will be set in Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create Supabase client only if environment variables are available
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

// Helper functions for common operations (with null checks)
export const auth = supabase?.auth || null;
export const storage = supabase?.storage || null;

// Database table helpers with null checks
export const tables = {
  userProfiles: () => supabase?.from('user_profiles') || null,
  students: () => supabase?.from('students') || null,
  faculty: () => supabase?.from('faculty') || null,
  courses: () => supabase?.from('courses') || null,
  enrollments: () => supabase?.from('enrollments') || null,
  results: () => supabase?.from('results') || null,
  attendance: () => supabase?.from('attendance') || null,
  leaveApplications: () => supabase?.from('leave_applications') || null,
  studyMaterials: () => supabase?.from('study_materials') || null,
  timetables: () => supabase?.from('timetables') || null,
  notifications: () => supabase?.from('notifications') || null,
  time_slots: () => supabase?.from('time_slots') || null,
  messages: () => supabase?.from('messages') || null
};

// Storage bucket helpers with null checks
export const buckets = {
  profiles: () => storage?.from('profiles') || null,
  documents: () => storage?.from('documents') || null,
  materials: () => storage?.from('materials') || null,
  timetables: () => storage?.from('timetables') || null
};

// Authentication helpers with null checks
export const authHelpers = {
  // Sign up a new user
  signUp: async (email: string, password: string, userData: any) => {
    if (!auth) return { data: null, error: { message: 'Supabase not configured' } };
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    if (!auth) return { data: null, error: { message: 'Supabase not configured' } };
    const { data, error } = await auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  signOut: async () => {
    if (!auth) return { error: { message: 'Supabase not configured' } };
    const { error } = await auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    if (!auth) return { user: null, error: { message: 'Supabase not configured' } };
    const { data: { user }, error } = await auth.getUser();
    return { user, error };
  },

  // Get user profile with role
  getUserProfile: async (userId: string) => {
    const userProfilesTable = tables.userProfiles();
    if (!userProfilesTable) return { data: null, error: { message: 'Supabase not configured' } };
    const { data, error } = await userProfilesTable
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }
};

// File upload helpers
export const fileHelpers = {
  // Upload profile photo
  uploadProfilePhoto: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;
    
    const { data, error } = await buckets.profiles()
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) return { data: null, error };
    
    // Get public URL
    const { data: { publicUrl } } = buckets.profiles()
      .getPublicUrl(fileName);
    
    return { data: { ...data, publicUrl }, error: null };
  },

  // Upload document
  uploadDocument: async (userId: string, file: File, folder: string = 'general') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await buckets.documents()
      .upload(fileName, file, {
        cacheControl: '3600'
      });
    
    return { data, error };
  },

  // Upload study material
  uploadStudyMaterial: async (courseId: string, file: File, title: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${courseId}/${Date.now()}-${title}.${fileExt}`;
    
    const { data, error } = await buckets.materials()
      .upload(fileName, file, {
        cacheControl: '3600'
      });
    
    if (error) return { data: null, error };
    
    // Get public URL
    const { data: { publicUrl } } = buckets.materials()
      .getPublicUrl(fileName);
    
    return { data: { ...data, publicUrl }, error: null };
  }
};

// Real-time subscription helpers
export const realtimeHelpers = {
  // Subscribe to table changes
  subscribeToTable: (tableName: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`${tableName}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: tableName }, 
        callback
      )
      .subscribe();
  },

  // Subscribe to user-specific notifications
  subscribeToUserNotifications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('user_notifications')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
};

// Data validation helpers
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  hallTicket: (hallTicket: string) => {
    const hallTicketRegex = /^\d{2}[A-Z]{2,4}\d{3}$/;
    return hallTicketRegex.test(hallTicket);
  },

  employeeId: (employeeId: string) => {
    const employeeIdRegex = /^VIT-[A-Z]{2,4}-\d{3}$/;
    return employeeIdRegex.test(employeeId);
  }
};

export default supabase;
