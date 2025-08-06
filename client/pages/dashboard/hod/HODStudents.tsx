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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllStudents } from "@/services/studentDataService";
import { getAllStudentsFromList, getStudentsListStats } from "@/services/studentsListService";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Users,
  MessageCircle,
  Bell,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Eye,
  Edit,
  Send,
  Download
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  fullName: string;
  hallTicket: string;
  year: string;
  semester: string;
  branch: string;
  email: string;
  phone?: string;
  cgpa?: number;
  attendance?: number;
  status?: string;
}

const HODStudents = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [showBulkMessageDialog, setShowBulkMessageDialog] = useState(false);

  const [bulkMessage, setBulkMessage] = useState({
    title: "",
    message: "",
    type: "General"
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterYear, filterStatus]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const studentsData = await getAllStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        (student.name || student.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply year filter
    if (filterYear !== "all") {
      filtered = filtered.filter(student => student.year === filterYear);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(student => {
        const cgpa = student.cgpa || 0;
        const attendance = student.attendance || 0;
        
        switch (filterStatus) {
          case 'excellent':
            return cgpa >= 8.5 && attendance >= 85;
          case 'good':
            return cgpa >= 7.5 && attendance >= 75;
          case 'needs_attention':
            return cgpa < 7.5 || attendance < 75;
          default:
            return true;
        }
      });
    }

    setFilteredStudents(filtered);
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  const handleSendBulkMessage = () => {
    if (!bulkMessage.title || !bulkMessage.message || selectedStudents.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select students",
        variant: "destructive",
      });
      return;
    }
    
    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem('hodMessages') || '[]');
    const newMessage = {
      id: Date.now().toString(),
      ...bulkMessage,
      recipients: selectedStudents,
      sentDate: new Date().toISOString(),
      sentBy: 'HOD'
    };
    
    messages.unshift(newMessage);
    localStorage.setItem('hodMessages', JSON.stringify(messages));
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedStudents.length} students`,
    });
    
    setShowBulkMessageDialog(false);
    setBulkMessage({ title: "", message: "", type: "General" });
    setSelectedStudents([]);
  };

  const getPerformanceStatus = (student: Student) => {
    const cgpa = student.cgpa || 0;
    const attendance = student.attendance || 0;
    
    if (cgpa >= 8.5 && attendance >= 85) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (cgpa >= 7.5 && attendance >= 75) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Needs Attention', color: 'bg-red-100 text-red-800' };
  };

  const years = Array.from(new Set(students.map(s => s.year))).filter(Boolean);
  
  // Calculate analytics
  const analytics = {
    totalStudents: students.length,
    excellentPerformers: students.filter(s => (s.cgpa || 0) >= 8.5 && (s.attendance || 0) >= 85).length,
    needsAttention: students.filter(s => (s.cgpa || 0) < 7.5 || (s.attendance || 0) < 75).length,
    averageCGPA: students.length > 0 ? (students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length).toFixed(2) : '0.00',
    averageAttendance: students.length > 0 ? (students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length).toFixed(1) : '0.0'
  };

  if (loading) {
    return (
      <DashboardLayout userType="hod" userName="Dr. Raj Kumar">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="hod" userName="Dr. Raj Kumar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Students</h1>
            <p className="text-gray-600">Department student database and management</p>
          </div>
          <div className="flex space-x-2">
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

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalStudents}</div>
              <p className="text-xs text-muted-foreground">All registered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageCGPA}</div>
              <p className="text-xs text-muted-foreground">{analytics.excellentPerformers} excellent</p>
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
              <p className="text-xs text-muted-foreground">Requires support</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <SelectValue placeholder="All Years" />
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
                  <SelectValue placeholder="All Performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performance</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="needs_attention">Needs Attention</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
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
                  Showing {filteredStudents.length} of {students.length} students
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Academic</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const performance = getPerformanceStatus(student);
                    return (
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
                              <div className="font-medium">{student.name || student.fullName}</div>
                              <div className="text-sm text-gray-600">{student.hallTicket}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{student.year}</div>
                            <div className="text-xs text-gray-600">{student.semester || 'N/A'}</div>
                            <div className="text-xs text-gray-600">{student.branch || 'AI & DS'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant={student.cgpa >= 8.5 ? "default" : student.cgpa >= 7.5 ? "secondary" : "outline"}>
                                CGPA: {student.cgpa || 'N/A'}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm">Attendance: {student.attendance || 0}%</div>
                              <div className={`w-2 h-2 rounded-full ${(student.attendance || 0) >= 75 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-32">{student.email || 'N/A'}</span>
                            </div>
                            {student.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{student.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={performance.color}>
                            {performance.label}
                          </Badge>
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
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Student Details Dialog */}
        {selectedStudent && (
          <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedStudent.name || selectedStudent.fullName}</DialogTitle>
                <DialogDescription>Student details and performance metrics</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Hall Ticket:</strong> {selectedStudent.hallTicket}</div>
                  <div><strong>Year:</strong> {selectedStudent.year}</div>
                  <div><strong>Semester:</strong> {selectedStudent.semester || 'N/A'}</div>
                  <div><strong>Branch:</strong> {selectedStudent.branch || 'AI & DS'}</div>
                  <div><strong>Email:</strong> {selectedStudent.email || 'N/A'}</div>
                  <div><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</div>
                  <div><strong>CGPA:</strong> {selectedStudent.cgpa || 'N/A'}</div>
                  <div><strong>Attendance:</strong> {selectedStudent.attendance || 0}%</div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Send Message</Button>
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
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Alert">Alert</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
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
      </div>
    </DashboardLayout>
  );
};

export default HODStudents;
