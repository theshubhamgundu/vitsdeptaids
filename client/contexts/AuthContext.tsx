import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/services/authService";
import { sessionService } from "@/services/sessionService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced initialization with session service
  useEffect(() => {
    console.log("🔍 Checking for existing session...");

    try {
      // Try to get session from session service first
      const session = sessionService.getSession();
      
      if (session && sessionService.isSessionValid()) {
        console.log("✅ Found valid session for:", session.user.name);
        setUser(session.user);
        
        // Setup auto-refresh for the session
        const cleanup = sessionService.setupAutoRefresh();
        
        // Return cleanup function
        return cleanup;
      } else {
        // Fallback to legacy localStorage check
        const existingUser = localStorage.getItem("currentUser");
        if (existingUser) {
          const userData = JSON.parse(existingUser);
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

    // Set user immediately
    setUser(userData);

    // Create session using session service
    sessionService.createSession(userData);

    // Ensure loading is false
    setIsLoading(false);

    console.log("✅ Login complete - user set and session created");
  };

  const logout = () => {
    console.log("🔐 Logging out user");

    setUser(null);
    
    // Clear session using session service
    sessionService.clearSession();

    console.log("✅ Logout complete - session cleared");
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
