import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { profileService } from "@/services/profileService";
import { getCounsellorForStudent } from "@/services/facultyAssignmentService";
import {
  User,
  Award,
  BarChart3,
  Calendar,
  BookOpen,
  Clock,
  FileText,
  Plane,
  Bell,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserCheck,
} from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  role: string;
  hallTicket: string;
  email: string;
  year: string;
  section: string;
}

interface StudentStats {
  certificates: number;
  pendingApplications: number;
  attendance: number;
  cgpa: number;
}

const StudentDashboard = () => {
  // Normalize student year display (e.g., 3 -> "3rd Year")
  const formatYear = (yearValue: any): string => {
    if (!yearValue && yearValue !== 0) return "";
    const raw = String(yearValue).toLowerCase().trim();
    const mapRoman: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8 };
    let n: number | null = null;
    if (!isNaN(Number(raw))) {
      n = Number(raw);
    } else if (mapRoman[raw] != null) {
      n = mapRoman[raw];
    } else if (raw.includes("year")) {
      const digits = raw.match(/\d+/);
      if (digits) n = Number(digits[0]);
    }
    if (!n || n < 1) return raw.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
    const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
    return `${n}${suffix} Year`;
  };
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [stats, setStats] = useState<StudentStats>({
    certificates: 0,
    pendingApplications: 0,
    attendance: 0,
    cgpa: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [counsellorInfo, setCounsellorInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get current user from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      if (!currentUser.id) {
        console.error("No user session found");
        return;
      }

      setStudentData(currentUser);

      // Load real statistics
      const studentStats = await profileService.getStudentStats(currentUser.id);
      setStats(studentStats);

      // Load recent activities
      const activities = await profileService.getRecentActivities(currentUser.id);
      setRecentActivities(activities);

      // Load upcoming events
      const events = await profileService.getUpcomingEvents();
      setUpcomingEvents(events);

      // Load counsellor information
      if (currentUser.hallTicket) {
        const counsellor = await getCounsellorForStudent(currentUser.hallTicket);
        setCounsellorInfo(counsellor);
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      
      // Set default empty state on error
      setStats({
        certificates: 0,
        pendingApplications: 0,
        attendance: 0,
        cgpa: 0,
      });
      setRecentActivities([]);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      title: "Overall CGPA",
      value: stats.cgpa > 0 ? stats.cgpa.toFixed(2) : "N/A",
      description: stats.cgpa > 0 ? "Current CGPA" : "No data available",
      icon: TrendingUp,
      color: stats.cgpa >= 7 ? "text-green-600" : stats.cgpa > 0 ? "text-yellow-600" : "text-gray-500",
      bgColor: stats.cgpa >= 7 ? "bg-green-50" : stats.cgpa > 0 ? "bg-yellow-50" : "bg-gray-50",
    },
    {
      title: "Attendance",
      value: stats.attendance > 0 ? `${stats.attendance}%` : "N/A",
      description: stats.attendance > 0 ? "This semester" : "No data available",
      icon: Calendar,
      color: stats.attendance >= 75 ? "text-green-600" : stats.attendance > 0 ? "text-red-600" : "text-gray-500",
      bgColor: stats.attendance >= 75 ? "bg-green-50" : stats.attendance > 0 ? "bg-red-50" : "bg-gray-50",
    },
    {
      title: "Certificates",
      value: stats.certificates.toString(),
      description: stats.certificates > 0 ? "Uploaded certificates" : "No certificates uploaded",
      icon: Award,
      color: stats.certificates > 0 ? "text-blue-600" : "text-gray-500",
      bgColor: stats.certificates > 0 ? "bg-blue-50" : "bg-gray-50",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications.toString(),
      description: stats.pendingApplications > 0 ? "Awaiting approval" : "No pending requests",
      icon: FileText,
      color: stats.pendingApplications > 0 ? "text-orange-600" : "text-gray-500",
      bgColor: stats.pendingApplications > 0 ? "bg-orange-50" : "bg-gray-50",
    },
  ];

  const quickActions = [
    {
      title: "View Profile",
      description: "Update personal information",
      link: "/dashboard/student/profile",
      icon: User,
      color: "bg-blue-600",
    },
    {
      title: "Upload Certificate",
      description: "Add new achievements",
      link: "/dashboard/student/certificates",
      icon: Award,
      color: "bg-green-600",
    },
    {
      title: "Check Results",
      description: "View academic performance",
      link: "/dashboard/student/results",
      icon: BarChart3,
      color: "bg-purple-600",
    },
    {
      title: "Apply for Leave",
      description: "Submit leave application",
      link: "/dashboard/student/leave",
      icon: Plane,
      color: "bg-orange-600",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!studentData) {
    return (
      <DashboardLayout userType="student" userName="Error">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">Session expired. Please login again.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student" userName={studentData.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {studentData.name}!
              </h1>
              <p className="text-blue-100">
                {studentData.hallTicket} • {formatYear(studentData.year)} • AI & DS
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Counsellor Information */}
        {counsellorInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Academic Counsellor</span>
              </CardTitle>
              <CardDescription>Your assigned academic counsellor for guidance and support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{counsellorInfo.faculty?.name || "Not Assigned"}</h3>
                  <p className="text-sm text-gray-600">{counsellorInfo.faculty?.designation || ""}</p>
                  <p className="text-sm text-gray-500">{counsellorInfo.faculty?.email || ""}</p>
                  <p className="text-xs text-gray-400">Specialization: {counsellorInfo.faculty?.specialization || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simplified dashboard: remove extra sections as requested */}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
