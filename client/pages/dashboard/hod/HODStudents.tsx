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
  Search,
  Filter,
  Users,
  MessageCircle,
  Bell,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  FileText,
  Download,
  Upload,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Target,
  PieChart,
  Activity
} from "lucide-react";

const HODStudents = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      hallTicket: "20AI001",
      year: "3rd Year",
      semester: "6th Semester",
      branch: "AI & DS",
      email: "rahul@example.com",
      phone: "+91 9876543210",
      address: "Hyderabad, Telangana",
      cgpa: 8.45,
      attendance: 88,
      status: "Active",
      lastActive: "2025-03-10",
      parentContact: "+91 9876543200",
      subjects: ["Machine Learning", "Deep Learning", "Data Science"],
      performance: "Excellent",
      achievements: ["Best Project Award", "Academic Excellence"],
      warnings: 0,
      mentor: "Dr. Anita Verma"
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
      address: "Bangalore, Karnataka",
      cgpa: 9.12,
      attendance: 92,
      status: "Active",
      lastActive: "2025-03-10",
      parentContact: "+91 9876543201",
      subjects: ["Machine Learning", "Deep Learning", "Data Science"],
      performance: "Outstanding",
      achievements: ["Research Paper Published", "IEEE Competition Winner"],
      warnings: 0,
      mentor: "Dr. Raj Kumar"
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
      address: "Chennai, Tamil Nadu",
      cgpa: 8.78,
      attendance: 85,
      status: "Active",
      lastActive: "2025-03-09",
      parentContact: "+91 9876543202",
      subjects: ["Machine Learning", "Deep Learning", "Data Science"],
      performance: "Very Good",
      achievements: ["Hackathon Winner"],
      warnings: 1,
      mentor: "Dr. Anita Verma"
    },
    {
      id: 4,
      name: "Sneha Patel",
      hallTicket: "20AI004",
      year: "3rd Year",
      semester: "6th Semester",
      branch: "AI & DS",
      email: "sneha@example.com",
      phone: "+91 9876543213",
      address: "Mumbai, Maharashtra",
      cgpa: 7.65,
      attendance: 78,
      status: "At Risk",
      lastActive: "2025-03-08",
      parentContact: "+91 9876543203",
      subjects: ["Machine Learning", "Deep Learning", "Data Science"],
      performance: "Needs Improvement",
      achievements: [],
      warnings: 2,
      mentor: "Dr. Raj Kumar"
    }
  ]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCGPA, setFilterCGPA] = useState("all");
  const [filterAttendance, setFilterAttendance] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Dialog states
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [showBulkMessageDialog, setShowBulkMessageDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form states
  const [bulkMessage, setBulkMessage] = useState({
    title: "",
    message: "",
    type: "General",
    sendToParents: false
  });

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const branches = ["AI & DS", "CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const messageTypes = ["General", "Academic", "Alert", "Congratulations", "Warning"];

  // Filter and sort students
  const filteredAndSortedStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = filterYear === "all" || student.year === filterYear;
      const matchesBranch = filterBranch === "all" || student.branch === filterBranch;
      const matchesStatus = filterStatus === "all" || student.status === filterStatus;
      const matchesCGPA = filterCGPA === "all" || 
        (filterCGPA === "excellent" && student.cgpa >= 9.0) ||
        (filterCGPA === "good" && student.cgpa >= 8.0 && student.cgpa < 9.0) ||
        (filterCGPA === "average" && student.cgpa >= 7.0 && student.cgpa < 8.0) ||
        (filterCGPA === "below_average" && student.cgpa < 7.0);
      const matchesAttendance = filterAttendance === "all" ||
        (filterAttendance === "excellent" && student.attendance >= 90) ||
        (filterAttendance === "good" && student.attendance >= 80 && student.attendance < 90) ||
        (filterAttendance === "average" && student.attendance >= 75 && student.attendance < 80) ||
        (filterAttendance === "poor" && student.attendance < 75);

      return matchesSearch && matchesYear && matchesBranch && matchesStatus && matchesCGPA && matchesAttendance;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredAndSortedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredAndSortedStudents.map(student => student.id));
    }
  };

  const handleSendBulkMessage = () => {
    if (!bulkMessage.title || !bulkMessage.message || selectedStudents.length === 0) return;
    
    // Simulate sending message
    console.log("Sending message to", selectedStudents.length, "students");
    console.log("Message:", bulkMessage);
    
    setShowBulkMessageDialog(false);
    setBulkMessage({ title: "", message: "", type: "General", sendToParents: false });
    setSelectedStudents([]);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'at risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance.toLowerCase()) {
      case 'outstanding':
        return 'bg-purple-100 text-purple-800';
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'very good':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs improvement':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate analytics
  const analytics = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "Active").length,
    atRiskStudents: students.filter(s => s.status === "At Risk").length,
    averageCGPA: (students.reduce((acc, s) => acc + s.cgpa, 0) / students.length).toFixed(2),
    averageAttendance: (students.reduce((acc, s) => acc + s.attendance, 0) / students.length).toFixed(1),
    excellentPerformers: students.filter(s => s.cgpa >= 9.0).length,
    needsAttention: students.filter(s => s.attendance < 75 || s.warnings > 1).length
  };

  return (
    <DashboardLayout userType="hod" userName="Dr. Raj Kumar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Students Overview</h1>
            <p className="text-gray-600">Complete student database with advanced filtering and analytics</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAnalyticsDialog(true)}
            >
              <PieChart className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              disabled={selectedStudents.length === 0}
              onClick={() => setShowBulkMessageDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Message Selected ({selectedStudents.length})
            </Button>
          </div>
        </div>

        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalStudents}</div>
              <p className="text-xs text-muted-foreground">{analytics.activeStudents} active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageCGPA}</div>
              <p className="text-xs text-muted-foreground">{analytics.excellentPerformers} excellent performers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageAttendance}%</div>
              <p className="text-xs text-muted-foreground">Department average</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.needsAttention}</div>
              <p className="text-xs text-muted-foreground">{analytics.atRiskStudents} at risk</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCGPA} onValueChange={setFilterCGPA}>
                <SelectTrigger>
                  <SelectValue placeholder="CGPA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All CGPA</SelectItem>
                  <SelectItem value="excellent">Excellent (9.0+)</SelectItem>
                  <SelectItem value="good">Good (8.0-8.9)</SelectItem>
                  <SelectItem value="average">Average (7.0-7.9)</SelectItem>
                  <SelectItem value="below_average">Below Average (&lt;7.0)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAttendance} onValueChange={setFilterAttendance}>
                <SelectTrigger>
                  <SelectValue placeholder="Attendance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attendance</SelectItem>
                  <SelectItem value="excellent">Excellent (90%+)</SelectItem>
                  <SelectItem value="good">Good (80-89%)</SelectItem>
                  <SelectItem value="average">Average (75-79%)</SelectItem>
                  <SelectItem value="poor">Poor (&lt;75%)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="cgpa">CGPA</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="hallTicket">Hall Ticket</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{selectedStudents.length} selected</Badge>
                  <span className="text-sm text-gray-600">Bulk actions available</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowBulkMessageDialog(true)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Send Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Send Notification
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Data
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedStudents([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Students Database</CardTitle>
                <CardDescription>
                  Showing {filteredAndSortedStudents.length} of {students.length} students
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredAndSortedStudents.length && filteredAndSortedStudents.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Academic</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStudents.map((student) => (
                  <TableRow 
                    key={student.id}
                    className={selectedStudents.includes(student.id) ? "bg-purple-50" : ""}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.hallTicket}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{student.year} - {student.semester}</div>
                        <div className="text-xs text-gray-600">{student.branch}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={student.cgpa >= 8.5 ? "default" : student.cgpa >= 7.5 ? "secondary" : "outline"}>
                            CGPA: {student.cgpa}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">Attendance: {student.attendance}%</div>
                          <div className={`w-2 h-2 rounded-full ${student.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <Badge className={getPerformanceColor(student.performance)} size="sm">
                          {student.performance}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-32">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{student.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-32">{student.address}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                        {student.warnings > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-600">{student.warnings} warnings</span>
                          </div>
                        )}
                        {student.achievements.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Award className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600">{student.achievements.length} achievements</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{student.mentor}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowStudentDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="h-4 w-4" />
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

        {/* Student Details Dialog */}
        {selectedStudent && (
          <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedStudent.name} - Detailed Analysis</DialogTitle>
                <DialogDescription>Comprehensive student profile and performance metrics</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Student Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Hall Ticket</Label>
                    <p className="text-sm text-gray-900">{selectedStudent.hallTicket}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Year/Semester</Label>
                    <p className="text-sm text-gray-900">{selectedStudent.year} - {selectedStudent.semester}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Branch</Label>
                    <p className="text-sm text-gray-900">{selectedStudent.branch}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Mentor</Label>
                    <p className="text-sm text-gray-900">{selectedStudent.mentor}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedStudent.cgpa}</div>
                      <div className="text-sm text-gray-600">CGPA</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedStudent.attendance}%</div>
                      <div className="text-sm text-gray-600">Attendance</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedStudent.achievements.length}</div>
                      <div className="text-sm text-gray-600">Achievements</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Contact Information</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStudent.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStudent.address}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Parent Contact</Label>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedStudent.parentContact}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <Label className="text-sm font-medium">Current Subjects</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStudent.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline">{subject}</Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {selectedStudent.achievements.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Achievements</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedStudent.achievements.map((achievement, index) => (
                        <Badge key={index} className="bg-yellow-100 text-yellow-800">
                          <Award className="h-3 w-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status and Warnings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-2">
                      <Badge className={getStatusColor(selectedStudent.status)}>
                        {selectedStudent.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedStudent.warnings > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Warnings</Label>
                      <div className="mt-2">
                        <Badge variant="destructive">
                          {selectedStudent.warnings} warnings issued
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Send Message</Button>
                  <Button variant="outline">Edit Profile</Button>
                  <Button variant="outline" onClick={() => setShowStudentDialog(false)}>Close</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Bulk Message Dialog */}
        <Dialog open={showBulkMessageDialog} onOpenChange={setShowBulkMessageDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Bulk Message</DialogTitle>
              <DialogDescription>
                Send message to {selectedStudents.length} selected students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Message Title</Label>
                <Input
                  value={bulkMessage.title}
                  onChange={(e) => setBulkMessage(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Important Announcement"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Message Type</Label>
                <Select value={bulkMessage.type} onValueChange={(value) => setBulkMessage(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea
                  value={bulkMessage.message}
                  onChange={(e) => setBulkMessage(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message here..."
                  rows={5}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendToParents"
                  checked={bulkMessage.sendToParents}
                  onChange={(e) => setBulkMessage(prev => ({ ...prev, sendToParents: e.target.checked }))}
                />
                <Label htmlFor="sendToParents">Also send to parents</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSendBulkMessage} className="flex-1">
                  Send Message
                </Button>
                <Button variant="outline" onClick={() => setShowBulkMessageDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analytics Dialog */}
        <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Department Analytics Dashboard</DialogTitle>
              <DialogDescription>Overall department performance metrics and insights</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics.totalStudents}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics.averageCGPA}</div>
                    <div className="text-sm text-gray-600">Average CGPA</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{analytics.averageAttendance}%</div>
                    <div className="text-sm text-gray-600">Average Attendance</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{analytics.needsAttention}</div>
                    <div className="text-sm text-gray-600">Need Attention</div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Distribution */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CGPA Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Excellent (9.0+)</span>
                        <Badge variant="default">{students.filter(s => s.cgpa >= 9.0).length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Good (8.0-8.9)</span>
                        <Badge variant="secondary">{students.filter(s => s.cgpa >= 8.0 && s.cgpa < 9.0).length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average (7.0-7.9)</span>
                        <Badge variant="outline">{students.filter(s => s.cgpa >= 7.0 && s.cgpa < 8.0).length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Below Average (&lt;7.0)</span>
                        <Badge variant="destructive">{students.filter(s => s.cgpa < 7.0).length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Attendance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Excellent (90%+)</span>
                        <Badge variant="default">{students.filter(s => s.attendance >= 90).length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Good (80-89%)</span>
                        <Badge variant="secondary">{students.filter(s => s.attendance >= 80 && s.attendance < 90).length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average (75-79%)</span>
                        <Badge variant="outline">{students.filter(s => s.attendance >= 75 && s.attendance < 80).length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Poor (&lt;75%)</span>
                        <Badge variant="destructive">{students.filter(s => s.attendance < 75).length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowAnalyticsDialog(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default HODStudents;
