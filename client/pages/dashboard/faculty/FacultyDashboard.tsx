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
import { getAllStudents } from "@/services/studentDataService";
import { getAllFaculty } from "@/services/authService";
import { 
  getFacultyAssignmentsByFacultyId, 
  getVisibleStudentsForFaculty,
  FacultyAssignment 
} from "@/services/facultyAssignmentService";
import { useAuth } from "@/contexts/AuthContext";
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
  Award,
  UserCheck,
  GraduationCap,
} from "lucide-react";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<any[]>([]);
  const [facultyAssignments, setFacultyAssignments] = useState<FacultyAssignment[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isCounsellor, setIsCounsellor] = useState(false);

  useEffect(() => {
    if (user) {
      initializeFacultyData();
    }
  }, [user]);

  const initializeFacultyData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === "faculty" || user?.role === "hod") {
        // Get faculty assignments for current user
        const assignments = await getFacultyAssignmentsByFacultyId(user.id);
        setFacultyAssignments(assignments);
        
        // Determine user's role
        const coordinatorRole = assignments.find(a => a.role === 'coordinator');
        const counsellorRole = assignments.find(a => a.role === 'counsellor');
        
        setIsCoordinator(!!coordinatorRole);
        setIsCounsellor(!!counsellorRole);

        // Get assigned students
        const visibleStudents = await getVisibleStudentsForFaculty(user.id);
        setAssignedStudents(visibleStudents);
        setStudentCount(visibleStudents.length);

        // Get real student data for department info
        const students = await getAllStudents();
        const faculty = await getAllFaculty();

        setFacultyData({
          name: user.name || "Faculty Member",
          employeeId: user.facultyId || "N/A",
          designation: user.designation || "Faculty",
          department: "AI & DS",
          specialization: "Data Science and Artificial Intelligence",
          totalStudents: visibleStudents.length,
          pendingResults: 0, // Will be calculated from real data
          materialsUploaded: 0, // Will be calculated from real data
          messagesCount: 0, // Will be calculated from real data
        });

        // Calculate real pending results
        const pendingResults = visibleStudents.reduce((total, student) => {
          const studentResults = JSON.parse(localStorage.getItem(`results_${student.id}`) || "[]");
          return total + studentResults.filter((r: any) => !r.published).length;
        }, 0);

        // Calculate real materials uploaded
        const materialsUploaded = visibleStudents.reduce((total, student) => {
          const studentMaterials = JSON.parse(localStorage.getItem(`materials_${student.id}`) || "[]");
          return total + studentMaterials.length;
        }, 0);

        // Update faculty data with real counts
        setFacultyData(prev => ({
          ...prev,
          pendingResults,
          materialsUploaded
        }));

        // Generate real recent activities
        const activities = [];
        
        if (visibleStudents.length > 0) {
          activities.push({
            id: 1,
            type: "student",
            title: "Assigned students loaded",
            description: `${visibleStudents.length} students assigned to you`,
            time: "Just now",
            icon: Users,
            status: "success"
          });
        }

        if (pendingResults > 0) {
          activities.push({
            id: 2,
            type: "result",
            title: "Pending results",
            description: `${pendingResults} results need to be published`,
            time: "Just now",
            icon: BarChart3,
            status: "warning"
          });
        }

        if (materialsUploaded > 0) {
          activities.push({
            id: 3,
            type: "material",
            title: "Materials uploaded",
            description: `${materialsUploaded} study materials available`,
            time: "Just now",
            icon: Upload,
            status: "success"
          });
        }

        // Add role-specific activities
        if (coordinatorRole) {
          activities.push({
            id: 4,
            type: "role",
            title: "Coordinator role active",
            description: `Coordinating ${coordinatorRole.year} students`,
            time: "Just now",
            icon: UserCheck,
            status: "success"
          });
        }

        if (counsellorRole) {
          activities.push({
            id: 5,
            type: "role",
            title: "Counsellor role active",
            description: `Counselling ${counsellorRole.year} students`,
            time: "Just now",
            icon: GraduationCap,
            status: "success"
          });
        }

        setRecentActivities(activities);

        // Generate real upcoming tasks based on current data
        const tasks = [];
        
        if (pendingResults > 0) {
          tasks.push({
            id: 1,
            title: "Publish Pending Results",
            subject: "Multiple subjects",
            dueDate: "This week",
            priority: "high"
          });
        }

        if (visibleStudents.length > 0) {
          tasks.push({
            id: 2,
            title: "Review Student Progress",
            subject: "All assigned students",
            dueDate: "This month",
            priority: "medium"
          });
        }

        // Add role-specific tasks
        if (coordinatorRole) {
          tasks.push({
            id: 3,
            title: "Year Coordinator Review",
            subject: `${coordinatorRole.year} students`,
            dueDate: "This month",
            priority: "medium"
          });
        }

        if (counsellorRole) {
          tasks.push({
            id: 4,
            title: "Student Counselling Sessions",
            subject: "Individual student meetings",
            dueDate: "This week",
            priority: "medium"
          });
        }

        setUpcomingTasks(tasks);

        // Generate real subject progress based on assignments
        const subjects = [];
        if (coordinatorRole) {
          subjects.push({
            subject: `${coordinatorRole.year} Coordination`,
            completed: Math.min(100, Math.round((visibleStudents.length / 50) * 100)),
            totalStudents: visibleStudents.length
          });
        }
        if (counsellorRole) {
          subjects.push({
            subject: `${counsellorRole.year} Counselling`,
            completed: Math.min(100, Math.round((visibleStudents.length / (counsellorRole.max_students || 50)) * 100)),
            totalStudents: visibleStudents.length
          });
        }

        setSubjectProgress(subjects);

      } else {
        // Set default empty state
        setFacultyData({
          name: "Faculty Member",
          employeeId: "N/A",
          designation: "Faculty",
          department: "AI & DS",
          specialization: "Data Science and Artificial Intelligence",
          totalStudents: 0,
          pendingResults: 0,
          materialsUploaded: 0,
          messagesCount: 0,
        });
        setStudentCount(0);
        setRecentActivities([]);
        setUpcomingTasks([]);
        setSubjectProgress([]);
      }
    } catch (error) {
      console.error("Error initializing faculty data:", error);
      
      // Set error state
      setFacultyData({
        name: "Error Loading",
        employeeId: "N/A",
        designation: "Faculty",
        department: "AI & DS",
        specialization: "Data Science and Artificial Intelligence",
        totalStudents: 0,
        pendingResults: 0,
        materialsUploaded: 0,
        messagesCount: 0,
      });
      setStudentCount(0);
      setRecentActivities([]);
      setUpcomingTasks([]);
      setSubjectProgress([]);
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

  // Role-based quick stats
  const getQuickStats = () => {
    const baseStats = [
      {
        title: "Assigned Students",
        value: studentCount.toString(),
        description: studentCount > 0 ? "Students under your guidance" : "No students assigned yet",
        icon: Users,
        color: studentCount > 0 ? "text-blue-600" : "text-gray-500",
        bgColor: studentCount > 0 ? "bg-blue-50" : "bg-gray-50",
        link: "/dashboard/faculty/students",
      },
      {
        title: "Pending Results",
        value: facultyData.pendingResults.toString(),
        description: facultyData.pendingResults > 0 ? `${facultyData.pendingResults} results pending` : "No pending entries",
        icon: BarChart3,
        color: facultyData.pendingResults > 0 ? "text-orange-600" : "text-gray-500",
        bgColor: facultyData.pendingResults > 0 ? "bg-orange-50" : "bg-gray-50",
        link: "/dashboard/faculty/results",
      },
      {
        title: "Study Materials",
        value: facultyData.materialsUploaded.toString(),
        description: facultyData.materialsUploaded > 0 ? `${facultyData.materialsUploaded} materials uploaded` : "No materials uploaded",
        icon: Upload,
        color: facultyData.materialsUploaded > 0 ? "text-green-600" : "text-gray-500",
        bgColor: facultyData.materialsUploaded > 0 ? "bg-green-50" : "bg-gray-50",
        link: "/dashboard/faculty/materials",
      },
      {
        title: "Messages",
        value: facultyData.messagesCount.toString(),
        description: facultyData.messagesCount > 0 ? `${facultyData.messagesCount} unread notifications` : "No unread notifications",
        icon: MessageSquare,
        color: facultyData.messagesCount > 0 ? "text-purple-600" : "text-gray-500",
        bgColor: facultyData.messagesCount > 0 ? "bg-purple-50" : "bg-gray-50",
        link: "/dashboard/faculty/messages",
      },
    ];

    // Add role-specific stats
    if (isCoordinator) {
      const coordinatorAssignment = facultyAssignments.find(a => a.role === 'coordinator');
      if (coordinatorAssignment) {
        baseStats.push({
          title: "Coordinator Role",
          value: coordinatorAssignment.year,
          description: `Coordinating ${coordinatorAssignment.year} students`,
          icon: UserCheck,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          link: "/dashboard/faculty/students",
        });
      }
    }

    if (isCounsellor) {
      const counsellorAssignment = facultyAssignments.find(a => a.role === 'counsellor');
      if (counsellorAssignment) {
        baseStats.push({
          title: "Counsellor Role",
          value: `${counsellorAssignment.max_students || 'Unlimited'}`,
          description: `Counselling ${counsellorAssignment.year} students`,
          icon: GraduationCap,
          color: "text-teal-600",
          bgColor: "bg-teal-50",
          link: "/dashboard/faculty/students",
        });
      }
    }

    return baseStats;
  };

  const quickStats = getQuickStats();

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
              <h1 className="text-2xl font-bold">
                Welcome back, {facultyData.name}!
              </h1>
              <p className="text-green-100">
                {facultyData.employeeId} • {facultyData.designation} •{" "}
                {facultyData.department}
              </p>
              <p className="text-green-100 text-sm mt-1">
                Specialization: {facultyData.specialization}
              </p>
              {/* Show roles */}
              <div className="flex gap-2 mt-2">
                {isCoordinator && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Coordinator
                  </Badge>
                )}
                {isCounsellor && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Counsellor
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.slice(0, 4).map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            </Link>
          ))}
        </div>

        {/* Role-specific stats row */}
        {quickStats.length > 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickStats.slice(4).map((stat, index) => (
              <Link key={index + 4} to={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
              </Link>
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Role & Assignment Progress</CardTitle>
              <CardDescription>
                Progress overview for your assigned responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subjectProgress.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No assignments yet
                  </p>
                  <p className="text-gray-400 text-xs">
                    Role assignments will appear here once configured by admin
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subjectProgress.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-gray-600">
                          {subject.completed}%
                        </span>
                      </div>
                      <Progress value={subject.completed} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {subject.totalStudents} students assigned
                      </div>
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
                    <div
                      key={index}
                      className="border-l-4 border-green-500 pl-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "outline"
                          }
                        >
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

        {/* Assigned Students */}
        {assignedStudents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Assigned Students</CardTitle>
              <CardDescription>Students under your guidance and support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedStudents.slice(0, 6).map((student, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {student.year || "N/A"}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm">{student.student_name || student.name || "Unknown Student"}</h3>
                    <p className="text-xs text-gray-600">HT: {student.ht_no || student.hallTicket || "N/A"}</p>
                    <p className="text-xs text-gray-500">{student.branch || "AI & DS"}</p>
                  </div>
                ))}
              </div>
              {assignedStudents.length > 6 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    +{assignedStudents.length - 6} more students assigned
                  </p>
                  <Link to="/dashboard/faculty/students">
                    <Button variant="outline" size="sm" className="mt-2">
                      View All Students
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used faculty operations
            </CardDescription>
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
