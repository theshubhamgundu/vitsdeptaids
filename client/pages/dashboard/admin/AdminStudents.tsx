import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import {
  getAllStudents,
  getStudentStats,
  subscribeToStudentData,
  StudentRecord,
} from "@/services/studentDataService";
import StudentsListViewer from "@/components/StudentsListViewer";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  BarChart3,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  Database,
} from "lucide-react";

const AdminStudents = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null,
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [studentStats, setStudentStats] = useState<any>({});

  const [newStudent, setNewStudent] = useState({
    fullName: "",
    hallTicket: "",
    email: "",
    phone: "",
    year: "",
    branch: "AI & DS",
    address: "",
    emergencyContact: "",
    admissionDate: "",
    status: "Active",
  });

  useEffect(() => {
    fetchStudents();
    fetchStudentStats();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStudentData(() => {
      fetchStudents();
      fetchStudentStats();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, yearFilter, statusFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await getAllStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentStats = async () => {
    try {
      const stats = await getStudentStats();
      setStudentStats(stats);
    } catch (error) {
      console.error("Error fetching student stats:", error);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter((student) => {
        if (yearFilter === "1") return student.year.includes("1st");
        if (yearFilter === "2") return student.year.includes("2nd");
        if (yearFilter === "3") return student.year.includes("3rd");
        if (yearFilter === "4") return student.year.includes("4th");
        return true;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (student) =>
          student.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    setFilteredStudents(filtered);
  };

  const handleAddStudent = async () => {
    // Validation
    const errors: any = {};

    if (!newStudent.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!newStudent.hallTicket.trim()) {
      errors.hallTicket = "Hall ticket is required";
    } else {
      // Check if hall ticket already exists
      const existingStudents = JSON.parse(
        localStorage.getItem("adminCreatedStudents") || "[]",
      );
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");

      const hallTicketExists =
        existingStudents.some(
          (s: any) => s.hallTicket === newStudent.hallTicket,
        ) ||
        localUsers.some((u: any) => u.hallTicket === newStudent.hallTicket);

      if (hallTicketExists) {
        errors.hallTicket = "Hall ticket already exists";
      }
    }

    if (!newStudent.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!newStudent.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(newStudent.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!newStudent.year) {
      errors.year = "Year is required";
    }

    if (!newStudent.admissionDate) {
      errors.admissionDate = "Admission date is required";
    }

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create new student record
      const newStudentRecord: StudentRecord = {
        id: crypto.randomUUID(),
        hallTicket: newStudent.hallTicket,
        fullName: newStudent.fullName,
        email: newStudent.email,
        phone: newStudent.phone,
        year: newStudent.year,
        section: "A",
        cgpa: 0.0,
        attendance: 0,
        status: newStudent.status,
        branch: newStudent.branch,
        semester: getDefaultSemester(newStudent.year),
        address: newStudent.address,
        emergencyContact: newStudent.emergencyContact,
        admissionDate: newStudent.admissionDate,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage for now (in real app, save to database)
      const existingStudents = JSON.parse(
        localStorage.getItem("adminCreatedStudents") || "[]",
      );
      existingStudents.push(newStudentRecord);
      localStorage.setItem(
        "adminCreatedStudents",
        JSON.stringify(existingStudents),
      );

      // Also add to localUsers for authentication
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      localUsers.push({
        id: newStudentRecord.id,
        name: newStudentRecord.fullName,
        role: "student",
        hallTicket: newStudentRecord.hallTicket,
        email: newStudentRecord.email,
        phone: newStudentRecord.phone,
        year: newStudentRecord.year,
        section: newStudentRecord.section,
        password: "student123", // Default password
        cgpa: newStudentRecord.cgpa,
        attendance: newStudentRecord.attendance,
        status: newStudentRecord.status,
        createdAt: newStudentRecord.createdAt,
      });
      localStorage.setItem("localUsers", JSON.stringify(localUsers));

      // Trigger storage event for real-time updates
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "localUsers",
          newValue: JSON.stringify(localUsers),
        }),
      );

      toast({
        title: "Student Added",
        description: `${newStudent.fullName} has been added successfully. Default password: student123`,
      });

      setShowAddDialog(false);
      setNewStudent({
        fullName: "",
        hallTicket: "",
        email: "",
        phone: "",
        year: "",
        branch: "AI & DS",
        address: "",
        emergencyContact: "",
        admissionDate: "",
        status: "Active",
      });

      // Refresh students list
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDefaultSemester = (year: string): number => {
    if (year.includes("1st")) return 2;
    if (year.includes("2nd")) return 4;
    if (year.includes("3rd")) return 6;
    if (year.includes("4th")) return 8;
    return 1;
  };

  const handleEditStudent = () => {
    // In real app, this would update via API
    console.log("Updating student:", selectedStudent);
    setShowEditDialog(false);
    setSelectedStudent(null);
    fetchStudents();
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      // Remove from localStorage
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const updatedUsers = localUsers.filter(
        (user: any) => user.id !== studentId,
      );
      localStorage.setItem("localUsers", JSON.stringify(updatedUsers));

      const adminStudents = JSON.parse(
        localStorage.getItem("adminCreatedStudents") || "[]",
      );
      const updatedAdminStudents = adminStudents.filter(
        (student: any) => student.id !== studentId,
      );
      localStorage.setItem(
        "adminCreatedStudents",
        JSON.stringify(updatedAdminStudents),
      );

      // Trigger storage event for real-time updates
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "localUsers",
          newValue: JSON.stringify(updatedUsers),
        }),
      );

      toast({
        title: "Student Deleted",
        description: "Student record has been removed successfully.",
      });

      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkUpload = () => {
    // In real app, this would process file upload
    console.log("Processing bulk upload");
    setShowBulkUpload(false);
  };

  const exportStudents = () => {
    // In real app, this would generate and download CSV/Excel
    console.log("Exporting students data");
    toast({
      title: "Export Started",
      description:
        "Student data is being exported. You'll receive the file shortly.",
    });
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Admin User">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Student Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Complete student administration and records management
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={exportStudents} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Students</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or Excel file with student data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports CSV, XLSX files
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleBulkUpload} className="flex-1">
                      Upload & Process
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowBulkUpload(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter student information to create a new record
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={newStudent.fullName}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hallTicket">Hall Ticket</Label>
                      <Input
                        id="hallTicket"
                        value={newStudent.hallTicket}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            hallTicket: e.target.value,
                          }))
                        }
                        placeholder="e.g., 20AI001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="student@vignanits.ac.in"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newStudent.phone}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={newStudent.year}
                        onValueChange={(value) =>
                          setNewStudent((prev) => ({ ...prev, year: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admissionDate">Admission Date</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        value={newStudent.admissionDate}
                        onChange={(e) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            admissionDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={newStudent.address}
                      onChange={(e) =>
                        setNewStudent((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Enter full address"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={newStudent.emergencyContact}
                      onChange={(e) =>
                        setNewStudent((prev) => ({
                          ...prev,
                          emergencyContact: e.target.value,
                        }))
                      }
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddStudent} className="flex-1">
                      Add Student
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentStats.total || students.length}
              </div>
              <p className="text-xs text-muted-foreground">
                All registered students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Students
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {studentStats.byStatus?.active ||
                  students.filter((s) => s.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently enrolled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Graduated</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {studentStats.byStatus?.graduated ||
                  students.filter((s) => s.status === "Graduated").length}
              </div>
              <p className="text-xs text-muted-foreground">Completed program</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg CGPA</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {studentStats.averageCgpa
                  ? studentStats.averageCgpa.toFixed(2)
                  : students.length > 0
                    ? (
                        students.reduce((sum, s) => sum + s.cgpa, 0) /
                        students.length
                      ).toFixed(2)
                    : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Department average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="registered" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="registered"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Registered Students</span>
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Department Database</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registered" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters & Search</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Students</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, hall ticket, or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Filter by Year</Label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Filter by Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Results</Label>
                    <div className="text-sm text-gray-600">
                      Showing {filteredStudents.length} of {students.length}{" "}
                      students
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle>Students Directory</CardTitle>
                <CardDescription>
                  Complete list of all students with management options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Hall Ticket</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={undefined} />
                              <AvatarFallback>
                                {student.fullName
                                  ? student.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "ST"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {student.fullName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.hallTicket}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Year {student.year}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{student.cgpa}</span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${getAttendanceColor(student.attendance)}`}
                          >
                            {student.attendance}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No students found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or filters.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <StudentsListViewer />
          </TabsContent>
        </Tabs>

        {/* Edit Student Dialog */}
        {selectedStudent && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Edit Student: {selectedStudent.fullName}
                </DialogTitle>
                <DialogDescription>
                  Update student information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="editFullName">Full Name</Label>
                    <Input
                      id="editFullName"
                      value={selectedStudent.fullName}
                      onChange={(e) =>
                        setSelectedStudent((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editHallTicket">Hall Ticket</Label>
                    <Input
                      id="editHallTicket"
                      value={selectedStudent.hallTicket}
                      onChange={(e) =>
                        setSelectedStudent((prev) => ({
                          ...prev,
                          hallTicket: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={selectedStudent.email}
                      onChange={(e) =>
                        setSelectedStudent((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      value={selectedStudent.phone}
                      onChange={(e) =>
                        setSelectedStudent((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="editYear">Year</Label>
                    <Select
                      value={selectedStudent.year.toString()}
                      onValueChange={(value) =>
                        setSelectedStudent((prev) => ({
                          ...prev,
                          year: value, // Keep as string to match interface
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">Status</Label>
                    <Select
                      value={selectedStudent.status}
                      onValueChange={(value) =>
                        setSelectedStudent((prev) => ({
                          ...prev,
                          status: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Graduated">Graduated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleEditStudent} className="flex-1">
                    Update Student
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
