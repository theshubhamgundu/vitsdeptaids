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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Clock,
  MapPin,
  User,
  BookOpen,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Info,
} from "lucide-react";

const StudentTimetable = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [timetableData, setTimetableData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<any | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (user) {
      setStudentInfo({
        name: user.name || "Student",
        hallTicket: user.hallTicket || "N/A",
        year: user.year || "",
        semester: "",
        branch: user.branch || "AI & DS",
      });
    }
  }, []);

  const [timeSlots, setTimeSlots] = useState<string[]>([
    "8:45 - 9:35",
    "9:35 - 10:25",
    "10:25 - 10:40", // Short Break
    "10:40 - 11:30",
    "11:30 - 12:20",
    "12:20 - 1:10",
    "1:10 - 2:00", // Lunch Break
    "2:00 - 2:45",
    "2:45 - 3:30",
  ]);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Load timetable saved by admin for the student's year/semester
  useEffect(() => {
    const load = async () => {
      if (!studentInfo || !studentInfo.year) return;
      setLoading(true);
      try {
        const adminTimetables = JSON.parse(
          localStorage.getItem("admin_timetables") || "[]"
        );

        const forYear = adminTimetables.filter((t: any) => t.year === studentInfo.year);
        const semesters = Array.from(new Set(forYear.map((t: any) => t.semester)));
        setAvailableSemesters(semesters);

        // Select an active timetable if present, otherwise most recently modified
        let chosen = forYear.find((t: any) => t.status === "Active");
        if (!chosen) {
          chosen = forYear.sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())[0];
        }

        if (chosen) {
          setSelectedSemester(chosen.semester);
          setTimeSlots(Array.isArray(chosen.timeSlots) && chosen.timeSlots.length > 0 ? chosen.timeSlots : timeSlots);
          setTimetableData(chosen.data || null);
          setError(null);
          setStudentInfo((prev: any) => ({ ...prev, year: chosen.year, semester: chosen.semester }));
        } else {
          setTimetableData(null);
          setError(`No timetable available for ${studentInfo.year}`);
          setStudentInfo((prev: any) => ({ ...prev, semester: "" }));
        }
      } catch (e) {
        setError("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [studentInfo?.year]);

  // When semester is changed by user, load that timetable
  useEffect(() => {
    if (!studentInfo || !studentInfo.year || !selectedSemester) return;
    try {
      const adminTimetables = JSON.parse(localStorage.getItem("admin_timetables") || "[]");
      const match = adminTimetables.find((t: any) => t.year === studentInfo.year && t.semester === selectedSemester);
      if (match) {
        setTimeSlots(Array.isArray(match.timeSlots) && match.timeSlots.length > 0 ? match.timeSlots : timeSlots);
        setTimetableData(match.data || null);
        setStudentInfo((prev: any) => ({ ...prev, semester: match.semester }));
        setError(null);
      }
    } catch {}
  }, [selectedSemester]);

  const getSubjectColor = (type) => {
    switch (type) {
      case "Theory":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Lab":
        return "bg-green-100 text-green-800 border-green-200";
      case "break":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "study":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "project":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "seminar":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "tutorial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "meeting":
        return "bg-red-100 text-red-800 border-red-200";
      case "lecture":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "workshop":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "training":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "activity":
        return "bg-lime-100 text-lime-800 border-lime-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + currentWeek * 7);

    const weekDates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();

  const getTodayClasses = () => {
    if (!timetableData) return [];
    const today = new Date().getDay();
    const dayName = weekDays[today === 0 ? 6 : today - 1]; // Convert Sunday(0) to Saturday(6)
    return timetableData[dayName] || [];
  };

  if (!studentInfo) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading timetable...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student" userName={studentInfo.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Class Timetable
            </h1>
            <p className="text-gray-600">
              Your weekly class schedule and upcoming sessions
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Student Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{studentInfo.name}</h2>
                  <p className="text-gray-600">
                    {studentInfo.hallTicket} • {studentInfo.year} •{" "}
                    {studentInfo.branch}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                {studentInfo.semester || (availableSemesters[0] || "Semester not set")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Week Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Week
              </Button>
              <div className="text-center">
                <h3 className="font-semibold">
                  {weekDates[0].toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {weekDates[5].toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentWeek === 0 ? "Current Week" : `Week ${currentWeek}`}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                Next Week
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Today's Classes</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          {/* Semester Selector (if multiple) */}
          {availableSemesters.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          )}

          {/* Weekly View Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Timetable</CardTitle>
                <CardDescription>
                  Complete schedule for the selected week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading timetable...</p>
                    </div>
                  </div>
                ) : error || !timetableData ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      {error || "No timetable available"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Timetables will be uploaded by the administration
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Time</TableHead>
                          {weekDays.map((day, index) => (
                            <TableHead key={day} className="text-center">
                              <div>{day}</div>
                              <div className="text-xs text-gray-500">
                                {weekDates[index].toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeSlots.map((timeSlot, slotIndex) => (
                          <TableRow key={slotIndex}>
                            <TableCell className="font-medium text-sm">
                              {timeSlot}
                            </TableCell>
                            {weekDays.map((day) => {
                              const dayClasses = timetableData[day] || [];
                              const classInfo = dayClasses[slotIndex] || {
                                subject: "",
                                faculty: "",
                                room: "",
                                type: "free",
                              };

                              return (
                                <TableCell key={`${day}-${slotIndex}`}>
                                  {classInfo.subject ? (
                                    <div
                                      className={`p-2 rounded border text-xs ${getSubjectColor(classInfo.type)}`}
                                    >
                                      <div className="font-medium">
                                        {classInfo.subject}
                                      </div>
                                      {classInfo.faculty && (
                                        <div className="text-xs opacity-80">
                                          {classInfo.faculty}
                                        </div>
                                      )}
                                      {classInfo.room && (
                                        <div className="text-xs opacity-80">
                                          {classInfo.room}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center text-gray-400 text-xs">
                                      -
                                    </div>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Today's Classes Tab */}
          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getTodayClasses().length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No classes today</p>
                    <p className="text-gray-400 text-xs">
                      Enjoy your free day or check for any updates
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getTodayClasses().map((classInfo, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${getSubjectColor(classInfo.type)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {classInfo.subject}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{classInfo.faculty}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{classInfo.room}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {timeSlots[index]}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {classInfo.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>
                  Next few classes in your schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming classes</p>
                  <p className="text-gray-400 text-xs">
                    Upcoming classes will appear here when timetable is
                    available
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Timetable Info */}
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Timetable Updates</div>
                  <div className="text-sm text-gray-600">
                    Timetables are updated by the administration and may change
                    due to faculty availability or special events.
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-medium">Class Changes</div>
                  <div className="text-sm text-gray-600">
                    Always check for last-minute updates on the notice board or
                    department announcements.
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Attendance</div>
                  <div className="text-sm text-gray-600">
                    Maintain at least 85% attendance as per university
                    regulations.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentTimetable;
