import { createClient } from '@supabase/supabase-js';

// These environment variables will be set in Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});

// Helper functions for common operations
export const auth = supabase.auth;
export const storage = supabase.storage;

// Database table helpers
export const tables = {
  userProfiles: () => supabase.from('user_profiles'),
  students: () => supabase.from('students'),
  faculty: () => supabase.from('faculty'),
  courses: () => supabase.from('courses'),
  enrollments: () => supabase.from('enrollments'),
  results: () => supabase.from('results'),
  attendance: () => supabase.from('attendance'),
  leaveApplications: () => supabase.from('leave_applications'),
  studyMaterials: () => supabase.from('study_materials'),
  timetables: () => supabase.from('timetables'),
  notifications: () => supabase.from('notifications')
};

// Storage bucket helpers
export const buckets = {
  profiles: () => storage.from('profiles'),
  documents: () => storage.from('documents'),
  materials: () => storage.from('materials'),
  timetables: () => storage.from('timetables')
};

// Authentication helpers
export const authHelpers = {
  // Sign up a new user
  signUp: async (email: string, password: string, userData: any) => {
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
    const { data, error } = await auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  signOut: async () => {
    const { error } = await auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await auth.getUser();
    return { user, error };
  },

  // Get user profile with role
  getUserProfile: async (userId: string) => {
    const { data, error } = await tables.userProfiles()
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
