import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import AdminStudents from "./pages/dashboard/admin/AdminStudents";
import AdminFaculty from "./pages/dashboard/admin/AdminFaculty";
import AdminContent from "./pages/dashboard/admin/AdminContent";
import AdminTools from "./pages/dashboard/admin/AdminTools";

import HODDashboard from "./pages/dashboard/hod/HODDashboard";
import HODProfile from "./pages/dashboard/hod/HODProfile";
import HODStudents from "./pages/dashboard/hod/HODStudents";
import HODFacultyLeaves from "./pages/dashboard/hod/HODFacultyLeaves";
import HODAnalytics from "./pages/dashboard/hod/HODAnalytics";

import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login/:type" element={<LoginPage />} />
          <Route path="/demo-logins" element={<DemoLogins />} />

          {/* Student Dashboard Routes */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/profile" element={<StudentProfile />} />
          <Route path="/dashboard/student/certificates" element={<StudentCertificates />} />
          <Route path="/dashboard/student/results" element={<StudentResults />} />
          <Route path="/dashboard/student/attendance" element={<StudentAttendance />} />
          <Route path="/dashboard/student/materials" element={<StudentMaterials />} />
          <Route path="/dashboard/student/timetable" element={<StudentTimetable />} />
          <Route path="/dashboard/student/leave" element={<StudentLeave />} />
          <Route path="/dashboard/student/fees" element={<StudentFees />} />

          {/* Faculty Dashboard Routes */}
          <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
          <Route path="/dashboard/faculty/profile" element={<FacultyProfile />} />
          <Route path="/dashboard/faculty/students" element={<FacultyStudents />} />
          <Route path="/dashboard/faculty/materials" element={<FacultyMaterials />} />
          <Route path="/dashboard/faculty/results" element={<FacultyResults />} />
          <Route path="/dashboard/faculty/messages" element={<FacultyMessages />} />
          <Route path="/dashboard/faculty/leave" element={<FacultyLeave />} />

          {/* Admin Dashboard Routes */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/students" element={<AdminStudents />} />
          <Route path="/dashboard/admin/faculty" element={<AdminFaculty />} />
          <Route path="/dashboard/admin/content" element={<AdminContent />} />

          {/* HOD Dashboard Routes */}
          <Route path="/dashboard/hod" element={<HODDashboard />} />
          <Route path="/secret/hod" element={<HODDashboard />} />
          <Route path="/dashboard/hod/profile" element={<HODProfile />} />
          <Route path="/dashboard/hod/students" element={<HODStudents />} />
          <Route path="/dashboard/hod/faculty-leaves" element={<HODFacultyLeaves />} />
          <Route path="/dashboard/hod/analytics" element={<HODAnalytics />} />

          {/* Placeholder routes for future implementation */}
          <Route path="/about" element={<PlaceholderPage title="About Department" />} />
          <Route path="/admissions" element={<PlaceholderPage title="Admissions" />} />
          <Route path="/research" element={<PlaceholderPage title="Research" />} />
          <Route path="/placements" element={<PlaceholderPage title="Placements" />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
