import { useState, useEffect } from "react";
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
  const [timetables, setTimetables] = useState<any[]>([]);

  const [facultyAssignments, setFacultyAssignments] = useState<any[]>([]);

  const [conflicts, setConflicts] = useState([]);

  // View-only screen for HOD; no creation dialogs
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

  // Load timetable data on component mount
  useEffect(() => {
    loadTimetableData();
  }, []);

  const loadTimetableData = () => {
    try {
      // Load timetables created by admin only
      const adminTimetables = JSON.parse(localStorage.getItem('admin_timetables') || '[]');
      setTimetables(adminTimetables);

      // Load faculty assignments from localStorage (placeholder for database)
      const savedAssignments = JSON.parse(localStorage.getItem('hod_faculty_assignments') || '[]');
      setFacultyAssignments(savedAssignments);
    } catch (error) {
      console.error('Error loading timetable data:', error);
    }
  };

  // Disable creation in HOD view; only admin timetables are displayed
  const handleCreateTimetable = () => {
    setShowTimetableDialog(false);
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
            <h1 className="text-2xl font-bold text-gray-900">Timetables</h1>
            <p className="text-gray-600">View department timetables created by Admin</p>
          </div>
        </div>

        {/* Simplified: no stats */}

        {/* Main Content */}
        <Tabs defaultValue="timetables" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="timetables">📅 Timetables</TabsTrigger>
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

          {/* Only Timetables tab remains */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HODTimetables;
