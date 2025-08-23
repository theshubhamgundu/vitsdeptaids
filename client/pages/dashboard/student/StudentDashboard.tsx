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
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [stats, setStats] = useState<StudentStats>({
    certificates: 0,
    pendingApplications: 0,
    attendance: 0,
    cgpa: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
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
                {studentData.hallTicket} • {studentData.year} • AI & DS •
                Section {studentData.section}
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
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon === "Award" ? Award :
                    activity.icon === "BarChart3" ? BarChart3 :
                    activity.icon === "Plane" ? Plane : Bell;
                  
                  return (
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
                        <IconComponent
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
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Progress</CardTitle>
            <CardDescription>
              Your academic performance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.cgpa > 0 || stats.attendance > 0 ? (
              <div className="space-y-6">
                {stats.attendance > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Attendance</span>
                      <span className="text-sm text-gray-600">{stats.attendance}%</span>
                    </div>
                    <Progress value={stats.attendance} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Poor (&lt;75%)</span>
                      <span>Good (75-85%)</span>
                      <span>Excellent (&gt;85%)</span>
                    </div>
                  </div>
                )}
                
                {stats.cgpa > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">CGPA Progress</span>
                      <span className="text-sm text-gray-600">{stats.cgpa.toFixed(2)}/10.0</span>
                    </div>
                    <Progress value={stats.cgpa * 10} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>6.0</span>
                      <span>7.5</span>
                      <span>9.0+</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No academic data available
                </p>
                <p className="text-gray-400 text-xs">
                  Performance data will appear once grades are posted
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
