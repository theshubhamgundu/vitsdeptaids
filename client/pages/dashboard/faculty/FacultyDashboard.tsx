import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllStudents } from "@/services/studentDataService";
import { 
  Users, 
  Upload, 
  BarChart3, 
  MessageSquare, 
  FileText,
  Calendar,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Award
} from "lucide-react";

const FacultyDashboard = () => {
  const [facultyData, setFacultyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  
  useEffect(() => {
    initializeFacultyData();
  }, []);

  const initializeFacultyData = async () => {
    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      
      if (currentUser.role === "faculty" || currentUser.role === "hod") {
        // Get student count for this faculty
        const students = await getAllStudents();
        const count = students.length;
        
        setFacultyData({
          name: currentUser.name || "Faculty Member",
          employeeId: currentUser.facultyId || "N/A",
          designation: currentUser.designation || "Faculty",
          department: "AI & DS",
          specialization: "Data Science and Artificial Intelligence",
          totalStudents: count,
          pendingResults: 0,
          materialsUploaded: 0,
          messagesCount: 0
        });
        setStudentCount(count);
      } else {
        // Fallback for demo
        setFacultyData({
          name: "Faculty Member",
          employeeId: "FAC001",
          designation: "Faculty",
          department: "AI & DS",
          specialization: "Data Science and Artificial Intelligence",
          totalStudents: 0,
          pendingResults: 0,
          materialsUploaded: 0,
          messagesCount: 0
        });
      }
    } catch (error) {
      console.error("Error initializing faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !facultyData) {
    return (
      <DashboardLayout userType="faculty" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const quickStats = [
    {
      title: "Total Students",
      value: studentCount.toString(),
      description: studentCount > 0 ? "Under department guidance" : "No students yet",
      icon: Users,
      color: studentCount > 0 ? "text-blue-600" : "text-gray-500",
      bgColor: studentCount > 0 ? "bg-blue-50" : "bg-gray-50",
      link: "/dashboard/faculty/students"
    },
    {
      title: "Pending Results",
      value: "0",
      description: "No pending entries",
      icon: BarChart3,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      link: "/dashboard/faculty/results"
    },
    {
      title: "Study Materials",
      value: "0",
      description: "No materials uploaded",
      icon: Upload,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      link: "/dashboard/faculty/materials"
    },
    {
      title: "Messages",
      value: "0",
      description: "No unread notifications",
      icon: MessageSquare,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      link: "/dashboard/faculty/messages"
    }
  ];

  // Empty states for new faculty accounts
  const recentActivities: any[] = [];
  const upcomingTasks: any[] = [];
  const subjectProgress: any[] = [];

  return (
    <DashboardLayout userType="faculty" userName={facultyData.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {facultyData.name}!</h1>
              <p className="text-green-100">
                {facultyData.employeeId} • {facultyData.designation} • {facultyData.department}
              </p>
              <p className="text-green-100 text-sm mt-1">
                Specialization: {facultyData.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Semester progress for your subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {subjectProgress.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No courses assigned yet</p>
                  <p className="text-gray-400 text-xs">
                    Course assignments will appear here once configured
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subjectProgress.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-gray-600">{subject.completed}%</span>
                      </div>
                      <Progress value={subject.completed} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Important deadlines and events</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming tasks</p>
                  <p className="text-gray-400 text-xs">
                    Tasks and deadlines will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'outline'}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{task.subject}</p>
                      <p className="text-xs text-gray-500">{task.dueDate}</p>
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
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent activities</p>
                <p className="text-gray-400 text-xs">
                  Your activities will appear here as you use the system
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-50' :
                      activity.status === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
                    }`}>
                      <activity.icon className={`h-5 w-5 ${
                        activity.status === 'success' ? 'text-green-600' :
                        activity.status === 'warning' ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used faculty operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/dashboard/faculty/materials">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Materials
                </Button>
              </Link>
              <Link to="/dashboard/faculty/results">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Enter Results
                </Button>
              </Link>
              <Link to="/dashboard/faculty/messages">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </Link>
              <Link to="/dashboard/faculty/students">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  View Students
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
