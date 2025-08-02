import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Target,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Database,
  Code,
  Briefcase,
  Building,
  Star
} from "lucide-react";

const HODAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("current-sem");
  const [selectedMetric, setSelectedMetric] = useState("academic");

  const [analyticsData, setAnalyticsData] = useState({
    studentPerformance: {
      totalStudents: 342,
      averageCGPA: 8.2,
      passPercentage: 94.5,
      topPerformers: 28,
      strugglingStudents: 12,
      attendanceRate: 87.3,
      yearWiseDistribution: {
        firstYear: { count: 95, avgCGPA: 7.8, passRate: 92 },
        secondYear: { count: 89, avgCGPA: 8.1, passRate: 95 },
        thirdYear: { count: 84, avgCGPA: 8.4, passRate: 96 },
        fourthYear: { count: 74, avgCGPA: 8.6, passRate: 98 }
      },
      subjectWisePerformance: [
        { subject: "Machine Learning", avgScore: 85.2, passRate: 96, difficulty: "high" },
        { subject: "Data Structures", avgScore: 78.5, passRate: 91, difficulty: "medium" },
        { subject: "Database Management", avgScore: 82.1, passRate: 94, difficulty: "medium" },
        { subject: "Python Programming", avgScore: 88.7, passRate: 98, difficulty: "low" },
        { subject: "Computer Vision", avgScore: 79.3, passRate: 89, difficulty: "high" },
        { subject: "Statistics", avgScore: 76.8, passRate: 88, difficulty: "medium" }
      ]
    },
    facultyPerformance: {
      totalFaculty: 15,
      averageRating: 4.3,
      researchActive: 12,
      publicationsThisYear: 45,
      facultyMetrics: [
        { 
          name: "Dr. Priya Sharma", 
          subjects: ["Machine Learning", "Deep Learning"], 
          avgRating: 4.8, 
          publications: 8, 
          studentFeedback: 4.7,
          researchProjects: 3
        },
        { 
          name: "Dr. Rajesh Kumar", 
          subjects: ["Data Mining", "Big Data"], 
          avgRating: 4.5, 
          publications: 6, 
          studentFeedback: 4.4,
          researchProjects: 2
        },
        { 
          name: "Dr. Anita Verma", 
          subjects: ["Computer Vision", "AI"], 
          avgRating: 4.6, 
          publications: 7, 
          studentFeedback: 4.6,
          researchProjects: 2
        },
        { 
          name: "Dr. Suresh Reddy", 
          subjects: ["NLP", "Text Analytics"], 
          avgRating: 4.4, 
          publications: 5, 
          studentFeedback: 4.3,
          researchProjects: 1
        }
      ]
    },
    departmentMetrics: {
      placementRate: 95.2,
      averagePackage: "₹8.5L",
      highestPackage: "₹25L",
      industryPartnerships: 28,
      researchFunding: "₹2.4Cr",
      patentsFiled: 8,
      rankingImprovement: "+15%",
      studentSatisfaction: 91.2,
      facilityUtilization: 78.5,
      libraryUsage: 67.3
    },
    trends: {
      enrollmentTrend: [
        { year: "2020", count: 280, growth: 0 },
        { year: "2021", count: 295, growth: 5.4 },
        { year: "2022", count: 315, growth: 6.8 },
        { year: "2023", count: 330, growth: 4.8 },
        { year: "2024", count: 342, growth: 3.6 }
      ],
      placementTrend: [
        { year: "2020", rate: 87, packages: "₹6.2L" },
        { year: "2021", rate: 89, packages: "₹6.8L" },
        { year: "2022", rate: 92, packages: "₹7.5L" },
        { year: "2023", rate: 94, packages: "₹8.1L" },
        { year: "2024", rate: 95.2, packages: "₹8.5L" }
      ],
      researchTrend: [
        { year: "2020", publications: 28, funding: "₹1.2Cr" },
        { year: "2021", publications: 32, funding: "₹1.5Cr" },
        { year: "2022", publications: 38, funding: "₹1.8Cr" },
        { year: "2023", publications: 42, funding: "₹2.1Cr" },
        { year: "2024", publications: 45, funding: "₹2.4Cr" }
      ]
    }
  });

  const [comparisonData] = useState({
    benchmarkMetrics: [
      { metric: "Student Satisfaction", ourValue: 91.2, benchmark: 85.0, status: "above" },
      { metric: "Faculty Research Output", ourValue: 45, benchmark: 35, status: "above" },
      { metric: "Placement Rate", ourValue: 95.2, benchmark: 88.0, status: "above" },
      { metric: "Average Package", ourValue: 8.5, benchmark: 7.2, status: "above" },
      { metric: "Industry Partnerships", ourValue: 28, benchmark: 20, status: "above" },
      { metric: "Student Retention", ourValue: 96.8, benchmark: 92.0, status: "above" }
    ]
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (value, threshold = 80) => {
    if (value >= threshold + 10) return 'text-green-600';
    if (value >= threshold) return 'text-blue-600';
    if (value >= threshold - 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'above':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'below':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'equal':
        return <Target className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout userType="hod" userName="Dr. Priya Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Analytics</h1>
            <p className="text-gray-600">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex space-x-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-sem">Current Semester</SelectItem>
                <SelectItem value="academic-year">Academic Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="3-years">Last 3 Years</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student Performance</CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{analyticsData.studentPerformance.averageCGPA}</div>
              <p className="text-xs text-muted-foreground">Average CGPA</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+0.3 from last sem</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <Briefcase className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analyticsData.departmentMetrics.placementRate}%</div>
              <p className="text-xs text-muted-foreground">Current batch</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+1.2% from last year</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Output</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{analyticsData.facultyPerformance.publicationsThisYear}</div>
              <p className="text-xs text-muted-foreground">Publications this year</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+7% increase</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analyticsData.departmentMetrics.studentSatisfaction}%</div>
              <p className="text-xs text-muted-foreground">Satisfaction score</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+2.5% improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="students">Student Analytics</TabsTrigger>
            <TabsTrigger value="faculty">Faculty Performance</TabsTrigger>
            <TabsTrigger value="department">Department Metrics</TabsTrigger>
            <TabsTrigger value="trends">Trends & Growth</TabsTrigger>
            <TabsTrigger value="benchmark">Benchmarking</TabsTrigger>
          </TabsList>

          {/* Student Analytics */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance Overview</CardTitle>
                  <CardDescription>Student performance metrics across all years</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.studentPerformance.totalStudents}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.studentPerformance.passPercentage}%</div>
                      <div className="text-sm text-gray-600">Pass Percentage</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Year-wise Distribution</h4>
                    {Object.entries(analyticsData.studentPerformance.yearWiseDistribution).map(([year, data]) => (
                      <div key={year} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium">{year.replace('Year', ' Year')}</span>
                          <div className="text-sm">
                            <span className="font-medium">{data.count} students</span>
                            <span className="text-gray-500 ml-2">CGPA: {data.avgCGPA}</span>
                          </div>
                        </div>
                        <Progress value={data.passRate} className="h-2" />
                        <div className="text-xs text-gray-500">Pass Rate: {data.passRate}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                  <CardDescription>Performance analysis across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.studentPerformance.subjectWisePerformance.map((subject, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{subject.subject}</span>
                          <Badge className={getDifficultyColor(subject.difficulty)}>
                            {subject.difficulty}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Avg Score:</span>
                            <span className={`ml-2 font-medium ${getPerformanceColor(subject.avgScore)}`}>
                              {subject.avgScore}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Pass Rate:</span>
                            <span className={`ml-2 font-medium ${getPerformanceColor(subject.passRate, 85)}`}>
                              {subject.passRate}%
                            </span>
                          </div>
                        </div>
                        <Progress value={subject.avgScore} className="h-2 mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Categories</CardTitle>
                <CardDescription>Distribution of students by performance categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{analyticsData.studentPerformance.topPerformers}</div>
                    <div className="text-sm text-gray-600">Top Performers</div>
                    <div className="text-xs text-gray-500 mt-1">CGPA ≥ 9.0</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.studentPerformance.totalStudents - analyticsData.studentPerformance.topPerformers - analyticsData.studentPerformance.strugglingStudents}
                    </div>
                    <div className="text-sm text-gray-600">Average Performers</div>
                    <div className="text-xs text-gray-500 mt-1">CGPA 6.0 - 9.0</div>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{analyticsData.studentPerformance.strugglingStudents}</div>
                    <div className="text-sm text-gray-600">Need Support</div>
                    <div className="text-xs text-gray-500 mt-1">CGPA < 6.0</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Performance */}
          <TabsContent value="faculty" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Overview</CardTitle>
                  <CardDescription>Overall faculty performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analyticsData.facultyPerformance.totalFaculty}</div>
                    <div className="text-sm text-gray-600">Total Faculty</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-bold text-yellow-600">{analyticsData.facultyPerformance.averageRating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Research Active</span>
                      <span className="font-bold text-blue-600">{analyticsData.facultyPerformance.researchActive}/{analyticsData.facultyPerformance.totalFaculty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Publications</span>
                      <span className="font-bold text-green-600">{analyticsData.facultyPerformance.publicationsThisYear}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Individual Faculty Performance</CardTitle>
                  <CardDescription>Detailed performance metrics for each faculty member</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.facultyPerformance.facultyMetrics.map((faculty, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{faculty.name}</h3>
                            <p className="text-sm text-gray-600">{faculty.subjects.join(", ")}</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            ⭐ {faculty.avgRating}/5.0
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span>Publications: <strong>{faculty.publications}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span>Student Rating: <strong>{faculty.studentFeedback}/5.0</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-purple-600" />
                            <span>Research Projects: <strong>{faculty.researchProjects}</strong></span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Progress value={faculty.avgRating * 20} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Department Metrics */}
          <TabsContent value="department" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Placement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{analyticsData.departmentMetrics.placementRate}%</div>
                    <div className="text-sm text-gray-600">Placement Rate</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Package</span>
                      <span className="font-bold">{analyticsData.departmentMetrics.averagePackage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Highest Package</span>
                      <span className="font-bold text-blue-600">{analyticsData.departmentMetrics.highestPackage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry Partners</span>
                      <span className="font-bold">{analyticsData.departmentMetrics.industryPartnerships}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research & Innovation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{analyticsData.departmentMetrics.researchFunding}</div>
                    <div className="text-sm text-gray-600">Research Funding</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Patents Filed</span>
                      <span className="font-bold">{analyticsData.departmentMetrics.patentsFiled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Publications</span>
                      <span className="font-bold">{analyticsData.facultyPerformance.publicationsThisYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Projects</span>
                      <span className="font-bold">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Infrastructure & Satisfaction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{analyticsData.departmentMetrics.studentSatisfaction}%</div>
                    <div className="text-sm text-gray-600">Student Satisfaction</div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Facility Utilization</span>
                        <span className="text-sm font-medium">{analyticsData.departmentMetrics.facilityUtilization}%</span>
                      </div>
                      <Progress value={analyticsData.departmentMetrics.facilityUtilization} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Library Usage</span>
                        <span className="text-sm font-medium">{analyticsData.departmentMetrics.libraryUsage}%</span>
                      </div>
                      <Progress value={analyticsData.departmentMetrics.libraryUsage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Department Ranking & Recognition</CardTitle>
                <CardDescription>External recognition and ranking improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Ranking Improvements</h3>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-medium">NIRF Ranking</span>
                        <Badge className="bg-green-100 text-green-800">{analyticsData.departmentMetrics.rankingImprovement}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Improved by 15 positions in national ranking</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Recent Achievements</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span>Best Department Award 2024</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>NAAC A+ Grade Maintained</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span>Excellence in Research Award</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends & Growth */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
                  <CardDescription>Student enrollment over the years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trends.enrollmentTrend.map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{data.year}</span>
                          <div className="text-sm text-gray-600">{data.count} students</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {data.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : data.growth < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <Target className="h-4 w-4 text-gray-600" />
                          )}
                          <span className={`text-sm font-medium ${data.growth > 0 ? 'text-green-600' : data.growth < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {data.growth > 0 ? '+' : ''}{data.growth}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Placement Trends</CardTitle>
                  <CardDescription>Placement rates and package trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trends.placementTrend.map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{data.year}</span>
                          <div className="text-sm text-gray-600">{data.rate}% placed</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-blue-600">{data.packages}</div>
                          <div className="text-xs text-gray-500">Avg Package</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Research Growth</CardTitle>
                <CardDescription>Research publications and funding trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trends.researchTrend.map((data, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                      <div className="text-center">
                        <div className="font-medium">{data.year}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{data.publications}</div>
                        <div className="text-xs text-gray-600">Publications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{data.funding}</div>
                        <div className="text-xs text-gray-600">Funding</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benchmarking */}
          <TabsContent value="benchmark" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarking</CardTitle>
                <CardDescription>Comparison with industry standards and peer institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisonData.benchmarkMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{metric.metric}</span>
                        {getStatusIcon(metric.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600">Our Performance</div>
                          <div className="text-lg font-bold text-blue-600">
                            {metric.metric.includes('Package') ? '₹' : ''}{metric.ourValue}{metric.metric.includes('Rate') || metric.metric.includes('Satisfaction') ? '%' : ''}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Industry Benchmark</div>
                          <div className="text-lg font-bold text-gray-600">
                            {metric.metric.includes('Package') ? '₹' : ''}{metric.benchmark}{metric.metric.includes('Rate') || metric.metric.includes('Satisfaction') ? '%' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Performance vs Benchmark</span>
                          <span className={`font-medium ${metric.status === 'above' ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.status === 'above' ? '+' : ''}{((metric.ourValue - metric.benchmark) / metric.benchmark * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.min((metric.ourValue / metric.benchmark) * 100, 100)} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
                <CardDescription>Comparison with top-tier institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Comprehensive Benchmarking Report</h3>
                  <p className="text-gray-500 mb-4">
                    Detailed comparison with IITs, NITs, and premier private institutions
                  </p>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Detailed Report
                  </Button>
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