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
import { getAllFaculty, getFacultyByRole } from "@/data/facultyData";
import { getAllStudents, getStudentStats } from "@/services/studentDataService";
import {
  Users,
  UserCheck,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Crown,
  Calendar,
  FileText,
  Award,
  Briefcase,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  GraduationCap,
  Building,
  BookOpen,
  MessageSquare,
} from "lucide-react";

const HODDashboard = () => {
  const [departmentStats, setDepartmentStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    placementRate: 0,
    averageCGPA: 0,
    researchProjects: 0,
    industryPartnerships: 0,
  });

  const [yearWiseData, setYearWiseData] = useState({
    year1: 0,
    year2: 0,
    year3: 0,
    year4: 0,
  });

  const [facultyMetrics, setFacultyMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Empty arrays for real-time data (no pre-filled mock data)
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  const [departmentKPIs, setDepartmentKPIs] = useState([
    {
      title: "Student Satisfaction",
      value: 0,
      target: 90,
      unit: "%",
      trend: "neutral",
    },
    {
      title: "Faculty Retention",
      value: 0,
      target: 95,
      unit: "%",
      trend: "neutral",
    },
    {
      title: "Research Output",
      value: 0,
      target: 40,
      unit: "papers",
      trend: "neutral",
    },
    {
      title: "Industry Projects",
      value: 0,
      target: 10,
      unit: "projects",
      trend: "neutral",
    },
  ]);

  useEffect(() => {
    initializeHODData();
  }, []);

  const initializeHODData = async () => {
    try {
      setLoading(true);

      // Get current user
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setCurrentUser(user);

      // Get real student data
      const [students, studentStats] = await Promise.all([
        getAllStudents(),
        getStudentStats(),
      ]);

      // Get faculty data
      const faculty = getAllFaculty();

      setDepartmentStats({
        totalStudents: studentStats.total,
        totalFaculty: faculty.length,
        placementRate: 0, // Will be calculated from placement data when available
        averageCGPA: studentStats.averageCgpa || 0,
        researchProjects: 0, // Will be calculated from faculty research data
        industryPartnerships: 0, // Will be calculated from partnerships data
      });

      setYearWiseData({
        year1: studentStats.byYear[1] || 0,
        year2: studentStats.byYear[2] || 0,
        year3: studentStats.byYear[3] || 0,
        year4: studentStats.byYear[4] || 0,
      });

      // Map faculty with basic metrics
      setFacultyMetrics(
        faculty.map((member) => ({
          name: member.name,
          designation: member.designation,
          studentsAssigned:
            Math.floor(studentStats.total / faculty.length) || 0,
          researchPapers: 0, // Will be populated from research data
          workload: 75, // Default workload percentage
        })),
      );

      // Start with empty arrays for activities and approvals (real-time data)
      setRecentActivities([]);
      setPendingApprovals([]);
    } catch (error) {
      console.error("Error initializing HOD data:", error);
    } finally {
      setLoading(false);
    }
  };

  const departmentOverview = [
    {
      title: "Total Students",
      value: departmentStats.totalStudents.toString(),
      description: "All years combined",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change:
        departmentStats.totalStudents > 0
          ? `${departmentStats.totalStudents} enrolled`
          : "No students yet",
    },
    {
      title: "Faculty Members",
      value: departmentStats.totalFaculty.toString(),
      description: "Active teaching staff",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: `${departmentStats.totalFaculty} active members`,
    },
    {
      title: "Placement Rate",
      value: `${departmentStats.placementRate}%`,
      description: "Current batch",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "No placement data yet",
    },
    {
      title: "Avg CGPA",
      value:
        departmentStats.averageCGPA > 0
          ? departmentStats.averageCGPA.toFixed(2)
          : "N/A",
      description: "Department average",
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change:
        departmentStats.averageCGPA > 0
          ? "Based on current data"
          : "No academic data yet",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout userType="hod" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="hod"
      userName={currentUser?.name || getFacultyByRole("HOD")[0]?.name || "HOD"}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Head of Department Dashboard
              </h1>
              <p className="text-purple-100">
                AI & Data Science Department • Vignan Institute of Technology &
                Science
              </p>
            </div>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {pendingApprovals.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-700">
                <Clock className="h-5 w-5" />
                <span>Pending Approvals ({pendingApprovals.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div>
                      <h4 className="font-medium">{approval.type}</h4>
                      <p className="text-sm text-gray-600">
                        {approval.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          approval.priority === "high"
                            ? "destructive"
                            : approval.priority === "medium"
                              ? "default"
                              : "outline"
                        }
                      >
                        {approval.priority}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {approval.daysLeft} days left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {pendingApprovals.length === 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">No pending approvals</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                All administrative tasks are up to date
              </p>
            </CardContent>
          </Card>
        )}

        {/* Department Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentOverview.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                <p className="text-xs text-gray-600 mt-1">{metric.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Year-wise Student Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Student Distribution</CardTitle>
              <CardDescription>Students by academic year</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentStats.totalStudents === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No students enrolled yet
                  </p>
                  <p className="text-gray-400 text-xs">
                    Student distribution will appear here once students are
                    enrolled
                  </p>
                </div>
              ) : (
                Object.entries(yearWiseData).map(([year, count], index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {year.replace("year", "")} Year
                      </span>
                      <span className="text-gray-600">{count} students</span>
                    </div>
                    <Progress
                      value={
                        departmentStats.totalStudents > 0
                          ? (count / departmentStats.totalStudents) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Department KPIs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Department KPIs</CardTitle>
              <CardDescription>
                Key performance indicators (will be populated with real data)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {departmentKPIs.every((kpi) => kpi.value === 0) ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No KPI data available yet
                  </p>
                  <p className="text-gray-400 text-xs">
                    Performance indicators will be calculated as data becomes
                    available
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {departmentKPIs.map((kpi, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{kpi.title}</span>
                        <div className="flex items-center space-x-2">
                          {kpi.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : kpi.trend === "down" ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                          <span className="font-bold">
                            {kpi.value}
                            {kpi.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          Target: {kpi.target}
                          {kpi.unit}
                        </span>
                        <span
                          className={
                            kpi.value >= kpi.target
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {kpi.value >= kpi.target
                            ? "Target Met"
                            : "Below Target"}
                        </span>
                      </div>
                      <Progress
                        value={
                          kpi.target > 0 ? (kpi.value / kpi.target) * 100 : 0
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Faculty Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Overview</CardTitle>
            <CardDescription>
              Current faculty workload and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {facultyMetrics.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No faculty data available
                </p>
                <p className="text-gray-400 text-xs">
                  Faculty metrics will appear here once data is available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {facultyMetrics.map((faculty, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{faculty.name}</h3>
                        <p className="text-sm text-gray-600">
                          {faculty.designation}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {faculty.studentsAssigned} students
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Research Papers:</span>
                        <span className="ml-2 font-medium">
                          {faculty.researchPapers}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Workload:</span>
                        <span className="ml-2 font-medium">
                          {faculty.workload}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Status:</span>
                        {faculty.workload > 85 ? (
                          <Badge variant="destructive">High Load</Badge>
                        ) : faculty.workload > 70 ? (
                          <Badge variant="default">Optimal</Badge>
                        ) : (
                          <Badge variant="outline">Light Load</Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={faculty.workload} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Department Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Department Activities</CardTitle>
            <CardDescription>
              Latest departmental events and decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent activities</p>
                <p className="text-gray-400 text-xs">
                  Departmental activities will appear here as they occur
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

        {/* Quick Department Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Department Management</CardTitle>
            <CardDescription>
              Key departmental functions and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/dashboard/hod/students">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <GraduationCap className="h-5 w-5 mb-2" />
                    <div className="font-medium">All Students</div>
                    <div className="text-xs text-gray-600">
                      Department overview
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/dashboard/hod/faculty-leaves">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <FileText className="h-5 w-5 mb-2" />
                    <div className="font-medium">Faculty Leaves</div>
                    <div className="text-xs text-gray-600">
                      Approve requests
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/dashboard/hod/messages">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <MessageSquare className="h-5 w-5 mb-2" />
                    <div className="font-medium">Messages</div>
                    <div className="text-xs text-gray-600">
                      Department communication
                    </div>
                  </div>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <div className="text-left">
                  <Building className="h-5 w-5 mb-2" />
                  <div className="font-medium">Department Plan</div>
                  <div className="text-xs text-gray-600">
                    Strategic planning
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HODDashboard;
