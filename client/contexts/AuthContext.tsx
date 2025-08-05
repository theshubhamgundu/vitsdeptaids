import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/authService';

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

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Validate the stored user data structure
          if (userData && userData.id && userData.role && userData.name) {
            setUser(userData);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = (userData: User) => {
    try {
      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('localUsers'); // Clear any locally stored user registrations if needed
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
    updateUser,
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
