import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllFaculty } from "@/data/facultyData";
import {
  Calendar,
  Clock,
  Save,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Users,
  BookOpen,
  CheckCircle
} from "lucide-react";

const SimpleTimetableCreator = () => {
  const { toast } = useToast();
  
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ];

  // Fixed time slots per requirement
  const [timeSlots, setTimeSlots] = useState([
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

  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({ startTime: "", endTime: "", isBreak: false, breakType: "Tea Break" });

  // Sample subjects for each year
  const subjectsByYear = {
    "1st Year": ["Mathematics I", "Programming Fundamentals", "Physics", "English", "Chemistry", "Engineering Drawing"],
    "2nd Year": ["Data Structures", "Database Systems", "Computer Networks", "Statistics", "Mathematics II", "Operating Systems"],
    "3rd Year": ["Machine Learning", "Computer Vision", "Data Mining", "Python Programming", "Big Data Analytics", "AI Ethics"],
    "4th Year": ["Advanced AI", "Research Methodology", "Capstone Project", "Industry Training", "Thesis Work", "Internship"]
  };

  // Get faculty list from real data
  const facultyList = getAllFaculty().map(faculty => faculty.name);

  // Sample rooms
  const roomList = [
    "CSE-101", "CSE-102", "CSE-201", "CSE-202", "Lab-101", "Lab-102", 
    "ML Lab-301", "CV Lab-302", "DB Lab-303", "AI Lab-401", "Conference Room", "Auditorium"
  ];

  const [selectedYear, setSelectedYear] = useState("3rd Year");
  const [selectedSemester, setSelectedSemester] = useState("6th Semester");
  const [showCellDialog, setShowCellDialog] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ day: "", timeIndex: -1 });
  const [cellData, setCellData] = useState({
    subject: "",
    subjectManual: "",
    faculty: "",
    facultyManual: "",
    room: "",
    type: "Theory"
  });

  // Initialize empty timetable
  const [timetable, setTimetable] = useState(() => {
    const initialTimetable = {};
    weekDays.forEach(day => {
      initialTimetable[day] = new Array(timeSlots.length).fill(null);
    });
    return initialTimetable;
  });

  const [savedTimetables, setSavedTimetables] = useState([
    {
      id: 1,
      year: "3rd Year",
      createdDate: "2025-01-15",
      status: "Active",
      classCount: 35
    }
  ]);

  const handleCellClick = (day, timeIndex) => {
    const timeSlot = timeSlots[timeIndex];
    
    // Skip if it's a break
    if (timeSlot === "10:25 - 10:40" || timeSlot === "1:10 - 2:00") {
      return;
    }

    setSelectedCell({ day, timeIndex });
    const existingData = timetable[day][timeIndex];
    
    if (existingData) {
      setCellData(existingData);
    } else {
      setCellData({
        subject: "",
        subjectManual: "",
        faculty: "",
        facultyManual: "",
        room: "",
        type: "Theory"
      });
    }
    
    setShowCellDialog(true);
  };

  const handleSaveCell = () => {
    const subjectFinal = cellData.subject === "__manual__" ? (cellData.subjectManual || "") : cellData.subject;
    const facultyFinal = cellData.faculty === "__manual__" ? (cellData.facultyManual || "") : cellData.faculty;

    if (!subjectFinal) {
      toast({
        title: "Error",
        description: "Please enter a subject",
        variant: "destructive"
      });
      return;
    }

    const newTimetable = { ...timetable };
    newTimetable[selectedCell.day][selectedCell.timeIndex] = { 
      subject: subjectFinal,
      faculty: facultyFinal,
      room: cellData.room,
      type: cellData.type
    };
    setTimetable(newTimetable);

    toast({
      title: "Success",
      description: "Class scheduled successfully!"
    });

    setShowCellDialog(false);
  };

  const handleDeleteCell = () => {
    const newTimetable = { ...timetable };
    newTimetable[selectedCell.day][selectedCell.timeIndex] = null;
    setTimetable(newTimetable);

    toast({
      title: "Success",
      description: "Class removed successfully"
    });

    setShowCellDialog(false);
  };

  const handleAddTimeSlot = () => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime) {
      toast({
        title: "Error",
        description: "Please select both start and end times",
        variant: "destructive"
      });
      return;
    }

    const timeSlotString = newTimeSlot.isBreak
      ? `${newTimeSlot.startTime} - ${newTimeSlot.endTime}`
      : `${newTimeSlot.startTime} - ${newTimeSlot.endTime}`;

    setTimeSlots(prev => [...prev, timeSlotString]);

    // Update timetable to accommodate new time slot
    const newTimetable = { ...timetable };
    weekDays.forEach(day => {
      newTimetable[day] = [...newTimetable[day], null];
    });
    setTimetable(newTimetable);

    toast({
      title: "Time Slot Added",
      description: `New time slot ${timeSlotString} has been added`
    });

    setShowTimeSlotDialog(false);
    setNewTimeSlot({ startTime: "", endTime: "", isBreak: false, breakType: "Tea Break" });
  };

  const handleRemoveTimeSlot = (index: number) => {
    if (timeSlots.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one time slot is required",
        variant: "destructive"
      });
      return;
    }

    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);

    // Update timetable to remove the time slot
    const newTimetable = { ...timetable };
    weekDays.forEach(day => {
      newTimetable[day] = newTimetable[day].filter((_, i) => i !== index);
    });
    setTimetable(newTimetable);

    toast({
      title: "Time Slot Removed",
      description: "Time slot has been removed from the timetable"
    });
  };

  const handleSaveTimetable = () => {
    // Count non-empty cells
    let classCount = 0;
    weekDays.forEach(day => {
      timetable[day].forEach(cell => {
        if (cell && cell.subject) classCount++;
      });
    });

    if (classCount === 0) {
      toast({
        title: "Cannot Save Empty Timetable",
        description: "Please add at least one class before saving the timetable.",
        variant: "destructive"
      });
      return;
    }

    const newTimetable = {
      id: Date.now(),
      year: selectedYear,
      semester: selectedSemester,
      createdDate: new Date().toISOString().split('T')[0],
      status: "Active",
      classCount,
      data: timetable,
      timeSlots: timeSlots,
      title: `${selectedYear} ${selectedSemester} AI & DS Timetable`,
      lastModified: new Date().toISOString().split('T')[0],
      effectiveFrom: new Date().toISOString().split('T')[0],
      type: "Generated",
      facultyAssigned: false
    };

    setSavedTimetables(prev => [newTimetable, ...prev.map(t => ({ ...t, status: "Inactive" }))]);

    // Persist for HOD view as well
    try {
      const adminTimetables = JSON.parse(localStorage.getItem('admin_timetables') || '[]');
      const filtered = adminTimetables.filter((t: any) => !(t.year === newTimetable.year && t.semester === newTimetable.semester));
      localStorage.setItem('admin_timetables', JSON.stringify([newTimetable, ...filtered]));
      // Broadcast change
      window.dispatchEvent(new StorageEvent('storage', { key: 'admin_timetables' }));
    } catch {}

    toast({
      title: "🎉 Timetable Saved Successfully!",
      description: `Timetable for ${selectedYear} with ${classCount} classes is now active. Students can view it immediately.`,
    });
  };

  const getCellColor = (cell) => {
    if (!cell) return "bg-gray-50 hover:bg-gray-100";
    
    switch (cell.type) {
      case "Theory":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Lab":
        return "bg-green-100 text-green-800 border-green-200";
      case "Tutorial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Seminar":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBreakCell = (timeSlot) => {
    if (timeSlot === "10:40 - 11:00") {
      return (
        <div className="bg-orange-100 text-orange-800 text-center py-3 rounded border-2 border-orange-200">
          <strong>Tea Break</strong>
        </div>
      );
    }
    if (timeSlot === "12:40 - 1:30") {
      return (
        <div className="bg-red-100 text-red-800 text-center py-3 rounded border-2 border-red-200">
          <strong>Lunch Break</strong>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Simple Timetable Creator</h1>
            <p className="text-sm sm:text-base text-gray-600">Create timetables by clicking on each time slot</p>
          </div>
          <Button 
            onClick={handleSaveTimetable}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save & Activate
          </Button>
        </div>

        {/* Year Selection and Time Slots Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Year & Semester</CardTitle>
              <CardDescription>Choose the year and semester for this timetable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map(sem => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Time Slots Management</CardTitle>
                  <CardDescription>Customize the time slots for classes</CardDescription>
                </div>
                <Dialog open={showTimeSlotDialog} onOpenChange={setShowTimeSlotDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Slot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Time Slot</DialogTitle>
                      <DialogDescription>Create a new time slot for the timetable</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={newTimeSlot.startTime}
                            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, startTime: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={newTimeSlot.endTime}
                            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, endTime: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleAddTimeSlot} className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Time Slot
                        </Button>
                        <Button variant="outline" onClick={() => setShowTimeSlotDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                    <span>{slot}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveTimeSlot(index)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Timetables */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Saved Timetables</CardTitle>
            <CardDescription>Previously created timetables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedTimetables.map((tt) => (
                <div key={tt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{tt.year}</div>
                    <div className="text-sm text-gray-600">
                      Created: {new Date(tt.createdDate).toLocaleDateString()} • {tt.classCount} classes
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={tt.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {tt.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Weekly Timetable - {selectedYear}
            </CardTitle>
            <CardDescription>Click on any time slot to add/edit a class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 sm:w-24">Time</TableHead>
                    {weekDays.map((day) => (
                      <TableHead key={day} className="text-center min-w-28 sm:min-w-32">
                        <div className="font-semibold text-xs sm:text-sm">{day}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map((time, timeIndex) => (
                    <TableRow key={timeIndex}>
                      <TableCell className="font-medium text-xs sm:text-sm p-2">{time}</TableCell>
                      {weekDays.map((day) => {
                        const isBreak = time === "10:25 - 10:40" || time === "1:10 - 2:00";
                        const cell = timetable[day][timeIndex];
                        
                        return (
                          <TableCell key={day} className="p-1">
                            {isBreak ? (
                              getBreakCell(time)
                            ) : (
                              <div
                                className={`p-2 rounded cursor-pointer border text-xs min-h-16 sm:min-h-20 ${getCellColor(cell)}`}
                                onClick={() => handleCellClick(day, timeIndex)}
                              >
                                {cell ? (
                                  <div className="space-y-1">
                                    <div className="font-semibold line-clamp-1">{cell.subject}</div>
                                    <div className="text-xs opacity-80">{cell.faculty}</div>
                                    <div className="text-xs opacity-80">{cell.room}</div>
                                    <Badge variant="outline" className="text-xs">{cell.type}</Badge>
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-400 text-xs">
                                    <Plus className="h-4 w-4 mx-auto" />
                                    Add Class
                                  </div>
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

        {/* Cell Edit Dialog */}
        <Dialog open={showCellDialog} onOpenChange={setShowCellDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {cellData.subject ? 'Edit Class' : 'Add Class'}
              </DialogTitle>
              <DialogDescription>
                {selectedCell.day} - {timeSlots[selectedCell.timeIndex]}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={cellData.subject} onValueChange={(value) => setCellData(prev => ({ ...prev, subject: value, subjectManual: value === "__manual__" ? prev.subjectManual : "" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsByYear[selectedYear]?.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                    <SelectItem value="__manual__">Manual Entry (New Subject)</SelectItem>
                  </SelectContent>
                </Select>
                {cellData.subject === "__manual__" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter new subject name"
                      value={cellData.subjectManual}
                      onChange={(e) => setCellData(prev => ({ ...prev, subjectManual: e.target.value }))}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Faculty</Label>
                <Select value={cellData.faculty} onValueChange={(value) => setCellData(prev => ({ ...prev, faculty: value, facultyManual: value === "__manual__" ? prev.facultyManual : "" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyList.map(faculty => (
                      <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
                    ))}
                    <SelectItem value="__manual__">Manual Entry (External)</SelectItem>
                  </SelectContent>
                </Select>
                {cellData.faculty === "__manual__" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter external faculty name"
                      value={cellData.facultyManual}
                      onChange={(e) => setCellData(prev => ({ ...prev, facultyManual: e.target.value }))}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {cellData.type === "Lab" && (
                  <>
                    <Label>Room/Lab No.</Label>
                    <Select value={cellData.room} onValueChange={(value) => setCellData(prev => ({ ...prev, room: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room/lab" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomList.map(room => (
                          <SelectItem key={room} value={room}>{room}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Class Type</Label>
                <Select value={cellData.type} onValueChange={(value) => setCellData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Theory">Theory</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveCell} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                {cellData.subject && (
                  <Button onClick={handleDeleteCell} variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SimpleTimetableCreator;
