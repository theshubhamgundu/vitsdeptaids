import { useState, useEffect } from "react";
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
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  BarChart3,
  Download,
  Target,
} from "lucide-react";

const StudentAttendance = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("March 2025");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
  }, []);

  const [attendanceData] = useState({
    overall: 88,
    thisMonth: 92,
    subjects: [
      {
        code: "AI601",
        name: "Machine Learning",
        totalClasses: 45,
        attendedClasses: 42,
        percentage: 93.3,
        status: "Good",
        faculty: "Dr. Anita Verma",
        lastAttended: "2025-03-10",
        consecutiveAbsent: 0,
      },
      {
        code: "AI602",
        name: "Deep Learning",
        totalClasses: 40,
        attendedClasses: 36,
        percentage: 90.0,
        status: "Good",
        faculty: "Dr. Raj Kumar",
        lastAttended: "2025-03-09",
        consecutiveAbsent: 1,
      },
      {
        code: "AI603",
        name: "Data Science",
        totalClasses: 38,
        attendedClasses: 32,
        percentage: 84.2,
        status: "Average",
        faculty: "Dr. Priya Sharma",
        lastAttended: "2025-03-08",
        consecutiveAbsent: 2,
      },
      {
        code: "AI604",
        name: "Computer Vision",
        totalClasses: 35,
        attendedClasses: 25,
        percentage: 71.4,
        status: "Warning",
        faculty: "Dr. Amit Singh",
        lastAttended: "2025-03-05",
        consecutiveAbsent: 3,
      },
      {
        code: "AI605",
        name: "Natural Language Processing",
        totalClasses: 32,
        attendedClasses: 30,
        percentage: 93.8,
        status: "Excellent",
        faculty: "Dr. Sneha Reddy",
        lastAttended: "2025-03-10",
        consecutiveAbsent: 0,
      },
      {
        code: "AI606",
        name: "AI Lab",
        totalClasses: 28,
        attendedClasses: 27,
        percentage: 96.4,
        status: "Excellent",
        faculty: "Dr. Anita Verma",
        lastAttended: "2025-03-10",
        consecutiveAbsent: 0,
      },
    ],
  });

  const [monthlyAttendance] = useState([
    { month: "August 2024", percentage: 85, classes: 42, attended: 36 },
    { month: "September 2024", percentage: 88, classes: 45, attended: 40 },
    { month: "October 2024", percentage: 92, classes: 48, attended: 44 },
    { month: "November 2024", percentage: 89, classes: 46, attended: 41 },
    { month: "December 2024", percentage: 86, classes: 38, attended: 33 },
    { month: "January 2025", percentage: 91, classes: 44, attended: 40 },
    { month: "February 2025", percentage: 87, classes: 43, attended: 37 },
    { month: "March 2025", percentage: 92, classes: 35, attended: 32 },
  ]);

  const [dailyAttendance] = useState([
    {
      date: "2025-03-01",
      subjects: ["AI601", "AI603", "AI605"],
      status: "Present",
    },
    {
      date: "2025-03-02",
      subjects: ["AI602", "AI604", "AI606"],
      status: "Present",
    },
    { date: "2025-03-03", subjects: ["AI601", "AI603"], status: "Present" },
    { date: "2025-03-04", subjects: ["AI602", "AI605"], status: "Absent" },
    { date: "2025-03-05", subjects: ["AI604", "AI606"], status: "Present" },
    {
      date: "2025-03-06",
      subjects: ["AI601", "AI603", "AI605"],
      status: "Present",
    },
    { date: "2025-03-07", subjects: ["AI602", "AI604"], status: "Present" },
    { date: "2025-03-08", subjects: ["AI606", "AI601"], status: "Present" },
    { date: "2025-03-09", subjects: ["AI603", "AI605"], status: "Absent" },
    { date: "2025-03-10", subjects: ["AI602", "AI604"], status: "Present" },
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "warning":
        return "bg-red-100 text-red-800";
      case "critical":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 75) return "Average";
    if (percentage >= 65) return "Warning";
    return "Critical";
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "excellent":
      case "good":
        return CheckCircle;
      case "average":
        return Clock;
      case "warning":
      case "critical":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const filteredSubjects =
    selectedSubject === "all"
      ? attendanceData.subjects
      : attendanceData.subjects.filter((sub) => sub.code === selectedSubject);

  const warningSubjects = attendanceData.subjects.filter(
    (sub) => sub.percentage < 75,
  );
  const excellentSubjects = attendanceData.subjects.filter(
    (sub) => sub.percentage >= 90,
  );

  if (!currentUser) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attendance...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="student"
      userName={currentUser.name || "Student"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Attendance Tracker
            </h1>
            <p className="text-gray-600">
              Monitor your attendance across all subjects
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Attendance
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {attendanceData.overall}%
              </div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {attendanceData.thisMonth}%
              </div>
              <p className="text-xs text-muted-foreground">March 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subjects at Risk
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {warningSubjects.length}
              </div>
              <p className="text-xs text-muted-foreground">Below 75%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Excellent Performance
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {excellentSubjects.length}
              </div>
              <p className="text-xs text-muted-foreground">Above 90%</p>
            </CardContent>
          </Card>
        </div>

        {/* Warning Alert */}
        {warningSubjects.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800">
                    Attendance Alert
                  </h3>
                  <p className="text-red-700">
                    You have {warningSubjects.length} subject(s) with attendance
                    below 75%. Please improve attendance to avoid academic
                    issues.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {warningSubjects.map((subject) => (
                      <Badge key={subject.code} variant="destructive">
                        {subject.name}: {subject.percentage.toFixed(1)}%
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subjects">Subject-wise</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Subject-wise Attendance Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="flex items-center space-x-4">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {attendanceData.subjects.map((subject) => (
                    <SelectItem key={subject.code} value={subject.code}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSubjects.map((subject) => {
                const StatusIcon = getStatusIcon(subject.status);
                return (
                  <Card key={subject.code}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {subject.name}
                          </CardTitle>
                          <CardDescription>
                            {subject.code} • {subject.faculty}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {subject.percentage.toFixed(1)}%
                          </div>
                          <Badge className={getStatusColor(subject.status)}>
                            {subject.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Attendance Progress</span>
                          <span>
                            {subject.attendedClasses}/{subject.totalClasses}
                          </span>
                        </div>
                        <Progress
                          value={subject.percentage}
                          className={`h-2 ${subject.percentage < 75 ? "bg-red-100" : "bg-green-100"}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Classes Attended</div>
                          <div className="font-semibold">
                            {subject.attendedClasses}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Total Classes</div>
                          <div className="font-semibold">
                            {subject.totalClasses}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Last Attended</div>
                          <div className="font-semibold">
                            {new Date(
                              subject.lastAttended,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">
                            Consecutive Absent
                          </div>
                          <div
                            className={`font-semibold ${subject.consecutiveAbsent > 2 ? "text-red-600" : ""}`}
                          >
                            {subject.consecutiveAbsent} classes
                          </div>
                        </div>
                      </div>

                      {subject.percentage < 75 && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-800 font-medium">
                              Action Required
                            </span>
                          </div>
                          <p className="text-xs text-red-700 mt-1">
                            Attend next{" "}
                            {Math.ceil(
                              (75 * subject.totalClasses -
                                100 * subject.attendedClasses) /
                                25,
                            )}{" "}
                            classes to reach 75%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Monthly Trend Tab */}
          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>
                  Your attendance pattern over the academic year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyAttendance.map((month, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 border rounded-lg"
                    >
                      <div className="w-32 font-medium">{month.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{month.percentage}%</span>
                          <span className="text-sm text-gray-600">
                            {month.attended}/{month.classes} classes
                          </span>
                        </div>
                        <Progress value={month.percentage} className="h-2" />
                      </div>
                      <div className="flex items-center">
                        {index > 0 && (
                          <>
                            {month.percentage >
                            monthlyAttendance[index - 1].percentage ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : month.percentage <
                              monthlyAttendance[index - 1].percentage ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <div className="h-4 w-4" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily View Tab */}
          <TabsContent value="daily" className="space-y-6">
            <div className="flex items-center space-x-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="March 2025">March 2025</SelectItem>
                  <SelectItem value="February 2025">February 2025</SelectItem>
                  <SelectItem value="January 2025">January 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance - {selectedMonth}</CardTitle>
                <CardDescription>Day-wise attendance record</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dailyAttendance.map((day, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${day.status === "Present" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {new Date(day.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-1">
                          {day.status === "Present" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${day.status === "Present" ? "text-green-800" : "text-red-800"}`}
                          >
                            {day.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {day.subjects.map((subjectCode) => {
                          const subject = attendanceData.subjects.find(
                            (s) => s.code === subjectCode,
                          );
                          return (
                            <div
                              key={subjectCode}
                              className="text-xs text-gray-600"
                            >
                              {subject?.name || subjectCode}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Distribution</CardTitle>
                  <CardDescription>
                    Subject performance breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Excellent (90%+)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(excellentSubjects.length / attendanceData.subjects.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {excellentSubjects.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Good (80-89%)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(attendanceData.subjects.filter((s) => s.percentage >= 80 && s.percentage < 90).length / attendanceData.subjects.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {
                            attendanceData.subjects.filter(
                              (s) => s.percentage >= 80 && s.percentage < 90,
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average (75-79%)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${(attendanceData.subjects.filter((s) => s.percentage >= 75 && s.percentage < 80).length / attendanceData.subjects.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {
                            attendanceData.subjects.filter(
                              (s) => s.percentage >= 75 && s.percentage < 80,
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Below Average (&lt;75%)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${(warningSubjects.length / attendanceData.subjects.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {warningSubjects.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                  <CardDescription>
                    Recommendations to improve attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Set Daily Goals</div>
                        <div className="text-sm text-gray-600">
                          Aim for 100% attendance each day
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Plan Ahead</div>
                        <div className="text-sm text-gray-600">
                          Check timetable and plan your day
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          Focus on Weak Subjects
                        </div>
                        <div className="text-sm text-gray-600">
                          Prioritize subjects below 75%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <div className="font-medium">
                          Catch Up on Missed Classes
                        </div>
                        <div className="text-sm text-gray-600">
                          Get notes from classmates
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Goals</CardTitle>
                <CardDescription>
                  Track your progress towards attendance targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">90%</div>
                    <div className="text-sm text-gray-600">Target Overall</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Current: {attendanceData.overall}%
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-600">
                      Minimum Required
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      University standard
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      95%
                    </div>
                    <div className="text-sm text-gray-600">Excellence Goal</div>
                    <div className="text-xs text-gray-500 mt-1">
                      For perfect attendance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
