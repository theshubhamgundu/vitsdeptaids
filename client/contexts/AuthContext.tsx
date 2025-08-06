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
    const checkExistingSession = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const currentSessionId = sessionService.getCurrentSessionId();

        if (storedUser && currentSessionId) {
          const userData = JSON.parse(storedUser);

          // Validate the stored user data structure and session
          if (userData && userData.id && userData.role && userData.name) {
            // Check if session is still valid
            if (sessionService.validateSession(currentSessionId)) {
              setUser(userData);
            } else {
              // Session expired, clear local data
              localStorage.removeItem('currentUser');
              sessionService.removeSession(currentSessionId);
            }
          } else {
            // Invalid user data, clear it
            localStorage.removeItem('currentUser');
            if (currentSessionId) {
              sessionService.removeSession(currentSessionId);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
        const currentSessionId = sessionService.getCurrentSessionId();
        if (currentSessionId) {
          sessionService.removeSession(currentSessionId);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Clean up old sessions on app load
    sessionService.cleanupOldSessions();
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
