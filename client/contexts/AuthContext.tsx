import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { User } from "@/services/authService";
import { databaseSessionService } from "@/services/databaseSessionService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  currentSessionToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Global state to persist across HMR
if (typeof window !== "undefined") {
  // @ts-ignore
  window.__AUTH_STATE__ = window.__AUTH_STATE__ || {
    user: null,
    isLoading: true,
    initializationComplete: false,
  };
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize from global state to survive HMR
  const globalState = typeof window !== "undefined" ? (window as any).__AUTH_STATE__ : { user: null, isLoading: true, initializationComplete: false };
  
  const [user, setUser] = useState<User | null>(globalState.user);
  const [isLoading, setIsLoading] = useState(globalState.isLoading);
  const isMountedRef = useRef(true);
  const initializationCompleteRef = useRef(globalState.initializationComplete);

  // Update global state when local state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__AUTH_STATE__ = {
        user,
        isLoading,
        initializationComplete: initializationCompleteRef.current,
      };
    }
  }, [user, isLoading]);

  // Safe state setter that checks if component is still mounted
  const safeSetUser = (userData: User | null) => {
    if (isMountedRef.current) {
      console.log("🔧 Setting user:", userData ? `${userData.name} (${userData.role})` : "null");
      setUser(userData);
    }
  };

  const safeSetLoading = (loading: boolean) => {
    if (isMountedRef.current) {
      console.log("🔧 Setting loading:", loading);
      setIsLoading(loading);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Check for existing session on app load (only run once)
  useEffect(() => {
    // Skip if already initialized (prevents HMR re-runs)
    if (initializationCompleteRef.current) {
      console.log("🔄 Auth already initialized, skipping...");
      return;
    }

    let loadingTimeoutId: NodeJS.Timeout;

    const checkExistingSession = async () => {
      console.log("🔍 Checking existing session...");
      
      try {
        const currentSessionToken = databaseSessionService.getCurrentSessionToken();

        if (currentSessionToken && isMountedRef.current) {
          // Validate session with database
          const validation = await databaseSessionService.validateSession(currentSessionToken);

          if (isMountedRef.current) {
            if (validation.isValid && validation.user) {
              safeSetUser(validation.user);
              console.log("✅ Session restored successfully");
            } else {
              // Session invalid, clear local data
              await databaseSessionService.removeSession(currentSessionToken);
              console.log("🔄 Session expired, cleared local data");
            }
          }
        } else if (isMountedRef.current) {
          // Check for legacy localStorage user data
          const legacyUser = localStorage.getItem("currentUser");
          if (legacyUser) {
            try {
              const userData = JSON.parse(legacyUser);
              safeSetUser(userData);
              console.log("✅ Legacy session restored");
            } catch (error) {
              console.warn("Failed to parse legacy user data:", error);
              localStorage.removeItem("currentUser");
            }
          }
        }
      } catch (error) {
        console.error("Error checking existing session:", error);

        if (isMountedRef.current) {
          // Clear any corrupted local data
          const currentSessionToken = databaseSessionService.getCurrentSessionToken();
          if (currentSessionToken) {
            await databaseSessionService.removeSession(currentSessionToken);
          }

          // Check for basic localStorage user data as fallback
          try {
            const fallbackUser = localStorage.getItem("currentUser");
            if (fallbackUser) {
              const userData = JSON.parse(fallbackUser);
              safeSetUser(userData);
              console.log("✅ Fallback session restored from localStorage");
            }
          } catch (fallbackError) {
            console.warn("Fallback session restore failed:", fallbackError);
            localStorage.removeItem("currentUser");
          }
        }
      } finally {
        // Mark initialization as complete and set loading to false
        if (isMountedRef.current) {
          initializationCompleteRef.current = true;
          safeSetLoading(false);
          console.log("✅ Auth initialization complete");
        }
      }
    };

    // Set a maximum timeout for loading state (fallback safety)
    loadingTimeoutId = setTimeout(() => {
      if (isMountedRef.current && !initializationCompleteRef.current) {
        console.warn("⚠️ Loading timeout reached, forcing initialization complete");
        initializationCompleteRef.current = true;
        safeSetLoading(false);
      }
    }, 3000); // 3 second maximum loading time

    // Clean up expired sessions on app load (don't wait for this)
    databaseSessionService.cleanupExpiredSessions().catch((error) => {
      console.warn("Session cleanup failed:", error);
    });

    checkExistingSession();

    return () => {
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
      }
    };
  }, []); // Empty dependency array to run only once

  const login = async (userData: User) => {
    console.log("🔐 Starting login process for:", userData.name);
    
    try {
      // Mark initialization as complete to prevent conflicts
      initializationCompleteRef.current = true;
      
      // Always set user data immediately for better UX
      safeSetUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      
      // Ensure loading is set to false after login
      safeSetLoading(false);
      
      console.log("✅ User authenticated and loading state cleared");

      // Try to create a database session (but don't fail if it doesn't work)
      try {
        const sessionToken = await databaseSessionService.createSession(userData);
        console.log(`✅ Login successful. Session token created: ${sessionToken.slice(0, 20)}...`);
      } catch (sessionError) {
        console.warn("Database session creation failed, using localStorage fallback:", sessionError);
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Even if database operations fail, we still want to log the user in
      if (isMountedRef.current) {
        initializationCompleteRef.current = true;
        safeSetUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        safeSetLoading(false);
        console.log("✅ Login successful (localStorage fallback)");
      }
    }
  };

  const logout = async () => {
    console.log("🔐 Starting logout process");
    
    try {
      const currentSessionToken = databaseSessionService.getCurrentSessionToken();
      if (currentSessionToken) {
        await databaseSessionService.removeSession(currentSessionToken);
      }
    } catch (error) {
      console.warn("Error removing database session:", error);
    }

    // Always clear local state regardless of database operations
    if (isMountedRef.current) {
      safeSetUser(null);
      initializationCompleteRef.current = false; // Reset initialization state
    }
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionToken");
    
    // Clear global state
    if (typeof window !== "undefined") {
      (window as any).__AUTH_STATE__ = {
        user: null,
        isLoading: true,
        initializationComplete: false,
      };
    }
    
    console.log("🔄 Logged out successfully");
  };

  const logoutAllDevices = async () => {
    try {
      if (user) {
        await databaseSessionService.removeAllUserSessions(user.id);
      }
    } catch (error) {
      console.warn("Error removing all sessions:", error);
    }

    // Always clear local state
    if (isMountedRef.current) {
      safeSetUser(null);
      initializationCompleteRef.current = false; // Reset initialization state
    }
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionToken");
    
    // Clear global state
    if (typeof window !== "undefined") {
      (window as any).__AUTH_STATE__ = {
        user: null,
        isLoading: true,
        initializationComplete: false,
      };
    }
    
    console.log("🔄 Logged out from all devices");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user && isMountedRef.current) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      safeSetUser(updatedUser);
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
    currentSessionToken: databaseSessionService.getCurrentSessionToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export named function to be HMR-compatible
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Named exports for better HMR compatibility
export { AuthProvider, useAuth };
export type { AuthContextType };
