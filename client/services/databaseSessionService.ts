import { supabase, tables } from "@/lib/supabase";
import { User } from "./authService";

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
  const platform = navigator.platform || "Unknown";
  const language = navigator.language || "Unknown";
  const screenRes = `${screen.width}x${screen.height}`;
  return `${platform}_${language}_${screenRes}_${userAgent.slice(0, 50)}`;
};

// Helper function to extract error message
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.error_description) return error.error_description;
  if (error?.details) return error.details;
  if (error?.hint) return error.hint;
  return JSON.stringify(error);
};

export const databaseSessionService = {
  // Create a new session in database
  createSession: async (user: User): Promise<string> => {
    const sessionToken = generateSessionToken();

    try {
      const deviceInfo = getDeviceInfo();
      const now = new Date().toISOString();
      const expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(); // 30 days

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
        console.log("📱 Database not available, using localStorage session");
        localStorage.setItem("currentSessionToken", sessionToken);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return sessionToken;
      }

      // Try to insert session into database
      try {
        const { data, error } = await supabase
          .from("user_sessions")
          .insert([sessionData])
          .select()
          .single();

        if (error) {
          // Check if it's a table not found error
          if (
            error.code === "PGRST116" ||
            error.message?.includes('relation "user_sessions" does not exist')
          ) {
            console.warn(
              "⚠️ user_sessions table not found, using localStorage fallback",
            );
            console.log(
              "💡 To enable database sessions, run USER_SESSIONS_TABLE.sql in Supabase",
            );
          } else {
            console.warn(
              "⚠️ Database session creation failed:",
              getErrorMessage(error),
            );
            console.warn("🔧 Error details:", {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            });
          }

          // Always fallback to localStorage
          localStorage.setItem("currentSessionToken", sessionToken);
          localStorage.setItem("currentUser", JSON.stringify(user));
          return sessionToken;
        }

        // Success! Store session token locally for quick access
        localStorage.setItem("currentSessionToken", sessionToken);
        localStorage.setItem("currentUser", JSON.stringify(user));

        console.log("✅ Database session created successfully");
        return sessionToken;
      } catch (dbError) {
        console.warn("⚠️ Database insert failed:", getErrorMessage(dbError));
        // Fallback to localStorage
        localStorage.setItem("currentSessionToken", sessionToken);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return sessionToken;
      }
    } catch (error) {
      console.warn("⚠️ Session creation error:", getErrorMessage(error));
      // Always provide a fallback session
      localStorage.setItem("currentSessionToken", sessionToken);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return sessionToken;
    }
  },

  // Validate session from database
  validateSession: async (
    sessionToken: string,
  ): Promise<{ isValid: boolean; user?: User }> => {
    try {
      if (!sessionToken) {
        return { isValid: false };
      }

      // Check if Supabase is available
      if (!supabase) {
        console.log("📱 Database not available, checking localStorage");
        const storedToken = localStorage.getItem("currentSessionToken");
        const storedUser = localStorage.getItem("currentUser");

        if (storedToken === sessionToken && storedUser) {
          try {
            return {
              isValid: true,
              user: JSON.parse(storedUser),
            };
          } catch (parseError) {
            console.warn("Failed to parse stored user data:", parseError);
            return { isValid: false };
          }
        }
        return { isValid: false };
      }

      // Try to check database
      try {
        const { data: session, error } = await supabase
          .from("user_sessions")
          .select("*")
          .eq("session_token", sessionToken)
          .eq("is_active", true)
          .single();

        if (error) {
          if (
            error.code === "PGRST116" ||
            error.message?.includes('relation "user_sessions" does not exist')
          ) {
            console.log(
              "📱 user_sessions table not found, checking localStorage",
            );
          } else {
            console.warn("Session validation error:", getErrorMessage(error));
          }

          // Fallback to localStorage check
          const storedToken = localStorage.getItem("currentSessionToken");
          const storedUser = localStorage.getItem("currentUser");

          if (storedToken === sessionToken && storedUser) {
            try {
              return {
                isValid: true,
                user: JSON.parse(storedUser),
              };
            } catch (parseError) {
              console.warn("Failed to parse stored user data:", parseError);
              return { isValid: false };
            }
          }
          return { isValid: false };
        }

        if (!session) {
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

        // Update last activity (don't wait for this)
        supabase
          .from("user_sessions")
          .update({ last_activity: new Date().toISOString() })
          .eq("session_token", sessionToken)
          .then()
          .catch((err) =>
            console.warn(
              "Failed to update last activity:",
              getErrorMessage(err),
            ),
          );

        // Get user data based on role and user_id
        let userData: User | null = null;

        if (session.user_role === "student") {
          // Check localStorage first for students
          const localUsers = JSON.parse(
            localStorage.getItem("localUsers") || "[]",
          );
          const localUser = localUsers.find(
            (u: any) => u.id === session.user_id,
          );

          if (localUser) {
            userData = {
              id: localUser.id,
              name: localUser.name,
              role: "student",
              hallTicket: localUser.hallTicket,
              email: localUser.email,
            };
          } else {
            // Check students table
            const studentsTable = tables.students();
            if (studentsTable) {
              try {
                const { data: student } = await studentsTable
                  .select("*")
                  .eq("id", session.user_id)
                  .single();

                if (student) {
                  userData = {
                    id: student.id,
                    name: student.name,
                    role: "student",
                    hallTicket: student.hall_ticket,
                    email: student.email,
                  };
                }
              } catch (studentError) {
                console.warn(
                  "Failed to fetch student data:",
                  getErrorMessage(studentError),
                );
              }
            }
          }
        } else {
          // For faculty/admin/hod
          const facultyTable = tables.faculty();
          if (facultyTable) {
            try {
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
            } catch (facultyError) {
              console.warn(
                "Failed to fetch faculty data:",
                getErrorMessage(facultyError),
              );
            }
          }
        }

        if (!userData) {
          return { isValid: false };
        }

        // Update localStorage with fresh user data
        localStorage.setItem("currentUser", JSON.stringify(userData));

        return { isValid: true, user: userData };
      } catch (dbError) {
        console.warn(
          "Database session validation failed:",
          getErrorMessage(dbError),
        );
        // Fallback to localStorage
        const storedToken = localStorage.getItem("currentSessionToken");
        const storedUser = localStorage.getItem("currentUser");

        if (storedToken === sessionToken && storedUser) {
          try {
            return {
              isValid: true,
              user: JSON.parse(storedUser),
            };
          } catch (parseError) {
            console.warn("Failed to parse stored user data:", parseError);
            return { isValid: false };
          }
        }
        return { isValid: false };
      }
    } catch (error) {
      console.warn("Session validation error:", getErrorMessage(error));
      return { isValid: false };
    }
  },

  // Remove session from database
  removeSession: async (sessionToken: string): Promise<void> => {
    try {
      if (!sessionToken) return;

      // Remove from database if available
      if (supabase) {
        try {
          await supabase
            .from("user_sessions")
            .update({ is_active: false })
            .eq("session_token", sessionToken);
        } catch (dbError) {
          console.warn(
            "Failed to deactivate database session:",
            getErrorMessage(dbError),
          );
        }
      }

      // Always remove from localStorage
      const storedToken = localStorage.getItem("currentSessionToken");
      if (storedToken === sessionToken) {
        localStorage.removeItem("currentSessionToken");
        localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.warn("Error removing session:", getErrorMessage(error));
      // Still remove from localStorage
      localStorage.removeItem("currentSessionToken");
      localStorage.removeItem("currentUser");
    }
  },

  // Get current session token
  getCurrentSessionToken: (): string | null => {
    return localStorage.getItem("currentSessionToken");
  },

  // Remove all sessions for a user
  removeAllUserSessions: async (userId: string): Promise<void> => {
    try {
      if (supabase) {
        try {
          await supabase
            .from("user_sessions")
            .update({ is_active: false })
            .eq("user_id", userId);
        } catch (dbError) {
          console.warn(
            "Failed to remove database sessions:",
            getErrorMessage(dbError),
          );
        }
      }

      // Always clear localStorage
      localStorage.removeItem("currentSessionToken");
      localStorage.removeItem("currentUser");
    } catch (error) {
      console.warn("Error removing all user sessions:", getErrorMessage(error));
      // Still clear localStorage
      localStorage.removeItem("currentSessionToken");
      localStorage.removeItem("currentUser");
    }
  },

  // Get user sessions (for admin/security purposes)
  getUserSessions: async (userId: string): Promise<DatabaseUserSession[]> => {
    try {
      if (!supabase) {
        return [];
      }

      const { data: sessions, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("last_activity", { ascending: false });

      if (error) {
        console.warn("Error fetching user sessions:", getErrorMessage(error));
        return [];
      }

      return sessions || [];
    } catch (error) {
      console.warn("Error in getUserSessions:", getErrorMessage(error));
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
        .from("user_sessions")
        .update({ is_active: false })
        .lt("expires_at", now);

      console.log("✅ Expired sessions cleaned up");
    } catch (error) {
      console.warn(
        "Error cleaning up expired sessions:",
        getErrorMessage(error),
      );
    }
  },
};

export default databaseSessionService;
