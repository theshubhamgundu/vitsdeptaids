import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  RefreshCw
} from "lucide-react";

const StudentTimetable = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  
  const timeSlots = [
    "9:00 - 9:50",
    "9:50 - 10:40", 
    "10:40 - 11:00", // Break
    "11:00 - 11:50",
    "11:50 - 12:40",
    "12:40 - 1:30", // Lunch
    "1:30 - 2:20",
    "2:20 - 3:10",
    "3:10 - 4:00",
    "4:00 - 4:50"
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [timetable] = useState({
    Monday: [
      { subject: "Machine Learning", faculty: "Dr. Priya Sharma", room: "ML Lab-301", type: "Lab" },
      { subject: "Machine Learning", faculty: "Dr. Priya Sharma", room: "ML Lab-301", type: "Lab" },
      { subject: "Break", faculty: "", room: "", type: "break" },
      { subject: "Data Structures", faculty: "Dr. Rajesh Kumar", room: "CSE-205", type: "Theory" },
      { subject: "Database Management", faculty: "Dr. Suresh Reddy", room: "CSE-210", type: "Theory" },
      { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      { subject: "Python Programming", faculty: "Dr. Anita Verma", room: "Lab-102", type: "Lab" },
      { subject: "Python Programming", faculty: "Dr. Anita Verma", room: "Lab-102", type: "Lab" },
      { subject: "Statistics", faculty: "Dr. Kavitha Rao", room: "CSE-208", type: "Theory" },
      { subject: "Library", faculty: "", room: "Library", type: "study" }
    ],
    Tuesday: [
      { subject: "Computer Vision", faculty: "Dr. Anita Verma", room: "CV Lab-302", type: "Lab" },
      { subject: "Computer Vision", faculty: "Dr. Anita Verma", room: "CV Lab-302", type: "Lab" },
      { subject: "Break", faculty: "", room: "", type: "break" },
      { subject: "Machine Learning", faculty: "Dr. Priya Sharma", room: "CSE-201", type: "Theory" },
      { subject: "Data Mining", faculty: "Dr. Rajesh Kumar", room: "CSE-205", type: "Theory" },
      { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      { subject: "Seminar", faculty: "All Faculty", room: "Seminar Hall", type: "seminar" },
      { subject: "Project Work", faculty: "Project Guide", room: "Project Lab", type: "project" },
      { subject: "Project Work", faculty: "Project Guide", room: "Project Lab", type: "project" },
      { subject: "Free Period", faculty: "", room: "", type: "free" }
    ],
    Wednesday: [
      { subject: "Database Management", faculty: "Dr. Suresh Reddy", room: "DB Lab-303", type: "Lab" },
      { subject: "Database Management", faculty: "Dr. Suresh Reddy", room: "DB Lab-303", type: "Lab" },
      { subject: "Break", faculty: "", room: "", type: "break" },
      { subject: "Statistics", faculty: "Dr. Kavitha Rao", room: "CSE-208", type: "Theory" },
      { subject: "Computer Vision", faculty: "Dr. Anita Verma", room: "CSE-203", type: "Theory" },
      { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      { subject: "Data Structures", faculty: "Dr. Rajesh Kumar", room: "DS Lab-304", type: "Lab" },
      { subject: "Data Structures", faculty: "Dr. Rajesh Kumar", room: "DS Lab-304", type: "Lab" },
      { subject: "Machine Learning", faculty: "Dr. Priya Sharma", room: "CSE-201", type: "Theory" },
      { subject: "Tutorial", faculty: "Class Teacher", room: "CSE-205", type: "tutorial" }
    ],
    Thursday: [
      { subject: "Natural Language Processing", faculty: "Dr. Suresh Reddy", room: "NLP Lab-305", type: "Lab" },
      { subject: "Natural Language Processing", faculty: "Dr. Suresh Reddy", room: "NLP Lab-305", type: "Lab" },
      { subject: "Break", faculty: "", room: "", type: "break" },
      { subject: "Python Programming", faculty: "Dr. Anita Verma", room: "CSE-204", type: "Theory" },
      { subject: "Data Mining", faculty: "Dr. Rajesh Kumar", room: "CSE-205", type: "Theory" },
      { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      { subject: "Big Data Analytics", faculty: "Dr. Priya Sharma", room: "BD Lab-306", type: "Lab" },
      { subject: "Big Data Analytics", faculty: "Dr. Priya Sharma", room: "BD Lab-306", type: "Lab" },
      { subject: "Statistics", faculty: "Dr. Kavitha Rao", room: "CSE-208", type: "Theory" },
      { subject: "Free Period", faculty: "", room: "", type: "free" }
    ],
    Friday: [
      { subject: "Project Work", faculty: "Project Guide", room: "Project Lab", type: "project" },
      { subject: "Project Work", faculty: "Project Guide", room: "Project Lab", type: "project" },
      { subject: "Break", faculty: "", room: "", type: "break" },
      { subject: "Natural Language Processing", faculty: "Dr. Suresh Reddy", room: "CSE-206", type: "Theory" },
      { subject: "Big Data Analytics", faculty: "Dr. Priya Sharma", room: "CSE-207", type: "Theory" },
      { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      { subject: "Comprehensive Lab", faculty: "All Faculty", room: "Comp Lab-307", type: "Lab" },
      { subject: "Comprehensive Lab", faculty: "All Faculty", room: "Comp Lab-307", type: "Lab" },
      { subject: "Review Meeting", faculty: "HOD", room: "Conference Room", type: "meeting" },
      { subject: "Library", faculty: "", room: "Library", type: "study" }
    ],
    Saturday: [
      { subject: "Guest Lecture", faculty: "Industry Expert", room: "Auditorium", type: "lecture" },
      { subject: "Workshop", faculty: "External Faculty", room: "Workshop Hall", type: "workshop" },
      { subject: "Break", faculty: "", room: "", type: "break" },
      { subject: "Skill Development", faculty: "Training Team", room: "Skills Lab", type: "training" },
      { subject: "Skill Development", faculty: "Training Team", room: "Skills Lab", type: "training" },
      { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      { subject: "Sports/Cultural", faculty: "Sports Coordinator", room: "Ground/Hall", type: "activity" },
      { subject: "Sports/Cultural", faculty: "Sports Coordinator", room: "Ground/Hall", type: "activity" },
      { subject: "Free Period", faculty: "", room: "", type: "free" },
      { subject: "Free Period", faculty: "", room: "", type: "free" }
    ]
  });

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
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7));
    
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
    const today = new Date().getDay();
    const dayName = weekDays[today === 0 ? 6 : today - 1]; // Convert Sunday(0) to Saturday(6)
    return timetable[dayName] || [];
  };

  const getUpcomingClasses = () => {
    const todayClasses = getTodayClasses();
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    return todayClasses.filter((classItem, index) => {
      if (classItem.type === "break" || classItem.type === "free") return false;
      const timeSlot = timeSlots[index];
      const startTime = timeSlot.split(" - ")[0];
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const startTimeMinutes = startHour * 60 + startMinute;
      return startTimeMinutes > currentTimeMinutes;
    }).slice(0, 3);
  };

  return (
    <DashboardLayout userType="student" userName="Rahul Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
            <p className="text-gray-600">View your class schedule and upcoming sessions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
          </div>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getTodayClasses().filter(c => c.type !== "break" && c.type !== "free").length}
              </div>
              <p className="text-xs text-muted-foreground">Classes scheduled</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">
                {getUpcomingClasses()[0]?.subject || "No more classes"}
              </div>
              <p className="text-xs text-muted-foreground">
                {getUpcomingClasses()[0]?.room || "Today"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Time</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString([], { weekday: 'long' })}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          </TabsList>

          {/* Weekly View */}
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Weekly Timetable</CardTitle>
                    <CardDescription>
                      Week of {weekDates[0].toLocaleDateString()} - {weekDates[5].toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentWeek(currentWeek - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentWeek(0)}
                      disabled={currentWeek === 0}
                    >
                      This Week
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentWeek(currentWeek + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Time</TableHead>
                        {weekDays.map((day, index) => (
                          <TableHead key={day} className="text-center min-w-32">
                            <div>
                              <div className="font-semibold">{day}</div>
                              <div className="text-xs text-gray-500">
                                {weekDates[index].toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.map((time, timeIndex) => (
                        <TableRow key={timeIndex}>
                          <TableCell className="font-medium text-sm">{time}</TableCell>
                          {weekDays.map((day) => {
                            const classItem = timetable[day][timeIndex];
                            return (
                              <TableCell key={day} className="p-1">
                                {classItem && (
                                  <div className={`p-2 rounded-lg border text-xs ${getSubjectColor(classItem.type)}`}>
                                    {classItem.type !== "break" && classItem.type !== "free" ? (
                                      <>
                                        <div className="font-semibold line-clamp-1">{classItem.subject}</div>
                                        {classItem.faculty && (
                                          <div className="flex items-center mt-1">
                                            <User className="h-3 w-3 mr-1" />
                                            <span className="line-clamp-1">{classItem.faculty}</span>
                                          </div>
                                        )}
                                        {classItem.room && (
                                          <div className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            <span className="line-clamp-1">{classItem.room}</span>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div className="text-center font-medium">{classItem.subject}</div>
                                    )}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Today's Schedule */}
          <TabsContent value="today" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTodayClasses().map((classItem, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getSubjectColor(classItem.type)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium">{timeSlots[index]}</div>
                            <Badge variant="outline">{classItem.type}</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="font-semibold text-lg">{classItem.subject}</div>
                            {classItem.faculty && (
                              <div className="flex items-center mt-1 text-sm">
                                <User className="h-4 w-4 mr-2" />
                                <span>{classItem.faculty}</span>
                              </div>
                            )}
                            {classItem.room && (
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{classItem.room}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Classes */}
          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Your next few classes today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getUpcomingClasses().length > 0 ? (
                    getUpcomingClasses().map((classItem, index) => {
                      const timeIndex = getTodayClasses().findIndex(c => c === classItem);
                      return (
                        <div key={index} className={`p-4 rounded-lg border ${getSubjectColor(classItem.type)}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">{timeSlots[timeIndex]}</span>
                                <Badge variant="outline">{classItem.type}</Badge>
                              </div>
                              <div className="font-semibold text-lg">{classItem.subject}</div>
                              {classItem.faculty && (
                                <div className="flex items-center mt-1">
                                  <User className="h-4 w-4 mr-2" />
                                  <span>{classItem.faculty}</span>
                                </div>
                              )}
                              {classItem.room && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{classItem.room}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">No more classes today</h3>
                      <p className="text-gray-500">Enjoy your free time!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Class Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Class Types</CardTitle>
                <CardDescription>Legend for different class types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { type: "Theory", label: "Theory Classes" },
                    { type: "Lab", label: "Laboratory" },
                    { type: "project", label: "Project Work" },
                    { type: "seminar", label: "Seminars" },
                    { type: "tutorial", label: "Tutorials" },
                    { type: "meeting", label: "Meetings" },
                    { type: "lecture", label: "Guest Lectures" },
                    { type: "activity", label: "Activities" }
                  ].map(({ type, label }) => (
                    <div key={type} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border ${getSubjectColor(type)}`}></div>
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentTimetable;
