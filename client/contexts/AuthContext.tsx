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
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
        // Clear any corrupted local data
        const currentSessionToken =
          databaseSessionService.getCurrentSessionToken();
        if (currentSessionToken) {
          await databaseSessionService.removeSession(currentSessionToken);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Clean up expired sessions on app load
    databaseSessionService.cleanupExpiredSessions();
    checkExistingSession();
  }, []);

  const login = async (userData: User) => {
    try {
      // Create a new database session
      const sessionToken = await databaseSessionService.createSession(userData);
      setUser(userData);
      console.log(
        `✅ Login successful. Session token created: ${sessionToken.slice(0, 20)}...`,
      );
    } catch (error) {
      console.error("Error creating session:", error);
      // Fallback to basic localStorage
      localStorage.setItem("currentUser", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = async () => {
    const currentSessionToken = databaseSessionService.getCurrentSessionToken();
    if (currentSessionToken) {
      await databaseSessionService.removeSession(currentSessionToken);
    }

    setUser(null);
    console.log("🔄 Logged out successfully");
  };

  const logoutAllDevices = async () => {
    if (user) {
      await databaseSessionService.removeAllUserSessions(user.id);
    }

    setUser(null);
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
