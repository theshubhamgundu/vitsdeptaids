import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/services/authService";
import { sessionService } from "@/services/sessionService";
import { notificationsService } from "@/services/notificationsService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  logoutAllDevices: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeYear = (raw: any): string | undefined => {
    if (raw === null || raw === undefined) return undefined;
    const text = String(raw).trim();
    if (!text) return undefined;
    const lower = text.toLowerCase();
    const roman: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8 };
    let n: number | null = null;
    if (!isNaN(Number(lower))) n = Number(lower);
    else if (roman[lower] != null) n = roman[lower];
    else if (lower.includes("year")) {
      const m = lower.match(/\d+/);
      if (m) n = Number(m[0]);
    }
    if (!n || n < 1) return text;
    const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
    return `${n}${suffix} Year`;
  };

  // Enhanced initialization with session service
  useEffect(() => {
    console.log("🔍 Checking for existing session...");

    try {
      // Try to get session from session service first
      const session = sessionService.getSession();
      
      if (session && sessionService.isSessionValid()) {
        console.log("✅ Found valid session for:", session.user.name);
        setUser(session.user);
        
        // Setup auto-refresh for the session (only once)
        if (!sessionService.isAutoRefreshSetup()) {
          sessionService.setupAutoRefresh();
        }
      } else {
        // Fallback to legacy localStorage check
        const existingUser = localStorage.getItem("currentUser");
        if (existingUser) {
          const userData = JSON.parse(existingUser);
          // Normalize year for students
          if ((userData.role || "").toLowerCase() === "student") {
            const normalizedYear = normalizeYear(userData.year);
            if (normalizedYear) userData.year = normalizedYear;
          }
          console.log("✅ Found existing user from localStorage:", userData.name);
          
          // Create new session from existing user data
          sessionService.createSession(userData);
          setUser(userData);
        } else {
          console.log("ℹ️ No existing session or user found");
        }
      }
    } catch (error) {
      console.warn("Failed to restore session:", error);
      sessionService.clearSession();
    }

    // Always set loading to false after check
    setIsLoading(false);
    console.log("✅ Auth initialization complete");
  }, []);

  const login = (userData: User) => {
    console.log("🔐 Logging in user:", userData.name);

    // Normalize year for students before persisting
    const normalized: User = { ...userData };
    if ((normalized.role || "").toLowerCase() === "student") {
      const ny = normalizeYear((normalized as any).year);
      if (ny) (normalized as any).year = ny;
    }

    // Set user immediately
    setUser(normalized);

    // Create session using session service
    sessionService.createSession(normalized);

    // Setup auto-refresh if not already setup
    if (!sessionService.isAutoRefreshSetup()) {
      sessionService.setupAutoRefresh();
    }

    // Ensure loading is false
    setIsLoading(false);

    console.log("✅ Login complete - user set and session created");

    // Register device for push notifications (best-effort)
    notificationsService
      .registerDevice({ id: userData.id, role: userData.role, name: userData.name })
      .then((res) => {
        if (res.success) {
          console.log("🔔 FCM token registered");
        } else {
          console.warn("🔕 FCM registration skipped:", res.error);
        }
      })
      .catch((e) => console.warn("FCM registration error:", e));
  };

  const logout = () => {
    console.log("🔐 Logging out user");

    setUser(null);
    
    // Clear session using session service
    sessionService.clearSession();

    console.log("✅ Logout complete - session cleared");
  };

  const logoutAllDevices = () => {
    console.log("🔐 Logging out all devices for user:", user?.name);
    if (user) {
      sessionService.logoutAllDevices(user.id);
      setUser(null); // Clear user after logout
      sessionService.clearSession(); // Clear session
      console.log("✅ All devices logged out for user:", user.name);
    } else {
      console.warn("No user logged in to log out all devices.");
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update session
      sessionService.updateSession(userData);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    logoutAllDevices,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
