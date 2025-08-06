import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/authService';
import { databaseSessionService } from '@/services/databaseSessionService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  logoutAllDevices: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasMultipleSessions: boolean;
  currentSessionId: string | null;
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
        const currentSessionToken = databaseSessionService.getCurrentSessionToken();

        if (currentSessionToken) {
          // Validate session with database
          const validation = await databaseSessionService.validateSession(currentSessionToken);

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
        console.error('Error checking existing session:', error);
        // Clear any corrupted local data
        const currentSessionToken = databaseSessionService.getCurrentSessionToken();
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


  const login = (userData: User) => {
    try {
      // Create a new session for this device
      const sessionId = sessionService.createSession(userData);

      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);

      console.log(`Login successful. Session ID: ${sessionId}`);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const logout = () => {
    const currentSessionId = sessionService.getCurrentSessionId();
    if (currentSessionId) {
      sessionService.removeSession(currentSessionId);
    }

    localStorage.removeItem('currentUser');
    localStorage.removeItem('localUsers'); // Clear any locally stored user registrations if needed
    setUser(null);
  };

  const logoutAllDevices = () => {
    if (user) {
      sessionService.removeAllUserSessions(user.id);
    }

    localStorage.removeItem('currentUser');
    localStorage.removeItem('localUsers');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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
    hasMultipleSessions: user ? sessionService.hasMultipleSessions(user.id) : false,
    currentSessionId: sessionService.getCurrentSessionId(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
