import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileWrapper from './ProfileWrapper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login/student'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role permissions if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const roleDashboardMap: Record<string, string> = {
      student: '/dashboard/student',
      faculty: '/dashboard/faculty',
      admin: '/dashboard/admin',
      hod: '/dashboard/hod',
    };

    const userDashboard = roleDashboardMap[user.role] || '/';
    return <Navigate to={userDashboard} replace />;
  }

  return <ProfileWrapper>{children}</ProfileWrapper>;
};

// Helper component for role-specific routes
export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['student']} redirectTo="/login/student">
    {children}
  </ProtectedRoute>
);

export const FacultyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['faculty']} redirectTo="/login/faculty">
    {children}
  </ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']} redirectTo="/login/admin">
    {children}
  </ProtectedRoute>
);

export const HODRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['hod']} redirectTo="/login/faculty">
    {children}
  </ProtectedRoute>
);

// Combined route for faculty and HOD
export const FacultyHODRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['faculty', 'hod']} redirectTo="/login/faculty">
    {children}
  </ProtectedRoute>
);
