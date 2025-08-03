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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllFaculty, getFacultyByRole } from "@/data/facultyData";
import {
  Calendar,
  Clock,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  Filter,
  Search,
  FileSpreadsheet,
  Settings
} from "lucide-react";

const HODTimetables = () => {
  const [timetables, setTimetables] = useState([
    {
      id: 1,
      title: "1st Year AI & DS Timetable",
      year: "1st Year",
      semester: "2nd Semester",
      status: "Active",
      effectiveFrom: "2025-01-15",
      createdBy: "Dr. Priya Sharma",
      createdDate: "2025-01-10",
      lastModified: "2025-03-15",
      studentsCount: 60,
      type: "Generated",
      subjects: ["Mathematics", "Programming", "Physics", "English"],
      facultyAssigned: true
    },
    {
      id: 2,
      title: "2nd Year AI & DS Timetable",
      year: "2nd Year",
      semester: "4th Semester",
      status: "Active",
      effectiveFrom: "2025-01-15",
      createdBy: "Admin",
      createdDate: "2025-01-08",
      lastModified: "2025-03-10",
      studentsCount: 55,
      type: "Uploaded",
      subjects: ["Data Structures", "Database", "Statistics", "Machine Learning Basics"],
      facultyAssigned: true
    },
    {
      id: 3,
      title: "3rd Year AI & DS Timetable",
      year: "3rd Year",
      semester: "6th Semester",
      status: "Active",
      effectiveFrom: "2025-01-15",
      createdBy: "Dr. Priya Sharma",
      createdDate: "2025-01-12",
      lastModified: "2025-03-20",
      studentsCount: 50,
      type: "Generated",
      subjects: ["Machine Learning", "Deep Learning", "Data Science", "AI Ethics"],
      facultyAssigned: true
    },
    {
      id: 4,
      title: "4th Year AI & DS Timetable",
      year: "4th Year",
      semester: "8th Semester",
      status: "Draft",
      effectiveFrom: "2025-07-15",
      createdBy: "Dr. Priya Sharma",
      createdDate: "2025-03-18",
      lastModified: "2025-03-20",
      studentsCount: 45,
      type: "Generated",
      subjects: ["Advanced AI", "Capstone Project", "Industry Training", "Research Methodology"],
      facultyAssigned: false
    }
  ]);

  const [facultyAssignments, setFacultyAssignments] = useState(getAllFaculty().map((faculty, index) => ({
    id: faculty.id,
    facultyName: faculty.name,
    subjects: faculty.specialization.split(", ").slice(0, 2), // Use first 2 specializations as subjects
    year: ["1st Year", "2nd Year", "3rd Year", "4th Year"][index % 4],
    hoursPerWeek: Math.floor(Math.random() * 10) + 10, // Random between 10-20
    classrooms: [`Room-${300 + parseInt(faculty.id)}`, `Lab-${faculty.id}`],
    status: "Assigned"
  })));

  const [conflicts, setConflicts] = useState([]);

  const [showTimetableDialog, setShowTimetableDialog] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [filterYear, setFilterYear] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newTimetable, setNewTimetable] = useState({
    title: "",
    year: "",
    semester: "",
    effectiveFrom: "",
    type: "Generated"
  });

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];
  const timeSlots = ["9:00-10:00", "10:00-11:00", "11:15-12:15", "12:15-1:15", "2:00-3:00", "3:00-4:00", "4:15-5:15"];
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleCreateTimetable = () => {
    if (!newTimetable.year || !newTimetable.semester) return;

    const timetable = {
      id: Date.now(),
      title: newTimetable.title || `${newTimetable.year} AI & DS Timetable`,
      year: newTimetable.year,
      semester: newTimetable.semester,
      status: "Draft",
      effectiveFrom: newTimetable.effectiveFrom || new Date().toISOString().split('T')[0],
      createdBy: "Dr. Priya Sharma",
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      studentsCount: 50,
      type: newTimetable.type,
      subjects: [],
      facultyAssigned: false
    };

    setTimetables(prev => [timetable, ...prev]);
    setShowTimetableDialog(false);
    setNewTimetable({ title: "", year: "", semester: "", effectiveFrom: "", type: "Generated" });
  };

  const handleActivateTimetable = (id) => {
    setTimetables(prev => prev.map(t =>
      t.id === id ? { ...t, status: "Active" } : t
    ));
  };

  const handleDeactivateTimetable = (id) => {
    setTimetables(prev => prev.map(t =>
      t.id === id ? { ...t, status: "Inactive" } : t
    ));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'unresolved':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTimetables = timetables.filter(timetable => {
    const matchesSearch = timetable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timetable.year.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === "all" || timetable.year === filterYear;
    const matchesStatus = filterStatus === "all" || timetable.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  return (
    <DashboardLayout userType="hod" userName={getFacultyByRole("HOD")[0]?.name || "HOD"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timetable Management</h1>
            <p className="text-gray-600">Manage department timetables and faculty assignments</p>
          </div>
          <Dialog open={showTimetableDialog} onOpenChange={setShowTimetableDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Timetable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Timetable</DialogTitle>
                <DialogDescription>Create timetable for a specific year and semester</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Select value={newTimetable.year} onValueChange={(value) => setNewTimetable(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
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
                    <Select value={newTimetable.semester} onValueChange={(value) => setNewTimetable(prev => ({ ...prev, semester: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
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
                  <Label>Timetable Title (Optional)</Label>
                  <Input
                    value={newTimetable.title}
                    onChange={(e) => setNewTimetable(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Will auto-generate if empty"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Effective From</Label>
                  <Input
                    type="date"
                    value={newTimetable.effectiveFrom}
                    onChange={(e) => setNewTimetable(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Creation Type</Label>
                  <Select value={newTimetable.type} onValueChange={(value) => setNewTimetable(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Generated">Generated Template</SelectItem>
                      <SelectItem value="Uploaded">Upload Existing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateTimetable} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Create Timetable
                  </Button>
                  <Button variant="outline" onClick={() => setShowTimetableDialog(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Timetables</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timetables.filter(t => t.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timetables.reduce((sum, t) => sum + t.studentsCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all years</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Assigned</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facultyAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Teaching assignments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conflicts.filter(c => c.status === "Unresolved").length}</div>
              <p className="text-xs text-muted-foreground">Need resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="timetables" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timetables">📅 Timetables</TabsTrigger>
            <TabsTrigger value="assignments">👨‍🏫 Faculty Assignments</TabsTrigger>
            <TabsTrigger value="conflicts">⚠️ Conflicts</TabsTrigger>
          </TabsList>

          {/* Timetables Tab */}
          <TabsContent value="timetables" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Department Timetables</CardTitle>
                    <CardDescription>Manage timetables for all academic years</CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search timetables..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
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
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timetable</TableHead>
                      <TableHead>Year/Semester</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Faculty Status</TableHead>
                      <TableHead>Effective From</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimetables.map((timetable) => (
                      <TableRow key={timetable.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{timetable.title}</div>
                            <div className="text-sm text-gray-600">
                              Modified: {new Date(timetable.lastModified).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{timetable.year}</div>
                            <div className="text-sm text-gray-600">{timetable.semester}</div>
                          </div>
                        </TableCell>
                        <TableCell>{timetable.studentsCount}</TableCell>
                        <TableCell>
                          <Badge variant={timetable.type === "Generated" ? "default" : "outline"}>
                            {timetable.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={timetable.facultyAssigned ? getStatusColor("assigned") : getStatusColor("unassigned")}>
                            {timetable.facultyAssigned ? "Assigned" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(timetable.effectiveFrom).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(timetable.status)}>
                            {timetable.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                            {timetable.status === "Draft" && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleActivateTimetable(timetable.id)}
                                className="text-green-600 hover:text-green-700"
                                title="Activate"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Faculty Assignments</CardTitle>
                    <CardDescription>Current teaching assignments and workload distribution</CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Assignment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Years</TableHead>
                      <TableHead>Hours/Week</TableHead>
                      <TableHead>Classrooms</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facultyAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.facultyName}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {assignment.subjects.map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{assignment.year}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{assignment.hoursPerWeek}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              assignment.hoursPerWeek > 15 ? 'bg-red-500' : 
                              assignment.hoursPerWeek > 12 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {assignment.classrooms.join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Settings className="h-4 w-4" />
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

          {/* Conflicts Tab */}
          <TabsContent value="conflicts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timetable Conflicts</CardTitle>
                <CardDescription>Scheduling conflicts that need resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conflicts.map((conflict) => (
                    <div key={conflict.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <h3 className="font-semibold">{conflict.type}</h3>
                            <Badge className={getSeverityColor(conflict.severity)}>
                              {conflict.severity}
                            </Badge>
                            <Badge className={getStatusColor(conflict.status)}>
                              {conflict.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {conflict.description}
                          </p>
                          <div className="text-sm">
                            <span className="font-medium">Affected:</span> {conflict.affectedYear} • 
                            <span className="font-medium"> Date:</span> {new Date(conflict.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {conflict.status === "Unresolved" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
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

export default HODTimetables;
