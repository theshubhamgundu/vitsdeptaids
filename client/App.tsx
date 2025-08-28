import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import {
  StudentRoute,
  FacultyRoute,
  AdminRoute,
  HODRoute,
  FacultyHODRoute,
} from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import DemoLogins from "./components/DemoLogins";

// Dashboard Pages
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import StudentProfile from "./pages/dashboard/student/StudentProfile";
import StudentCertificates from "./pages/dashboard/student/StudentCertificates";
import StudentResults from "./pages/dashboard/student/StudentResults";
import StudentAttendance from "./pages/dashboard/student/StudentAttendance";
import StudentMaterials from "./pages/dashboard/student/StudentMaterials";
import StudentTimetable from "./pages/dashboard/student/StudentTimetable";
import StudentLeave from "./pages/dashboard/student/StudentLeave";
import StudentFees from "./pages/dashboard/student/StudentFees";

import FacultyDashboard from "./pages/dashboard/faculty/FacultyDashboard";
import FacultyProfile from "./pages/dashboard/faculty/FacultyProfile";
import FacultyStudents from "./pages/dashboard/faculty/FacultyStudents";
import FacultyMaterials from "./pages/dashboard/faculty/FacultyMaterials";
import FacultyResults from "./pages/dashboard/faculty/FacultyResults";
import FacultyMessages from "./pages/dashboard/faculty/FacultyMessages";
import FacultyLeave from "./pages/dashboard/faculty/FacultyLeave";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import AdminProfile from "./pages/dashboard/admin/AdminProfile";
import AdminStudents from "./pages/dashboard/admin/AdminStudents";
import AdminFaculty from "./pages/dashboard/admin/AdminFaculty";
import AdminContent from "./pages/dashboard/admin/AdminContent";
import AdminTools from "./pages/dashboard/admin/AdminTools";
import FacultyAssignments from "./pages/dashboard/admin/FacultyAssignments";
import SimpleTimetableCreator from "./pages/dashboard/admin/SimpleTimetableCreator";

import HODDashboard from "./pages/dashboard/hod/HODDashboard";
import HODProfile from "./pages/dashboard/hod/HODProfile";
import HODStudents from "./pages/dashboard/hod/HODStudents";
import HODFacultyLeaves from "./pages/dashboard/hod/HODFacultyLeaves";
import HODMessages from "./pages/dashboard/hod/HODMessages";
import HODTimetables from "./pages/dashboard/hod/HODTimetables";
import HODAnalytics from "./pages/dashboard/hod/HODAnalytics";
import HODMaterials from "./pages/dashboard/hod/HODMaterials";

import PlaceholderPage from "./pages/PlaceholderPage";
import StudentRegistration from "./pages/StudentRegistration";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login/:type" element={<LoginPage />} />
            <Route path="/register/student" element={<StudentRegistration />} />
            <Route path="/demo-logins" element={<DemoLogins />} />

            {/* Student Dashboard Routes */}
            <Route
              path="/dashboard/student"
              element={
                <StudentRoute>
                  <StudentDashboard />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/profile"
              element={
                <StudentRoute>
                  <StudentProfile />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/certificates"
              element={
                <StudentRoute>
                  <StudentCertificates />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/results"
              element={
                <StudentRoute>
                  <StudentResults />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/attendance"
              element={
                <StudentRoute>
                  <StudentAttendance />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/materials"
              element={
                <StudentRoute>
                  <StudentMaterials />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/timetable"
              element={
                <StudentRoute>
                  <StudentTimetable />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/leave"
              element={
                <StudentRoute>
                  <StudentLeave />
                </StudentRoute>
              }
            />
            <Route
              path="/dashboard/student/fees"
              element={
                <StudentRoute>
                  <StudentFees />
                </StudentRoute>
              }
            />

            {/* Faculty Dashboard Routes */}
            <Route
              path="/dashboard/faculty"
              element={
                <FacultyRoute>
                  <FacultyDashboard />
                </FacultyRoute>
              }
            />
            <Route
              path="/dashboard/faculty/profile"
              element={
                <FacultyRoute>
                  <FacultyProfile />
                </FacultyRoute>
              }
            />
            <Route
              path="/dashboard/faculty/students"
              element={
                <FacultyRoute>
                  <FacultyStudents />
                </FacultyRoute>
              }
            />
            <Route
              path="/dashboard/faculty/materials"
              element={
                <FacultyRoute>
                  <FacultyMaterials />
                </FacultyRoute>
              }
            />
            <Route
              path="/dashboard/faculty/results"
              element={
                <FacultyRoute>
                  <FacultyResults />
                </FacultyRoute>
              }
            />
            <Route
              path="/dashboard/faculty/messages"
              element={
                <FacultyRoute>
                  <FacultyMessages />
                </FacultyRoute>
              }
            />
            <Route
              path="/dashboard/faculty/leave"
              element={
                <FacultyRoute>
                  <FacultyLeave />
                </FacultyRoute>
              }
            />

            {/* Admin Dashboard Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/admin/profile"
              element={
                <AdminRoute>
                  <AdminProfile />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/admin/students"
              element={
                <AdminRoute>
                  <AdminStudents />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/admin/faculty"
              element={
                <AdminRoute>
                  <AdminFaculty />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/admin/timetable-creator"
              element={
                <AdminRoute>
                  <SimpleTimetableCreator />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/admin/content"
              element={
                <AdminRoute>
                  <AdminContent />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/admin/tools"
              element={
                <AdminRoute>
                  <AdminTools />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/admin/faculty-assignments"
              element={
                <AdminRoute>
                  <FacultyAssignments />
                </AdminRoute>
              }
            />

            {/* HOD Dashboard Routes */}
            <Route
              path="/dashboard/hod"
              element={
                <HODRoute>
                  <HODDashboard />
                </HODRoute>
              }
            />
            <Route
              path="/secret/hod"
              element={
                <HODRoute>
                  <HODDashboard />
                </HODRoute>
              }
            />
            <Route
              path="/dashboard/hod/profile"
              element={
                <HODRoute>
                  <HODProfile />
                </HODRoute>
              }
            />
            <Route
              path="/dashboard/hod/students"
              element={
                <HODRoute>
                  <HODStudents />
                </HODRoute>
              }
            />
            <Route
              path="/dashboard/hod/faculty-leaves"
              element={
                <HODRoute>
                  <HODFacultyLeaves />
                </HODRoute>
              }
            />
            <Route
              path="/dashboard/hod/messages"
              element={
                <HODRoute>
                  <HODMessages />
                </HODRoute>
              }
            />
            <Route
              path="/dashboard/hod/timetables"
              element={
                <HODRoute>
                  <HODTimetables />
                </HODRoute>
              }
            />
            <Route
              path="/dashboard/hod/materials"
              element={
                <HODRoute>
                  <HODMaterials />
                </HODRoute>
              }
            />

            {/* Placeholder routes for future implementation */}
            <Route
              path="/about"
              element={<PlaceholderPage title="About Department" />}
            />
            <Route
              path="/admissions"
              element={<PlaceholderPage title="Admissions" />}
            />
            <Route
              path="/research"
              element={<PlaceholderPage title="Research" />}
            />
            <Route
              path="/placements"
              element={<PlaceholderPage title="Placements" />}
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
