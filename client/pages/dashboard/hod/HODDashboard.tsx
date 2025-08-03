import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
  BookOpen
} from "lucide-react";

const HODDashboard = () => {
  const [departmentStats, setDepartmentStats] = useState({
    totalStudents: 0,
    totalFaculty: 15,
    placementRate: 95,
    averageCGPA: 8.2,
    researchProjects: 12,
    industryPartnerships: 25
  });

  const [yearWiseData, setYearWiseData] = useState({
    year1: 0,
    year2: 0,
    year3: 0,
    year4: 0
  });

  const [facultyMetrics, setFacultyMetrics] = useState([
    {
      name: "Dr. Anita Verma",
      designation: "Assistant Professor",
      studentsAssigned: 85,
      researchPapers: 8,
      workload: 85
    },
    {
      name: "Dr. Rajesh Kumar",
      designation: "Associate Professor", 
      studentsAssigned: 92,
      researchPapers: 12,
      workload: 90
    },
    {
      name: "Dr. Suresh Reddy",
      designation: "Assistant Professor",
      studentsAssigned: 78,
      researchPapers: 6,
      workload: 75
    }
  ]);

  const [departmentKPIs, setDepartmentKPIs] = useState([
    {
      title: "Student Satisfaction",
      value: 94,
      target: 90,
      unit: "%",
      trend: "up"
    },
    {
      title: "Faculty Retention",
      value: 98,
      target: 95,
      unit: "%",
      trend: "up"
    },
    {
      title: "Research Output",
      value: 45,
      target: 40,
      unit: "papers",
      trend: "up"
    },
    {
      title: "Industry Projects",
      value: 8,
      target: 10,
      unit: "projects",
      trend: "down"
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "approval",
      title: "Faculty leave approved",
      description: "Dr. Anita Verma - Conference attendance",
      time: "2 hours ago",
      icon: UserCheck,
      status: "success"
    },
    {
      id: 2,
      type: "meeting",
      title: "Department meeting scheduled",
      description: "Monthly review meeting - March 25",
      time: "4 hours ago",
      icon: Calendar,
      status: "info"
    },
    {
      id: 3,
      type: "achievement",
      title: "Student achievement",
      description: "Rahul Sharma won coding competition",
      time: "1 day ago",
      icon: Award,
      status: "success"
    },
    {
      id: 4,
      type: "industry",
      title: "New industry partnership",
      description: "MOU signed with TechCorp",
      time: "2 days ago",
      icon: Briefcase,
      status: "success"
    }
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      type: "Faculty Leave",
      description: "Dr. Rajesh Kumar - Medical leave",
      priority: "high",
      daysLeft: 2
    },
    {
      id: 2,
      type: "Budget Request",
      description: "New lab equipment procurement",
      priority: "medium",
      daysLeft: 5
    },
    {
      id: 3,
      type: "Curriculum Change",
      description: "Update to ML syllabus",
      priority: "low",
      daysLeft: 10
    }
  ]);

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const fetchDepartmentData = async () => {
    try {
      // Fetch students data
      const studentsResponse = await fetch('/api/students/stats');
      const studentsData = await studentsResponse.json();
      
      if (studentsData.success) {
        setDepartmentStats(prev => ({
          ...prev,
          totalStudents: studentsData.data.total,
          averageCGPA: studentsData.data.averageCgpa
        }));

        setYearWiseData({
          year1: studentsData.data.byYear[1] || 0,
          year2: studentsData.data.byYear[2] || 0,
          year3: studentsData.data.byYear[3] || 0,
          year4: studentsData.data.byYear[4] || 0
        });
      }
    } catch (error) {
      console.error('Error fetching department data:', error);
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
      change: "+12 this semester"
    },
    {
      title: "Faculty Members",
      value: departmentStats.totalFaculty.toString(),
      description: "Active teaching staff",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+2 new joinings"
    },
    {
      title: "Placement Rate",
      value: `${departmentStats.placementRate}%`,
      description: "Current batch",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+5% vs last year"
    },
    {
      title: "Research Projects",
      value: departmentStats.researchProjects.toString(),
      description: "Active projects",
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+3 new projects"
    }
  ];

  return (
    <DashboardLayout userType="hod" userName="Dr. Priya Sharma">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Head of Department Dashboard</h1>
              <p className="text-purple-100">
                AI & Data Science Department • Vignan Institute of Technology & Science
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
                  <div key={approval.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <h4 className="font-medium">{approval.type}</h4>
                      <p className="text-sm text-gray-600">{approval.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={approval.priority === 'high' ? 'destructive' : approval.priority === 'medium' ? 'default' : 'outline'}>
                        {approval.priority}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{approval.daysLeft} days left</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Department Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentOverview.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-md ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
                <p className="text-xs text-green-600 mt-1">{metric.change}</p>
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
              {Object.entries(yearWiseData).map(([year, count], index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{year.replace('year', '')} Year</span>
                    <span className="text-gray-600">{count} students</span>
                  </div>
                  <Progress value={(count / departmentStats.totalStudents) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Department KPIs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Department KPIs</CardTitle>
              <CardDescription>Key performance indicators vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departmentKPIs.map((kpi, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{kpi.title}</span>
                      <div className="flex items-center space-x-2">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-bold">{kpi.value}{kpi.unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Target: {kpi.target}{kpi.unit}</span>
                      <span className={kpi.value >= kpi.target ? "text-green-600" : "text-red-600"}>
                        {kpi.value >= kpi.target ? "Target Met" : "Below Target"}
                      </span>
                    </div>
                    <Progress 
                      value={(kpi.value / kpi.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Overview</CardTitle>
            <CardDescription>Current faculty workload and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facultyMetrics.map((faculty, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{faculty.name}</h3>
                      <p className="text-sm text-gray-600">{faculty.designation}</p>
                    </div>
                    <Badge variant="outline">{faculty.studentsAssigned} students</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Research Papers:</span>
                      <span className="ml-2 font-medium">{faculty.researchPapers}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Workload:</span>
                      <span className="ml-2 font-medium">{faculty.workload}%</span>
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
          </CardContent>
        </Card>

        {/* Recent Department Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Department Activities</CardTitle>
            <CardDescription>Latest departmental events and decisions</CardDescription>
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

        {/* Quick Department Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Department Management</CardTitle>
            <CardDescription>Key departmental functions and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/dashboard/hod/students">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <GraduationCap className="h-5 w-5 mb-2" />
                    <div className="font-medium">All Students</div>
                    <div className="text-xs text-gray-600">Department overview</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/dashboard/hod/faculty-leaves">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <FileText className="h-5 w-5 mb-2" />
                    <div className="font-medium">Faculty Leaves</div>
                    <div className="text-xs text-gray-600">Approve requests</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/dashboard/hod/messages">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <MessageSquare className="h-5 w-5 mb-2" />
                    <div className="font-medium">Messages</div>
                    <div className="text-xs text-gray-600">Department communication</div>
                  </div>
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="text-left">
                  <Building className="h-5 w-5 mb-2" />
                  <div className="font-medium">Department Plan</div>
                  <div className="text-xs text-gray-600">Strategic planning</div>
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
