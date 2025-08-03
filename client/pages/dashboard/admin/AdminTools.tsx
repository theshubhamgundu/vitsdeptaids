import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Upload,
  Download,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  User,
  BookOpen,
  Settings,
  Trash2,
  Edit,
  Eye,
  Plus
} from "lucide-react";

const AdminTools = () => {

  const [results, setResults] = useState([
    {
      id: 1,
      title: "Mid-term Results - Machine Learning",
      subject: "Machine Learning",
      examType: "Mid-term",
      year: "3rd Year",
      semester: "6th Semester",
      uploadedBy: "Dr. Anita Verma",
      uploadDate: "2025-03-08",
      studentsCount: 50,
      status: "Published"
    }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      title: "February 2025 Attendance",
      month: "February 2025",
      year: "3rd Year",
      semester: "6th Semester",
      uploadedBy: "Admin",
      uploadDate: "2025-03-01",
      studentsCount: 50,
      subjects: ["Machine Learning", "Deep Learning", "Data Science"],
      status: "Active"
    }
  ]);



  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");

  // Dialog states
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);

  const [newResults, setNewResults] = useState({
    title: "",
    subject: "",
    examType: "Mid-term",
    year: "3rd Year",
    semester: "6th Semester",
    file: null
  });

  const [newAttendance, setNewAttendance] = useState({
    title: "",
    month: "",
    year: "3rd Year",
    semester: "6th Semester",
    subjects: [],
    file: null
  });

  // Mock student data for search
  const [students] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      hallTicket: "20AI001",
      year: "3rd Year",
      semester: "6th Semester",
      branch: "AI & DS",
      email: "rahul@example.com",
      phone: "+91 9876543210",
      cgpa: 8.45,
      attendance: 88
    },
    {
      id: 2,
      name: "Priya Reddy",
      hallTicket: "20AI002",
      year: "3rd Year",
      semester: "6th Semester",
      branch: "AI & DS",
      email: "priya@example.com",
      phone: "+91 9876543211",
      cgpa: 9.12,
      attendance: 92
    },
    {
      id: 3,
      name: "Amit Kumar",
      hallTicket: "20AI003",
      year: "3rd Year",
      semester: "6th Semester",
      branch: "AI & DS",
      email: "amit@example.com",
      phone: "+91 9876543212",
      cgpa: 8.78,
      attendance: 85
    }
  ]);

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];
  const subjects = ["Machine Learning", "Deep Learning", "Data Science", "Programming", "Statistics", "Mathematics"];
  const examTypes = ["Mid-term", "End-term", "Internal Assessment", "Quiz", "Assignment"];

  const handleUploadTimetable = () => {
    if (!newTimetable.year || !newTimetable.semester) return;
    if (!newTimetable.file && !newTimetable.designMode) return;

    const timetable = {
      id: Date.now(),
      title: newTimetable.title || `${newTimetable.year} ${newTimetable.semester} Timetable`,
      year: newTimetable.year,
      semester: newTimetable.semester,
      uploadedBy: "Admin",
      uploadDate: new Date().toISOString().split('T')[0],
      status: "Active",
      effectiveFrom: newTimetable.effectiveFrom || new Date().toISOString().split('T')[0],
      type: newTimetable.designMode ? "Generated" : "Uploaded",
      fileUrl: newTimetable.file ? `/timetables/${newTimetable.file.name}` : null,
      schedule: newTimetable.designMode ? {
        morningStart: newTimetable.morningStart,
        afternoonStart: newTimetable.afternoonStart,
        generated: true
      } : null
    };

    setTimetables(prev => [timetable, ...prev]);
    setShowTimetableDialog(false);
    setNewTimetable({
      title: "",
      year: "",
      semester: "",
      file: null,
      designMode: false,
      effectiveFrom: "",
      morningStart: "09:00",
      afternoonStart: "14:00"
    });
  };

  const handleUploadResults = () => {
    if (!newResults.title || !newResults.file) return;

    const results = {
      ...newResults,
      id: Date.now(),
      uploadedBy: "Admin",
      uploadDate: new Date().toISOString().split('T')[0],
      studentsCount: 50,
      status: "Published"
    };

    setResults(prev => [results, ...prev]);
    setShowResultsDialog(false);
    setNewResults({ title: "", subject: "", examType: "Mid-term", year: "3rd Year", semester: "6th Semester", file: null });
  };

  const handleUploadAttendance = () => {
    if (!newAttendance.title || !newAttendance.file) return;

    const attendance = {
      ...newAttendance,
      id: Date.now(),
      uploadedBy: "Admin",
      uploadDate: new Date().toISOString().split('T')[0],
      studentsCount: 50,
      status: "Active"
    };

    setAttendanceRecords(prev => [attendance, ...prev]);
    setShowAttendanceDialog(false);
    setNewAttendance({ title: "", month: "", year: "3rd Year", semester: "6th Semester", subjects: [], file: null });
  };



  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                         student.hallTicket.toLowerCase().includes(studentSearchTerm.toLowerCase());
    const matchesYear = filterYear === "all" || student.year === filterYear;
    return matchesSearch && matchesYear;
  });

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Tools</h1>
            <p className="text-gray-600">Advanced administrative tools and features</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timetables</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timetables.length}</div>
              <p className="text-xs text-muted-foreground">Active timetables</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Results</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
              <p className="text-xs text-muted-foreground">Published results</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRecords.length}</div>
              <p className="text-xs text-muted-foreground">Monthly records</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Total students</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">📊 Results</TabsTrigger>
            <TabsTrigger value="attendance">📉 Attendance</TabsTrigger>
            <TabsTrigger value="students">��� Students</TabsTrigger>
          </TabsList>



          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>📊 Results Upload</CardTitle>
                    <CardDescription>Upload Excel files with student marks</CardDescription>
                  </div>
                  <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Results
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Results</DialogTitle>
                        <DialogDescription>Upload Excel file with student marks</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Results Title</Label>
                          <Input
                            value={newResults.title}
                            onChange={(e) => setNewResults(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Mid-term Results - Machine Learning"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select value={newResults.subject} onValueChange={(value) => setNewResults(prev => ({ ...prev, subject: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map(subject => (
                                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Exam Type</Label>
                            <Select value={newResults.examType} onValueChange={(value) => setNewResults(prev => ({ ...prev, examType: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {examTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Select value={newResults.year} onValueChange={(value) => setNewResults(prev => ({ ...prev, year: value }))}>
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
                            <Select value={newResults.semester} onValueChange={(value) => setNewResults(prev => ({ ...prev, semester: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {semesters.map(semester => (
                                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Upload Excel File</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                              <FileSpreadsheet className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <div className="text-sm text-gray-600 mb-2">
                                Excel format: Hall Ticket, Student Name, Internal Marks, External Marks, Total
                              </div>
                              <Input
                                type="file"
                                className="hidden"
                                id="results-upload"
                                accept=".xlsx,.xls"
                                onChange={(e) => setNewResults(prev => ({ ...prev, file: e.target.files[0] }))}
                              />
                              <label htmlFor="results-upload" className="cursor-pointer">
                                <Button type="button" variant="outline">Choose Excel File</Button>
                              </label>
                            </div>
                            {newResults.file && (
                              <div className="mt-2 text-center text-sm text-green-600">
                                Selected: {newResults.file.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleUploadResults} className="flex-1">Upload Results</Button>
                          <Button variant="outline" onClick={() => setShowResultsDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exam Type</TableHead>
                      <TableHead>Year/Semester</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.title}</TableCell>
                        <TableCell>{result.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{result.examType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{result.year}</div>
                            <div className="text-sm text-gray-600">{result.semester}</div>
                          </div>
                        </TableCell>
                        <TableCell>{result.studentsCount}</TableCell>
                        <TableCell>{result.uploadedBy}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>📉 Attendance Upload</CardTitle>
                    <CardDescription>Upload JSON/Excel files with cumulative and subject-wise attendance</CardDescription>
                  </div>
                  <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Attendance
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Attendance</DialogTitle>
                        <DialogDescription>Upload attendance data for students</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Attendance Title</Label>
                          <Input
                            value={newAttendance.title}
                            onChange={(e) => setNewAttendance(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="February 2025 Attendance"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Month</Label>
                            <Input
                              value={newAttendance.month}
                              onChange={(e) => setNewAttendance(prev => ({ ...prev, month: e.target.value }))}
                              placeholder="February 2025"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Select value={newAttendance.year} onValueChange={(value) => setNewAttendance(prev => ({ ...prev, year: value }))}>
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
                            <Select value={newAttendance.semester} onValueChange={(value) => setNewAttendance(prev => ({ ...prev, semester: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {semesters.map(semester => (
                                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Upload File</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                              <FileSpreadsheet className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <div className="text-sm text-gray-600 mb-2">
                                Upload JSON or Excel file with attendance data
                              </div>
                              <Input
                                type="file"
                                className="hidden"
                                id="attendance-upload"
                                accept=".json,.xlsx,.xls"
                                onChange={(e) => setNewAttendance(prev => ({ ...prev, file: e.target.files[0] }))}
                              />
                              <label htmlFor="attendance-upload" className="cursor-pointer">
                                <Button type="button" variant="outline">Choose File</Button>
                              </label>
                            </div>
                            {newAttendance.file && (
                              <div className="mt-2 text-center text-sm text-green-600">
                                Selected: {newAttendance.file.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleUploadAttendance} className="flex-1">Upload Attendance</Button>
                          <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Year/Semester</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.title}</TableCell>
                        <TableCell>{record.month}</TableCell>
                        <TableCell>
                          <div>
                            <div>{record.year}</div>
                            <div className="text-sm text-gray-600">{record.semester}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {record.subjects.slice(0, 2).map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {record.subjects.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{record.subjects.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{record.studentsCount}</TableCell>
                        <TableCell>{record.uploadedBy}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Search Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🔍 Search Students</CardTitle>
                <CardDescription>Filter by Hall Ticket Number, year, name</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or hall ticket..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Hall Ticket</TableHead>
                      <TableHead>Year/Semester</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-600">{student.branch}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{student.hallTicket}</TableCell>
                        <TableCell>
                          <div>
                            <div>{student.year}</div>
                            <div className="text-sm text-gray-600">{student.semester}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{student.email}</div>
                            <div className="text-gray-600">{student.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.cgpa >= 8.5 ? "default" : student.cgpa >= 7.5 ? "secondary" : "outline"}>
                            {student.cgpa}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm">{student.attendance}%</div>
                            <div className={`w-2 h-2 rounded-full ${student.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminTools;
