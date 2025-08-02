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
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Save,
  Eye,
  Calculator
} from "lucide-react";

const FacultyResults = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      hallTicket: "20AI001",
      name: "Rahul Sharma",
      year: "3rd Year",
      semester: "6th Semester",
      subject: "Machine Learning",
      internalMarks: 85,
      externalMarks: 78,
      totalMarks: 163,
      maxMarks: 200,
      grade: "A",
      status: "Pass",
      lastUpdated: "2025-03-10"
    },
    {
      id: 2,
      hallTicket: "20AI002",
      name: "Priya Reddy",
      year: "3rd Year",
      semester: "6th Semester",
      subject: "Machine Learning",
      internalMarks: 92,
      externalMarks: 85,
      totalMarks: 177,
      maxMarks: 200,
      grade: "A+",
      status: "Pass",
      lastUpdated: "2025-03-10"
    },
    {
      id: 3,
      hallTicket: "20AI003",
      name: "Amit Kumar",
      year: "3rd Year",
      semester: "6th Semester",
      subject: "Machine Learning",
      internalMarks: 72,
      externalMarks: 65,
      totalMarks: 137,
      maxMarks: 200,
      grade: "B+",
      status: "Pass",
      lastUpdated: "2025-03-10"
    },
    {
      id: 4,
      hallTicket: "20AI004",
      name: "Sneha Patel",
      year: "3rd Year",
      semester: "6th Semester",
      subject: "Machine Learning",
      internalMarks: 88,
      externalMarks: 82,
      totalMarks: 170,
      maxMarks: 200,
      grade: "A",
      status: "Pass",
      lastUpdated: "2025-03-10"
    }
  ]);

  const [subjects] = useState([
    "Machine Learning",
    "Deep Learning", 
    "Data Science",
    "Programming",
    "Statistics",
    "Mathematics"
  ]);

  const [examTypes] = useState([
    "Mid-term",
    "End-term", 
    "Internal Assessment",
    "Project",
    "Quiz"
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newResult, setNewResult] = useState({
    hallTicket: "",
    subject: "",
    examType: "Mid-term",
    internalMarks: "",
    externalMarks: "",
    maxMarks: "200"
  });

  const calculateGrade = (totalMarks, maxMarks) => {
    const percentage = (totalMarks / maxMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    return "F";
  };

  const getStatus = (totalMarks, maxMarks) => {
    const percentage = (totalMarks / maxMarks) * 100;
    return percentage >= 40 ? "Pass" : "Fail";
  };

  const handleAddResult = () => {
    if (!newResult.hallTicket || !newResult.subject || !newResult.internalMarks || !newResult.externalMarks) return;

    const internal = parseInt(newResult.internalMarks);
    const external = parseInt(newResult.externalMarks);
    const max = parseInt(newResult.maxMarks);
    const total = internal + external;

    const result = {
      id: Date.now(),
      hallTicket: newResult.hallTicket,
      name: `Student ${newResult.hallTicket}`, // In real app, fetch from student database
      year: "3rd Year",
      semester: "6th Semester",
      subject: newResult.subject,
      internalMarks: internal,
      externalMarks: external,
      totalMarks: total,
      maxMarks: max,
      grade: calculateGrade(total, max),
      status: getStatus(total, max),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setStudents(prev => [result, ...prev]);
    setShowAddDialog(false);
    setNewResult({
      hallTicket: "",
      subject: "",
      examType: "Mid-term",
      internalMarks: "",
      externalMarks: "",
      maxMarks: "200"
    });
  };

  const handleUpdateResult = (id, updatedData) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { 
        ...student, 
        ...updatedData, 
        totalMarks: updatedData.internalMarks + updatedData.externalMarks,
        grade: calculateGrade(updatedData.internalMarks + updatedData.externalMarks, updatedData.maxMarks),
        status: getStatus(updatedData.internalMarks + updatedData.externalMarks, updatedData.maxMarks),
        lastUpdated: new Date().toISOString().split('T')[0]
      } : student
    ));
    setEditingStudent(null);
  };

  const handleDeleteResult = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.hallTicket.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || student.subject === filterSubject;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const stats = {
    totalStudents: students.length,
    passedStudents: students.filter(s => s.status === "Pass").length,
    averageMarks: students.reduce((acc, s) => acc + s.totalMarks, 0) / students.length || 0,
    highestMarks: Math.max(...students.map(s => s.totalMarks), 0)
  };

  const gradeDistribution = {
    "A+": students.filter(s => s.grade === "A+").length,
    "A": students.filter(s => s.grade === "A").length,
    "B+": students.filter(s => s.grade === "B+").length,
    "B": students.filter(s => s.grade === "B").length,
    "C": students.filter(s => s.grade === "C").length,
    "F": students.filter(s => s.grade === "F").length
  };

  return (
    <DashboardLayout userType="faculty" userName="Dr. Anita Verma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Results Management</h1>
            <p className="text-gray-600">Enter and manage student results and grades</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Results</DialogTitle>
                  <DialogDescription>Upload results using Excel file</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <FileSpreadsheet className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600 mb-2">
                        Click to upload Excel file or drag and drop
                      </div>
                      <Button variant="outline">Choose Excel File</Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Excel format: Hall Ticket, Student Name, Subject, Internal Marks, External Marks, Max Marks</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1">Upload Results</Button>
                    <Button variant="outline" onClick={() => setShowBulkUploadDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Result
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student Result</DialogTitle>
                  <DialogDescription>Enter marks for a student</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hall Ticket Number</Label>
                      <Input
                        value={newResult.hallTicket}
                        onChange={(e) => setNewResult(prev => ({ ...prev, hallTicket: e.target.value }))}
                        placeholder="20AI001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select value={newResult.subject} onValueChange={(value) => setNewResult(prev => ({ ...prev, subject: value }))}>
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
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Internal Marks</Label>
                      <Input
                        type="number"
                        value={newResult.internalMarks}
                        onChange={(e) => setNewResult(prev => ({ ...prev, internalMarks: e.target.value }))}
                        placeholder="85"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>External Marks</Label>
                      <Input
                        type="number"
                        value={newResult.externalMarks}
                        onChange={(e) => setNewResult(prev => ({ ...prev, externalMarks: e.target.value }))}
                        placeholder="78"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Marks</Label>
                      <Input
                        type="number"
                        value={newResult.maxMarks}
                        onChange={(e) => setNewResult(prev => ({ ...prev, maxMarks: e.target.value }))}
                        placeholder="200"
                      />
                    </div>
                  </div>

                  {newResult.internalMarks && newResult.externalMarks && newResult.maxMarks && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Preview:</div>
                      <div className="font-medium">
                        Total: {parseInt(newResult.internalMarks || 0) + parseInt(newResult.externalMarks || 0)}/{newResult.maxMarks}
                      </div>
                      <div className="text-sm">
                        Grade: {calculateGrade(parseInt(newResult.internalMarks || 0) + parseInt(newResult.externalMarks || 0), parseInt(newResult.maxMarks || 200))} • 
                        Status: {getStatus(parseInt(newResult.internalMarks || 0) + parseInt(newResult.externalMarks || 0), parseInt(newResult.maxMarks || 200))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button onClick={handleAddResult} className="flex-1">Add Result</Button>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Results</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Student records</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((stats.passedStudents / stats.totalStudents) * 100 || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">{stats.passedStudents} students passed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageMarks.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Out of 200</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highestMarks}</div>
              <p className="text-xs text-muted-foreground">Best performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Overview of student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">Grade {grade}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
            <CardDescription>Manage and update student marks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Internal</TableHead>
                  <TableHead>External</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.hallTicket}</div>
                      </div>
                    </TableCell>
                    <TableCell>{student.subject}</TableCell>
                    <TableCell>{student.internalMarks}</TableCell>
                    <TableCell>{student.externalMarks}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {student.totalMarks}/{student.maxMarks}
                      </div>
                      <div className="text-sm text-gray-600">
                        {((student.totalMarks / student.maxMarks) * 100).toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.grade === "A+" || student.grade === "A" ? "default" : "secondary"}>
                        {student.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Pass" ? "default" : "destructive"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(student.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingStudent(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteResult(student.id)}>
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

        {/* Edit Dialog */}
        {editingStudent && (
          <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Result</DialogTitle>
                <DialogDescription>Update marks for {editingStudent.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Internal Marks</Label>
                    <Input
                      type="number"
                      value={editingStudent.internalMarks}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, internalMarks: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>External Marks</Label>
                    <Input
                      type="number"
                      value={editingStudent.externalMarks}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, externalMarks: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Marks</Label>
                    <Input
                      type="number"
                      value={editingStudent.maxMarks}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, maxMarks: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleUpdateResult(editingStudent.id, editingStudent)} className="flex-1">
                    Update Result
                  </Button>
                  <Button variant="outline" onClick={() => setEditingStudent(null)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyResults;
