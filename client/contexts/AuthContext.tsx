import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const currentSessionToken =
          databaseSessionService.getCurrentSessionToken();

        if (currentSessionToken) {
          // Validate session with database
          const validation =
            await databaseSessionService.validateSession(currentSessionToken);

          if (validation.isValid && validation.user) {
            setUser(validation.user);
            console.log("✅ Session restored successfully");
          } else {
            // Session invalid, clear local data
            await databaseSessionService.removeSession(currentSessionToken);
            console.log("🔄 Session expired, cleared local data");
          }
        } else {
          // Check for legacy localStorage user data
          const legacyUser = localStorage.getItem("currentUser");
          if (legacyUser) {
            try {
              const userData = JSON.parse(legacyUser);
              setUser(userData);
              console.log("✅ Legacy session restored");
            } catch (error) {
              console.warn("Failed to parse legacy user data:", error);
              localStorage.removeItem("currentUser");
            }
          }
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
        // Clear any corrupted local data
        const currentSessionToken =
          databaseSessionService.getCurrentSessionToken();
        if (currentSessionToken) {
          await databaseSessionService.removeSession(currentSessionToken);
        }

        // Check for basic localStorage user data as fallback
        try {
          const fallbackUser = localStorage.getItem("currentUser");
          if (fallbackUser) {
            const userData = JSON.parse(fallbackUser);
            setUser(userData);
            console.log("✅ Fallback session restored from localStorage");
          }
        } catch (fallbackError) {
          console.warn("Fallback session restore failed:", fallbackError);
          localStorage.removeItem("currentUser");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Clean up expired sessions on app load (don't wait for this)
    databaseSessionService.cleanupExpiredSessions().catch((error) => {
      console.warn("Session cleanup failed:", error);
    });

    checkExistingSession();
  }, []);

  const login = async (userData: User) => {
    try {
      // Always set user data immediately for better UX
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Try to create a database session (but don't fail if it doesn't work)
      try {
        const sessionToken =
          await databaseSessionService.createSession(userData);
        console.log(
          `✅ Login successful. Session token created: ${sessionToken.slice(0, 20)}...`,
        );
      } catch (sessionError) {
        console.warn(
          "Database session creation failed, using localStorage fallback:",
          sessionError,
        );
        // Session creation failed, but user is still logged in via localStorage
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Even if database operations fail, we still want to log the user in
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      console.log("✅ Login successful (localStorage fallback)");
    }
  };

  const logout = async () => {
    try {
      const currentSessionToken =
        databaseSessionService.getCurrentSessionToken();
      if (currentSessionToken) {
        await databaseSessionService.removeSession(currentSessionToken);
      }
    } catch (error) {
      console.warn("Error removing database session:", error);
    }

    // Always clear local state regardless of database operations
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionToken");
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
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionToken");
    console.log("🔄 Logged out from all devices");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
