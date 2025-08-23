import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/services/authService";

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

  // Simple initialization - check localStorage for existing user
  useEffect(() => {
    console.log("🔍 Checking for existing user...");
    
    try {
      const existingUser = localStorage.getItem("currentUser");
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        console.log("✅ Found existing user:", userData.name);
        setUser(userData);
      } else {
        console.log("ℹ️ No existing user found");
      }
    } catch (error) {
      console.warn("Failed to parse existing user data:", error);
      localStorage.removeItem("currentUser");
    }
    
    // Always set loading to false after check
    setIsLoading(false);
    console.log("✅ Auth initialization complete");
  }, []);

  const login = (userData: User) => {
    console.log("🔐 Logging in user:", userData.name);
    
    // Set user immediately
    setUser(userData);
    
    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(userData));
    
    // Ensure loading is false
    setIsLoading(false);
    
    console.log("✅ Login complete - user set and loading disabled");
  };

  const logout = () => {
    console.log("🔐 Logging out user");
    
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionToken");
    
    console.log("✅ Logout complete");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
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
