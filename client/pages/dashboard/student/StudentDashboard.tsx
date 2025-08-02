import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
  AlertCircle
} from "lucide-react";

const StudentDashboard = () => {
  // Mock data - in real app this would come from API
  const studentData = {
    name: "Rahul Sharma",
    hallTicket: "20AI001",
    year: 3,
    branch: "AI & DS",
    semester: 6,
    cgpa: 8.45,
    attendance: 88,
    profilePhoto: "/api/placeholder/100/100"
  };

  const quickStats = [
    {
      title: "Overall CGPA",
      value: studentData.cgpa.toString(),
      description: "Current semester",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Attendance",
      value: `${studentData.attendance}%`,
      description: "This semester",
      icon: Calendar,
      color: studentData.attendance >= 75 ? "text-green-600" : "text-red-600",
      bgColor: studentData.attendance >= 75 ? "bg-green-50" : "bg-red-50"
    },
    {
      title: "Certificates",
      value: "12",
      description: "Approved",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Applications",
      value: "2",
      description: "Leave requests",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "result",
      title: "Mid-term results published",
      description: "Machine Learning - 85/100",
      time: "2 hours ago",
      icon: BarChart3,
      status: "success"
    },
    {
      id: 2,
      type: "certificate",
      title: "Certificate approved",
      description: "AWS Cloud Practitioner",
      time: "1 day ago",
      icon: Award,
      status: "success"
    },
    {
      id: 3,
      type: "material",
      title: "New study material",
      description: "Deep Learning - Neural Networks",
      time: "2 days ago",
      icon: BookOpen,
      status: "info"
    },
    {
      id: 4,
      type: "leave",
      title: "Leave application pending",
      description: "Medical leave for 2 days",
      time: "3 days ago",
      icon: Plane,
      status: "warning"
    }
  ];

  const upcomingEvents = [
    {
      title: "Data Science Project Submission",
      date: "March 20, 2025",
      time: "11:59 PM",
      priority: "high"
    },
    {
      title: "Machine Learning Mid-term Exam",
      date: "March 25, 2025", 
      time: "10:00 AM",
      priority: "high"
    },
    {
      title: "Industry Expert Talk",
      date: "March 28, 2025",
      time: "2:00 PM",
      priority: "medium"
    }
  ];

  const quickActions = [
    {
      title: "View Profile",
      description: "Update personal information",
      link: "/dashboard/student/profile",
      icon: User,
      color: "bg-blue-600"
    },
    {
      title: "Upload Certificate",
      description: "Add new achievements",
      link: "/dashboard/student/certificates",
      icon: Award,
      color: "bg-green-600"
    },
    {
      title: "Check Results",
      description: "View academic performance",
      link: "/dashboard/student/results",
      icon: BarChart3,
      color: "bg-purple-600"
    },
    {
      title: "Apply for Leave",
      description: "Submit leave application",
      link: "/dashboard/student/leave",
      icon: Plane,
      color: "bg-orange-600"
    }
  ];

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
              <h1 className="text-2xl font-bold">Welcome back, {studentData.name}!</h1>
              <p className="text-blue-100">
                {studentData.hallTicket} • Year {studentData.year} • {studentData.branch} • Semester {studentData.semester}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index}>
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
                          <p className="text-sm text-gray-600">{action.description}</p>
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
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm">{event.title}</h3>
                    <Badge variant={event.priority === 'high' ? 'destructive' : 'default'}>
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Attendance Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Progress</CardTitle>
            <CardDescription>Your attendance across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Attendance</span>
                  <span className="text-sm text-gray-600">{studentData.attendance}%</span>
                </div>
                <Progress value={studentData.attendance} className="h-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <div className="text-sm text-gray-600">Above 85%</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-gray-600">75-85%</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">Below 75%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
