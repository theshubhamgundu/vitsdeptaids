import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
  const [facultyData, setFacultyData] = useState({
    name: "Dr. Anita Verma",
    employeeId: "FAC001",
    designation: "Assistant Professor",
    department: "AI & DS",
    specialization: "Computer Vision, Deep Learning",
    totalStudents: 85,
    pendingResults: 12,
    materialsUploaded: 24,
    messagesCount: 8
  });

  const [quickStats, setQuickStats] = useState([
    {
      title: "Total Students",
      value: "85",
      description: "Under your guidance",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/dashboard/faculty/students"
    },
    {
      title: "Pending Results",
      value: "12",
      description: "Awaiting entry",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/dashboard/faculty/results"
    },
    {
      title: "Study Materials",
      value: "24",
      description: "Uploaded this semester",
      icon: Upload,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/dashboard/faculty/materials"
    },
    {
      title: "Messages",
      value: "8",
      description: "Unread notifications",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/dashboard/faculty/messages"
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "result",
      title: "Results uploaded for Machine Learning",
      description: "Mid-term exam results for 3rd year students",
      time: "2 hours ago",
      icon: BarChart3,
      status: "success"
    },
    {
      id: 2,
      type: "material",
      title: "New study material uploaded",
      description: "Deep Learning - Neural Networks PPT",
      time: "5 hours ago",
      icon: Upload,
      status: "success"
    },
    {
      id: 3,
      type: "message",
      title: "Message sent to 2nd year students",
      description: "Assignment deadline reminder",
      time: "1 day ago",
      icon: MessageSquare,
      status: "info"
    },
    {
      id: 4,
      type: "student",
      title: "Student consultation scheduled",
      description: "Rahul Sharma - Project guidance",
      time: "2 days ago",
      icon: Users,
      status: "info"
    }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    {
      title: "Submit Final Exam Results",
      dueDate: "March 25, 2025",
      priority: "high",
      subject: "Machine Learning"
    },
    {
      title: "Faculty Meeting",
      dueDate: "March 22, 2025",
      priority: "medium",
      subject: "Department Planning"
    },
    {
      title: "Project Review Session",
      dueDate: "March 24, 2025",
      priority: "high",
      subject: "Final Year Projects"
    },
    {
      title: "Upload Course Materials",
      dueDate: "March 26, 2025",
      priority: "low",
      subject: "Computer Vision"
    }
  ]);

  const [subjectProgress, setSubjectProgress] = useState([
    { subject: "Machine Learning", completed: 85, total: 100 },
    { subject: "Computer Vision", completed: 70, total: 100 },
    { subject: "Data Structures", completed: 95, total: 100 },
    { subject: "Deep Learning", completed: 60, total: 100 }
  ]);

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
            <CardContent className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.subject}</span>
                    <span className="text-gray-600">{subject.completed}%</span>
                  </div>
                  <Progress value={subject.completed} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Important deadlines and events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
