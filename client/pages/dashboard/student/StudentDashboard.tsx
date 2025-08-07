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
import ProfileCompletion from "@/components/ProfileCompletion";
import {
  getStudentCertificates,
  getStudentResults,
  getStudentAttendance,
  getStudentLeaveApplications,
  subscribeToStudentData,
} from "@/services/studentDataService";
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

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [certificates, setCertificates] = useState([]);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setStudentData(currentUser);

    // Check if profile completion is required
    if (currentUser.id) {
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const userProfile = localUsers.find((u: any) => u.id === currentUser.id);

      // Check if profile is completed
      const isProfileComplete = userProfile?.profileCompleted ||
        (userProfile?.phone && userProfile?.address && userProfile?.fatherName &&
         userProfile?.motherName && userProfile?.dateOfBirth && userProfile?.emergencyContact);

      if (!isProfileComplete) {
        setShowProfileCompletion(true);
        return;
      }
    }

    if (currentUser.id) {
      loadStudentData(currentUser.id);
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStudentData(() => {
      if (currentUser.id) {
        loadStudentData(currentUser.id);
      }
    });

    return unsubscribe;
  }, []);

  const loadStudentData = async (studentId: string) => {
    try {
      setLoading(true);
      const [certsData, resultsData, attendanceData, leavesData] =
        await Promise.all([
          getStudentCertificates(studentId),
          getStudentResults(studentId),
          getStudentAttendance(studentId),
          getStudentLeaveApplications(studentId),
        ]);

      setCertificates(certsData);
      setResults(resultsData);
      setAttendance(attendanceData);
      setLeaveApplications(leavesData);
    } catch (error) {
      console.error("Error loading student data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current CGPA from results
  const calculateCGPA = () => {
    if (results.length === 0) return "N/A";
    const totalMarks = results.reduce(
      (sum: number, result: any) => sum + result.marks,
      0,
    );
    const avgMarks = totalMarks / results.length;
    // Convert marks to CGPA (assuming 10-point scale)
    const cgpa = (avgMarks / 100) * 10;
    return cgpa.toFixed(2);
  };

  // Calculate attendance percentage
  const calculateAttendance = () => {
    if (attendance.length === 0) return "N/A";
    const presentCount = attendance.filter(
      (record: any) => record.status === "present",
    ).length;
    const percentage = (presentCount / attendance.length) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  // Stats based on real data
  const quickStats = [
    {
      title: "Overall CGPA",
      value: calculateCGPA(),
      description:
        results.length > 0
          ? `Based on ${results.length} subjects`
          : "No results available",
      icon: TrendingUp,
      color: results.length > 0 ? "text-blue-600" : "text-gray-500",
      bgColor: results.length > 0 ? "bg-blue-50" : "bg-gray-50",
    },
    {
      title: "Attendance",
      value: calculateAttendance(),
      description:
        attendance.length > 0
          ? `${attendance.length} records`
          : "No attendance data",
      icon: Calendar,
      color: attendance.length > 0 ? "text-green-600" : "text-gray-500",
      bgColor: attendance.length > 0 ? "bg-green-50" : "bg-gray-50",
    },
    {
      title: "Certificates",
      value: certificates.length.toString(),
      description:
        certificates.length > 0
          ? `${certificates.filter((c: any) => c.status === "approved").length} approved`
          : "No certificates uploaded",
      icon: Award,
      color: certificates.length > 0 ? "text-purple-600" : "text-gray-500",
      bgColor: certificates.length > 0 ? "bg-purple-50" : "bg-gray-50",
    },
    {
      title: "Pending Applications",
      value: leaveApplications
        .filter((app: any) => app.status === "pending")
        .length.toString(),
      description:
        leaveApplications.length > 0
          ? `${leaveApplications.length} total applications`
          : "No applications submitted",
      icon: FileText,
      color: leaveApplications.length > 0 ? "text-orange-600" : "text-gray-500",
      bgColor: leaveApplications.length > 0 ? "bg-orange-50" : "bg-gray-50",
    },
  ];

  // Generate recent activities from real data
  const recentActivities = [
    ...certificates.slice(-3).map((cert: any) => ({
      id: `cert-${cert.id}`,
      type: "certificate",
      title: "Certificate uploaded",
      description: cert.title,
      time: new Date(cert.uploadDate).toLocaleDateString(),
      icon: Award,
      status:
        cert.status === "approved"
          ? "success"
          : cert.status === "rejected"
            ? "warning"
            : "info",
    })),
    ...leaveApplications.slice(-2).map((leave: any) => ({
      id: `leave-${leave.id}`,
      type: "leave",
      title: "Leave application submitted",
      description: `${leave.type} leave for ${leave.reason}`,
      time: new Date(leave.appliedDate).toLocaleDateString(),
      icon: Plane,
      status:
        leave.status === "approved"
          ? "success"
          : leave.status === "rejected"
            ? "warning"
            : "info",
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  // Events will be populated from academic calendar
  const upcomingEvents = [];

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

  const handleProfileCompletion = () => {
    setShowProfileCompletion(false);
    // Reload student data to check profile completion
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setStudentData(currentUser);
  };

  // Show profile completion form if needed
  if (showProfileCompletion) {
    return <ProfileCompletion onComplete={handleProfileCompletion} />;
  }

  if (!studentData || loading) {
    return (
      <DashboardLayout
        userType="student"
        userName={studentData?.name || "Loading..."}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
                Welcome back, {studentData.name || "Student"}!
              </h1>
              <p className="text-blue-100">
                {studentData.hallTicket || "Hall Ticket"} •{" "}
                {studentData.year || "Year"} • AI & DS • Section{" "}
                {studentData.section || "A"}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-md ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                  <p className="text-gray-400 text-xs">
                    Events will appear here when available
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <Badge
                          variant={
                            event.priority === "high"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {event.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Your latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent activities</p>
                <p className="text-gray-400 text-xs">
                  Your activities will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.status === "success"
                          ? "bg-green-50"
                          : activity.status === "warning"
                            ? "bg-orange-50"
                            : "bg-blue-50"
                      }`}
                    >
                      <activity.icon
                        className={`h-5 w-5 ${
                          activity.status === "success"
                            ? "text-green-600"
                            : activity.status === "warning"
                              ? "text-orange-600"
                              : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Performance - Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
            <CardDescription>
              Your grades and attendance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No academic data available
              </p>
              <p className="text-gray-400 text-xs">
                Performance data will appear once grades are posted
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
