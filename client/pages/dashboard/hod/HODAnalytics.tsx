import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllStudents, getStudentStats } from "@/services/studentDataService";
import { getAllFaculty } from "@/data/facultyData";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Target,
  Activity,
  Briefcase,
  Building,
  Star
} from "lucide-react";

const HODAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("current-sem");
  const [selectedMetric, setSelectedMetric] = useState("academic");
  const [loading, setLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState({
    studentPerformance: {
      totalStudents: 0,
      averageCGPA: 0,
      passPercentage: 0,
      topPerformers: 0,
      strugglingStudents: 0,
      attendanceRate: 0,
      yearWiseDistribution: {
        firstYear: { count: 0, avgCGPA: 0, passRate: 0 },
        secondYear: { count: 0, avgCGPA: 0, passRate: 0 },
        thirdYear: { count: 0, avgCGPA: 0, passRate: 0 },
        fourthYear: { count: 0, avgCGPA: 0, passRate: 0 }
      },
      subjectWisePerformance: []
    },
    facultyPerformance: {
      totalFaculty: 0,
      averageRating: 0,
      researchActive: 0,
      publicationsThisYear: 0,
      facultyMetrics: []
    },
    departmentMetrics: {
      placementRate: 0,
      averagePackage: "₹0",
      highestPackage: "₹0",
      industryPartnerships: 0,
      researchFunding: "₹0",
      patentsFiled: 0,
      rankingImprovement: "0%",
      studentSatisfaction: 0,
      facilityUtilization: 0,
      libraryUsage: 0
    },
    trends: {
      enrollmentTrend: [],
      performanceTrend: [],
      placementTrend: []
    }
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load real data
      const [students, studentStats, faculty] = await Promise.all([
        getAllStudents(),
        getStudentStats(),
        getAllFaculty()
      ]);

      // Calculate student performance metrics
      const totalStudents = students.length;
      const averageCGPA = students.length > 0 ? 
        students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length : 0;
      
      const yearWiseDistribution = {
        firstYear: { count: 0, avgCGPA: 0, passRate: 0 },
        secondYear: { count: 0, avgCGPA: 0, passRate: 0 },
        thirdYear: { count: 0, avgCGPA: 0, passRate: 0 },
        fourthYear: { count: 0, avgCGPA: 0, passRate: 0 }
      };

      // Group students by year and calculate metrics
      students.forEach(student => {
        const year = student.year;
        if (year.includes("1st")) {
          yearWiseDistribution.firstYear.count++;
          yearWiseDistribution.firstYear.avgCGPA += student.cgpa || 0;
        } else if (year.includes("2nd")) {
          yearWiseDistribution.secondYear.count++;
          yearWiseDistribution.secondYear.avgCGPA += student.cgpa || 0;
        } else if (year.includes("3rd")) {
          yearWiseDistribution.thirdYear.count++;
          yearWiseDistribution.thirdYear.avgCGPA += student.cgpa || 0;
        } else if (year.includes("4th")) {
          yearWiseDistribution.fourthYear.count++;
          yearWiseDistribution.fourthYear.avgCGPA += student.cgpa || 0;
        }
      });

      // Calculate averages
      Object.keys(yearWiseDistribution).forEach(year => {
        const yearData = yearWiseDistribution[year as keyof typeof yearWiseDistribution];
        if (yearData.count > 0) {
          yearData.avgCGPA = yearData.avgCGPA / yearData.count;
        }
      });

      // Calculate faculty metrics
      const totalFaculty = faculty.length;
      const facultyMetrics = faculty.map(member => ({
        name: member.name,
        subjects: member.subjects || [],
        avgRating: 0, // Will be calculated from feedback data
        publications: 0, // Will be calculated from research data
        studentFeedback: 0, // Will be calculated from feedback data
        researchProjects: 0 // Will be calculated from research data
      }));

      setAnalyticsData({
        studentPerformance: {
          totalStudents,
          averageCGPA: parseFloat(averageCGPA.toFixed(2)),
          passPercentage: 0, // Will be calculated from results data
          topPerformers: 0, // Will be calculated from results data
          strugglingStudents: 0, // Will be calculated from results data
          attendanceRate: 0, // Will be calculated from attendance data
          yearWiseDistribution,
          subjectWisePerformance: [] // Will be populated from results data
        },
        facultyPerformance: {
          totalFaculty,
          averageRating: 0, // Will be calculated from feedback data
          researchActive: 0, // Will be calculated from research data
          publicationsThisYear: 0, // Will be calculated from research data
          facultyMetrics
        },
        departmentMetrics: {
          placementRate: 0, // Will be calculated from placement data
          averagePackage: "₹0", // Will be calculated from placement data
          highestPackage: "₹0", // Will be calculated from placement data
          industryPartnerships: 0, // Will be calculated from partnerships data
          researchFunding: "₹0", // Will be calculated from research data
          patentsFiled: 0, // Will be calculated from research data
          rankingImprovement: "0%", // Will be calculated from ranking data
          studentSatisfaction: 0, // Will be calculated from feedback data
          facilityUtilization: 0, // Will be calculated from facility data
          libraryUsage: 0 // Will be calculated from library data
        },
        trends: {
          enrollmentTrend: [], // Will be populated from enrollment data
          performanceTrend: [], // Will be populated from results data
          placementTrend: [] // Will be populated from placement data
        }
      });

    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: "current-sem", label: "Current Semester" },
    { value: "current-year", label: "Current Academic Year" },
    { value: "last-year", label: "Last Academic Year" },
    { value: "custom", label: "Custom Range" }
  ];

  const metricOptions = [
    { value: "academic", label: "Academic Performance" },
    { value: "faculty", label: "Faculty Performance" },
    { value: "department", label: "Department Metrics" },
    { value: "trends", label: "Trends & Analysis" }
  ];

  if (loading) {
    return (
      <DashboardLayout userType="hod" userName="HOD">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="hod" userName="HOD">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Department Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Comprehensive insights into department performance and trends
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadAnalyticsData} variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Time Range</label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Metric Focus</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {metricOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Tabs */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="academic">Academic Performance</TabsTrigger>
            <TabsTrigger value="faculty">Faculty Performance</TabsTrigger>
            <TabsTrigger value="department">Department Metrics</TabsTrigger>
            <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
          </TabsList>

          {/* Academic Performance Tab */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentPerformance.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentPerformance.averageCGPA}</div>
                  <p className="text-xs text-muted-foreground">Department average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentPerformance.passPercentage}%</div>
                  <p className="text-xs text-muted-foreground">Success rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <Activity className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.studentPerformance.attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground">Average attendance</p>
                </CardContent>
              </Card>
            </div>

            {/* Year-wise Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Year-wise Student Distribution</CardTitle>
                <CardDescription>Student count and performance by academic year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(analyticsData.studentPerformance.yearWiseDistribution).map(([year, data]) => (
                    <div key={year} className="text-center p-4 border rounded-lg">
                      <h3 className="font-medium capitalize">{year.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <div className="text-2xl font-bold text-blue-600">{data.count}</div>
                      <div className="text-sm text-gray-600">Students</div>
                      <div className="text-sm text-gray-500">CGPA: {data.avgCGPA.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Performance Tab */}
          <TabsContent value="faculty" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.facultyPerformance.totalFaculty}</div>
                  <p className="text-xs text-muted-foreground">Teaching staff</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.facultyPerformance.averageRating}/5.0</div>
                  <p className="text-xs text-muted-foreground">Student feedback</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Research Active</CardTitle>
                  <BookOpen className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.facultyPerformance.researchActive}</div>
                  <p className="text-xs text-muted-foreground">Active researchers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Publications</CardTitle>
                  <Award className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.facultyPerformance.publicationsThisYear}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>
            </div>

            {/* Faculty List */}
            <Card>
              <CardHeader>
                <CardTitle>Faculty Performance Overview</CardTitle>
                <CardDescription>Individual faculty metrics and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.facultyPerformance.facultyMetrics.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No faculty data available</p>
                    <p className="text-gray-400 text-xs">
                      Faculty performance data will appear here once available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyticsData.facultyPerformance.facultyMetrics.map((faculty, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{faculty.name}</h3>
                            <p className="text-sm text-gray-600">
                              {faculty.subjects.join(", ") || "No subjects assigned"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{faculty.avgRating}/5.0</div>
                            <div className="text-sm text-gray-600">Rating</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Department Metrics Tab */}
          <TabsContent value="department" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                  <Briefcase className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.departmentMetrics.placementRate}%</div>
                  <p className="text-xs text-muted-foreground">Graduates placed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Package</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.departmentMetrics.averagePackage}</div>
                  <p className="text-xs text-muted-foreground">Annual CTC</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Industry Partners</CardTitle>
                  <Building className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.departmentMetrics.industryPartnerships}</div>
                  <p className="text-xs text-muted-foreground">Active partnerships</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.departmentMetrics.studentSatisfaction}%</div>
                  <p className="text-xs text-muted-foreground">Satisfaction rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Historical data and trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Trend Analysis Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    Historical data and trend analysis will be available once sufficient data is collected
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HODAnalytics;
