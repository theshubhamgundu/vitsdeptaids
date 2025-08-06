import { supabase, tables } from "@/lib/supabase";
import { User } from './authService';

interface DatabaseUserSession {
  id?: string;
  user_id: string;
  session_token: string;
  device_info: string;
  login_time: string;
  last_activity: string;
  is_active: boolean;
  expires_at: string;
  user_role: string;
}

// Generate a secure session token
const generateSessionToken = (): string => {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 16)}_${crypto.randomUUID()}`;
};

// Get device information for identification
const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform || 'Unknown';
  const language = navigator.language || 'Unknown';
  const screenRes = `${screen.width}x${screen.height}`;
  return `${platform}_${language}_${screenRes}_${userAgent.slice(0, 50)}`;
};

export const databaseSessionService = {
  // Create a new session in database
  createSession: async (user: User): Promise<string> => {
    try {
      const sessionToken = generateSessionToken();
      const deviceInfo = getDeviceInfo();
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

      const sessionData: DatabaseUserSession = {
        user_id: user.id,
        session_token: sessionToken,
        device_info: deviceInfo,
        login_time: now,
        last_activity: now,
        is_active: true,
        expires_at: expiresAt,
        user_role: user.role,
      };

      // Check if Supabase is available
      if (!supabase) {
        console.warn("Database not available, falling back to localStorage");
        // Fallback to localStorage
        localStorage.setItem('currentSessionToken', sessionToken);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return sessionToken;
      }

      // Insert session into database
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) {
        console.error("Error creating database session:", error);
        // Fallback to localStorage
        localStorage.setItem('currentSessionToken', sessionToken);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return sessionToken;
      }

      // Store session token locally for quick access
      localStorage.setItem('currentSessionToken', sessionToken);
      localStorage.setItem('currentUser', JSON.stringify(user));

      console.log("✅ Database session created successfully");
      return sessionToken;
    } catch (error) {
      console.error("Error in createSession:", error);
      // Fallback to localStorage
      const fallbackToken = generateSessionToken();
      localStorage.setItem('currentSessionToken', fallbackToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return fallbackToken;
    }
  },

  // Validate session from database
  validateSession: async (sessionToken: string): Promise<{ isValid: boolean; user?: User }> => {
    try {
      if (!sessionToken) {
        return { isValid: false };
      }

      // Check if Supabase is available
      if (!supabase) {
        console.warn("Database not available, checking localStorage");
        const storedToken = localStorage.getItem('currentSessionToken');
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedToken === sessionToken && storedUser) {
          return { 
            isValid: true, 
            user: JSON.parse(storedUser) 
          };
        }
        return { isValid: false };
      }

      // Check database
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single();

      if (error || !session) {
        console.warn("Session not found in database, checking localStorage");
        // Fallback to localStorage check
        const storedToken = localStorage.getItem('currentSessionToken');
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedToken === sessionToken && storedUser) {
          return { 
            isValid: true, 
            user: JSON.parse(storedUser) 
          };
        }
        return { isValid: false };
      }

      // Check if session has expired
      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      
      if (now > expiresAt) {
        // Session expired, deactivate it
        await databaseSessionService.removeSession(sessionToken);
        return { isValid: false };
      }

      // Update last activity
      await supabase
        .from('user_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('session_token', sessionToken);

      // Get user data based on role and user_id
      let userData: User | null = null;

      if (session.user_role === 'student') {
        // Check localStorage first for students
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const localUser = localUsers.find((u: any) => u.id === session.user_id);
        
        if (localUser) {
          userData = {
            id: localUser.id,
            name: localUser.name,
            role: 'student',
            hallTicket: localUser.hallTicket,
            email: localUser.email,
          };
        } else {
          // Check students table
          const studentsTable = tables.students();
          if (studentsTable) {
            const { data: student } = await studentsTable
              .select("*")
              .eq("id", session.user_id)
              .single();

            if (student) {
              userData = {
                id: student.id,
                name: student.name,
                role: 'student',
                hallTicket: student.hall_ticket,
                email: student.email,
              };
            }
          }
        }
      } else {
        // For faculty/admin/hod
        const facultyTable = tables.faculty();
        if (facultyTable) {
          const { data: faculty } = await facultyTable
            .select("*")
            .eq("id", session.user_id)
            .single();

          if (faculty) {
            userData = {
              id: faculty.id,
              name: faculty.name,
              role: faculty.role,
              facultyId: faculty.faculty_id,
              email: faculty.email,
            };
          }
        }
      }

      if (!userData) {
        return { isValid: false };
      }

      // Update localStorage with fresh user data
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return { isValid: true, user: userData };
    } catch (error) {
      console.error("Error validating session:", error);
      // Fallback to localStorage
      const storedToken = localStorage.getItem('currentSessionToken');
      const storedUser = localStorage.getItem('currentUser');
      
      if (storedToken === sessionToken && storedUser) {
        return { 
          isValid: true, 
          user: JSON.parse(storedUser) 
        };
      }
      return { isValid: false };
    }
  },

  // Remove session from database
  removeSession: async (sessionToken: string): Promise<void> => {
    try {
      if (!sessionToken) return;

      // Remove from database if available
      if (supabase) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('session_token', sessionToken);
      }

      // Remove from localStorage
      const storedToken = localStorage.getItem('currentSessionToken');
      if (storedToken === sessionToken) {
        localStorage.removeItem('currentSessionToken');
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error("Error removing session:", error);
      // Still remove from localStorage
      localStorage.removeItem('currentSessionToken');
      localStorage.removeItem('currentUser');
    }
  },

  // Get current session token
  getCurrentSessionToken: (): string | null => {
    return localStorage.getItem('currentSessionToken');
  },

  // Remove all sessions for a user
  removeAllUserSessions: async (userId: string): Promise<void> => {
    try {
      if (supabase) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', userId);
      }

      // Clear localStorage
      localStorage.removeItem('currentSessionToken');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error("Error removing all user sessions:", error);
      // Still clear localStorage
      localStorage.removeItem('currentSessionToken');
      localStorage.removeItem('currentUser');
    }
  },

  // Get user sessions (for admin/security purposes)
  getUserSessions: async (userId: string): Promise<DatabaseUserSession[]> => {
    try {
      if (!supabase) {
        return [];
      }

      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) {
        console.error("Error fetching user sessions:", error);
        return [];
      }

      return sessions || [];
    } catch (error) {
      console.error("Error in getUserSessions:", error);
      return [];
    }
  },

  // Cleanup expired sessions
  cleanupExpiredSessions: async (): Promise<void> => {
    try {
      if (!supabase) {
        return;
      }

      const now = new Date().toISOString();
      
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .lt('expires_at', now);

      console.log("✅ Expired sessions cleaned up");
    } catch (error) {
      console.error("Error cleaning up expired sessions:", error);
    }
  },
};

export default databaseSessionService;
