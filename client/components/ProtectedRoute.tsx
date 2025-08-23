import React, { useEffect, useState } from 'react';
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
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Set a timeout for loading state to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.warn("⚠️ Loading timeout reached in ProtectedRoute");
        setLoadingTimeout(true);
      }, 2000); // 2 second timeout

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("🔍 ProtectedRoute state:", { isLoading, isAuthenticated, user: user?.name });

  // Show loading state only briefly
  if (isLoading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-xs text-gray-400 mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log("🔄 Redirecting to login - not authenticated");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role permissions if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("🔄 Redirecting due to role mismatch:", user.role, "not in", allowedRoles);
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

  console.log("✅ ProtectedRoute allowing access for:", user.name, user.role);
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
