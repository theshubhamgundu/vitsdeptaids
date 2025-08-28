import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/table";
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

interface AttendanceRecord {
  id: string;
  subject: string;
  attendedHours: number;
  conductedHours: number;
  percentage: number;
  status: string;
}

const StudentAttendance = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("March 2025");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallAttendance, setOverallAttendance] = useState(0);

  useEffect(() => {
    loadAttendanceData();
  }, [user]);

  const loadAttendanceData = async () => {
    if (!user?.hallTicket) return;

    setLoading(true);
    try {
      // Load attendance data for this specific student by hall ticket
      const attendance = await getStudentAttendanceByHallTicket(user.hallTicket);
      setAttendanceData(attendance);
      
      // Calculate overall attendance
      if (attendance.length > 0) {
        const totalAttended = attendance.reduce((sum, record) => sum + record.attendedHours, 0);
        const totalConducted = attendance.reduce((sum, record) => sum + record.conductedHours, 0);
        const overall = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 0;
        setOverallAttendance(overall);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentAttendanceByHallTicket = async (hallTicket: string): Promise<AttendanceRecord[]> => {
    try {
      // Try to get from Supabase first
      const { tables } = await import("@/lib/supabase");
      const attendanceTable = tables.studentAttendance();
      
      if (attendanceTable) {
        const { data, error } = await attendanceTable
          .select("*")
          .eq("hall_ticket", hallTicket)
          .order("subject");
        
        if (error) {
          console.log("Supabase error, falling back to localStorage:", error);
        } else if (data) {
          return data.map(record => ({
            id: record.id,
            subject: record.subject,
            attendedHours: record.attended_hours,
            conductedHours: record.conducted_hours,
            percentage: record.percentage,
            status: record.status
          }));
        }
      }
      
      // Fallback to localStorage
      const storedAttendance = localStorage.getItem(`attendance_${hallTicket}`);
      if (storedAttendance) {
        return JSON.parse(storedAttendance);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting attendance data:', error);
      return [];
    }
  };

  const getStatusColor = (status: string) => {
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

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 75) return "Average";
    if (percentage >= 65) return "Warning";
    return "Critical";
  };

  const getStatusIcon = (status: string) => {
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

  const filteredSubjects = selectedSubject === "all"
    ? attendanceData
    : attendanceData.filter((sub) => sub.subject === selectedSubject);

  const warningSubjects = attendanceData.filter(
    (sub) => sub.percentage < 75
  );

  const getUniqueSubjects = () => {
    return [...new Set(attendanceData.map(record => record.subject))];
  };

  if (loading) {
    return (
      <DashboardLayout userType="student" userName={user?.name || "Student"}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attendance data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student" userName={user?.name || "Student"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
            <p className="text-gray-600">Track your attendance across all subjects</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overall Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {overallAttendance}%
                </div>
                <p className="text-sm text-gray-600">Overall Percentage</p>
              </div>
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getStatusColor(getAttendanceStatus(overallAttendance))}`}>
                  {getAttendanceStatus(overallAttendance)}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">Status</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {attendanceData.length}
                </div>
                <p className="text-sm text-gray-600">Total Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Filter by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Subject
                </label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getUniqueSubjects().map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Subject-wise Attendance
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your attendance by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No attendance data found</p>
                <p className="text-sm text-gray-500">
                  {attendanceData.length === 0 
                    ? "No attendance records have been uploaded yet." 
                    : "Try adjusting your filters."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubjects.map((subject) => {
                  const IconComponent = getStatusIcon(subject.status);
                  return (
                    <Card key={subject.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-gray-500" />
                            <h3 className="font-medium">{subject.subject}</h3>
                          </div>
                          <Badge className={getStatusColor(subject.status)}>
                            {subject.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Attended</p>
                            <p className="text-lg font-semibold text-green-600">
                              {subject.attendedHours} hrs
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Conducted</p>
                            <p className="text-lg font-semibold text-blue-600">
                              {subject.conductedHours} hrs
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Percentage</p>
                            <p className="text-lg font-semibold text-purple-600">
                              {subject.percentage}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              subject.percentage >= 90 ? "bg-green-500" :
                              subject.percentage >= 80 ? "bg-blue-500" :
                              subject.percentage >= 75 ? "bg-yellow-500" :
                              subject.percentage >= 65 ? "bg-orange-500" :
                              "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(subject.percentage, 100)}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warning Section */}
        {warningSubjects.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Attendance Warnings
              </CardTitle>
              <CardDescription className="text-orange-700">
                Subjects with attendance below 75%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {warningSubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                    <span className="font-medium text-orange-800">{subject.subject}</span>
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      {subject.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
