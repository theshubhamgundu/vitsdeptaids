import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  getAllFacultyAssignments, 
  upsertFacultyAssignment, 
  deleteFacultyAssignment,
  assignStudentsToCounsellors,
  getYearAssignmentSummary,
  assignStudentToCounsellor,
  removeStudentAssignment,
  FacultyAssignment,
  YearAssignmentSummary
} from "@/services/facultyAssignmentService";
import { getAllFaculty } from "@/services/authService";
import { getAllStudentsFromData } from "@/services/studentDataMappingService";
import { 
  Users, 
  UserCheck, 
  Settings, 
  Plus, 
  Trash2, 
  RefreshCw,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter
} from "lucide-react";

const FacultyAssignments = () => {
  const [facultyAssignments, setFacultyAssignments] = useState<FacultyAssignment[]>([]);
  const [yearSummaries, setYearSummaries] = useState<YearAssignmentSummary[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  
  // Form state for new assignment
  const [newAssignment, setNewAssignment] = useState({
    faculty_id: '',
    year: '',
    role: 'counsellor' as 'coordinator' | 'counsellor',
    max_students: 20
  });

  // Student selection state
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSelectionMode, setStudentSelectionMode] = useState<'year' | 'range' | 'individual'>('year');
  const [htRangeStart, setHtRangeStart] = useState('');
  const [htRangeEnd, setHtRangeEnd] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignments, summaries, facultyData, studentsData] = await Promise.all([
        getAllFacultyAssignments(),
        getYearAssignmentSummary(),
        getAllFaculty(),
        getAllStudentsFromData()
      ]);
      
      console.log("🔍 FacultyAssignments - Loaded data:", {
        assignments: assignments?.length,
        summaries: summaries?.length,
        facultyData: facultyData?.length,
        studentsData: studentsData?.length
      });
      
      console.log("🔍 FacultyAssignments - Sample students data:", studentsData?.slice(0, 3));
      
      setFacultyAssignments(assignments);
      setYearSummaries(summaries);
      setFaculty(facultyData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load faculty assignment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.faculty_id || !newAssignment.year || !newAssignment.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await upsertFacultyAssignment(newAssignment);
      if (success) {
        toast({
          title: "Success",
          description: "Faculty assignment created successfully",
        });
        setNewAssignment({
          faculty_id: '',
          year: '',
          role: 'counsellor',
          max_students: 20
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: "Failed to create faculty assignment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create faculty assignment",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAssignment = async (facultyId: string, year: string) => {
    try {
      const success = await deleteFacultyAssignment(facultyId, year);
      if (success) {
        toast({
          title: "Success",
          description: "Faculty assignment deleted successfully",
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete faculty assignment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to delete faculty assignment",
        variant: "destructive"
      });
    }
  };

  const handleAutoAssign = async (year: string) => {
    try {
      setAssigning(true);
      const success = await assignStudentsToCounsellors(year);
      if (success) {
        toast({
          title: "Success",
          description: `Students automatically assigned to counsellors for ${year}`,
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: `Failed to auto-assign students for ${year}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error auto-assigning students:', error);
      toast({
        title: "Error",
        description: `Failed to auto-assign students for ${year}`,
        variant: "destructive"
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleManualStudentAssignment = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select students to assign",
        variant: "destructive"
      });
      return;
    }

    if (!newAssignment.faculty_id || !newAssignment.year) {
      toast({
        title: "Validation Error",
        description: "Please select faculty and year",
        variant: "destructive"
      });
      return;
    }

    try {
      setAssigning(true);
      let success = true;

      // Assign each selected student
      for (const studentHtNo of selectedStudents) {
        const result = await assignStudentToCounsellor(
          studentHtNo, 
          newAssignment.faculty_id, 
          newAssignment.year
        );
        if (!result) success = false;
      }

      if (success) {
        toast({
          title: "Success",
          description: `${selectedStudents.length} students assigned successfully`,
        });
        setSelectedStudents([]);
        loadData();
      } else {
        toast({
          title: "Error",
          description: "Some students failed to assign",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error assigning students:', error);
      toast({
        title: "Error",
        description: "Failed to assign students",
        variant: "destructive"
      });
    } finally {
      setAssigning(false);
    }
  };

  const getFacultyName = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    return facultyMember ? facultyMember.name : 'Unknown Faculty';
  };

  const getStudentCountByYear = (year: string) => {
    return students.filter(s => s.year === year).length;
  };

  // Filter students based on selection mode
  const getFilteredStudents = () => {
    let filtered = students;

    // Filter by year if specified
    if (selectedYear) {
      filtered = filtered.filter(s => s.year === selectedYear);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.hallTicket?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by HT range if in range mode
    if (studentSelectionMode === 'range' && htRangeStart && htRangeEnd) {
      filtered = filtered.filter(s => {
        const htNo = s.hallTicket;
        return htNo >= htRangeStart && htNo <= htRangeEnd;
      });
    }

    return filtered;
  };

  const handleStudentSelection = (studentHtNo: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentHtNo]);
    } else {
      setSelectedStudents(prev => prev.filter(ht => ht !== studentHtNo));
    }
  };

  const handleSelectAllInYear = (year: string) => {
    const yearStudents = students.filter(s => s.year === year);
    const yearStudentHtNos = yearStudents.map(s => s.hallTicket);
    setSelectedStudents(yearStudentHtNos);
    setSelectedYear(year);
  };

  const handleSelectByRange = () => {
    if (!htRangeStart || !htRangeEnd) {
      toast({
        title: "Validation Error",
        description: "Please enter both start and end HT numbers",
        variant: "destructive"
      });
      return;
    }

    const rangeStudents = students.filter(s => 
      s.hallTicket >= htRangeStart && s.hallTicket <= htRangeEnd
    );
    const rangeStudentHtNos = rangeStudents.map(s => s.hallTicket);
    setSelectedStudents(rangeStudentHtNos);
    
    toast({
      title: "Success",
      description: `${rangeStudents.length} students selected in range ${htRangeStart} to ${htRangeEnd}`,
    });
  };

  const clearSelection = () => {
    setSelectedStudents([]);
    setHtRangeStart('');
    setHtRangeEnd('');
    setSelectedYear('');
    setSearchTerm('');
  };

  const filteredStudents = getFilteredStudents();
  
  // Debug logging
  console.log("🔍 FacultyAssignments - Filtered students:", {
    totalStudents: students.length,
    filteredStudents: filteredStudents.length,
    selectedYear,
    searchTerm,
    sampleFiltered: filteredStudents.slice(0, 3)
  });

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Admin User">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading faculty assignments...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <UserCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Faculty Assignments</h1>
              <p className="text-blue-100">
                Manage faculty roles and student assignments by year
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="create">Create Assignment</TabsTrigger>
            <TabsTrigger value="student-assignment">Student Assignment</TabsTrigger>
            <TabsTrigger value="auto-assign">Auto Assign</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {yearSummaries.map((summary) => (
                <Card key={summary.year}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{summary.year}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summary.total_students}</div>
                    <p className="text-xs text-muted-foreground">Total Students</p>
                    <div className="mt-2 space-y-1">
                      {summary.coordinator && (
                        <div className="flex items-center text-xs">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-green-600">Coordinator: {summary.coordinator.name || 'Assigned'}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-600">
                        {summary.counsellors.length} Counsellors
                      </div>
                      <div className="text-xs text-gray-600">
                        {summary.assigned_students} Assigned / {summary.unassigned_students} Unassigned
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Year Details */}
            <div className="space-y-4">
              {yearSummaries.map((summary) => (
                <Card key={summary.year}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{summary.year} Details</span>
                      <Button
                        onClick={() => handleAutoAssign(summary.year)}
                        disabled={assigning}
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Auto Assign
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Coordinator */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Coordinator</Label>
                        {summary.coordinator ? (
                          <div className="p-3 border rounded-lg bg-green-50">
                            <div className="font-medium text-sm">{summary.coordinator.name || 'Assigned'}</div>
                            <div className="text-xs text-gray-600">ID: {summary.coordinator.faculty_id}</div>
                          </div>
                        ) : (
                          <div className="p-3 border rounded-lg bg-yellow-50">
                            <div className="text-sm text-yellow-800">No Coordinator Assigned</div>
                          </div>
                        )}
                      </div>

                      {/* Counsellors */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Counsellors</Label>
                        {summary.counsellors.length > 0 ? (
                          <div className="space-y-2">
                            {summary.counsellors.map((counsellor) => (
                              <div key={counsellor.id} className="p-3 border rounded-lg bg-blue-50">
                                <div className="font-medium text-sm">{counsellor.name || 'Assigned'}</div>
                                <div className="text-xs text-gray-600">
                                  {counsellor.assigned_students} / {counsellor.max_students} students
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 border rounded-lg bg-yellow-50">
                            <div className="text-sm text-yellow-800">No Counsellors Assigned</div>
                          </div>
                        )}
                      </div>

                      {/* Statistics */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Statistics</Label>
                        <div className="p-3 border rounded-lg bg-gray-50">
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-medium">{summary.total_students}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Assigned:</span>
                              <span className="font-medium text-green-600">{summary.assigned_students}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Unassigned:</span>
                              <span className="font-medium text-red-600">{summary.unassigned_students}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Faculty Assignments</CardTitle>
                <CardDescription>View and manage all faculty role assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Max Students</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facultyAssignments.map((assignment) => (
                      <TableRow key={`${assignment.faculty_id}-${assignment.year}`}>
                        <TableCell className="font-medium">
                          {getFacultyName(assignment.faculty_id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{assignment.year}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={assignment.role === 'coordinator' ? 'default' : 'secondary'}>
                            {assignment.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {assignment.max_students || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment.faculty_id, assignment.year)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Assignment Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Faculty Assignment</CardTitle>
                <CardDescription>Assign faculty roles for specific years</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Faculty</Label>
                    <Select value={newAssignment.faculty_id} onValueChange={(value) => setNewAssignment({...newAssignment, faculty_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select faculty member" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculty.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name} ({f.faculty_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select value={newAssignment.year} onValueChange={(value) => setNewAssignment({...newAssignment, year: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newAssignment.role} onValueChange={(value: 'coordinator' | 'counsellor') => setNewAssignment({...newAssignment, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                        <SelectItem value="counsellor">Counsellor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newAssignment.role === 'counsellor' && (
                    <div className="space-y-2">
                      <Label htmlFor="max_students">Max Students</Label>
                      <Input
                        id="max_students"
                        type="number"
                        value={newAssignment.max_students}
                        onChange={(e) => setNewAssignment({...newAssignment, max_students: parseInt(e.target.value)})}
                        placeholder="20"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={handleCreateAssignment} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Assignment Tab */}
          <TabsContent value="student-assignment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Student Assignment</CardTitle>
                <CardDescription>Assign specific students to faculty members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assignment Setup */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Faculty</Label>
                    <Select value={newAssignment.faculty_id} onValueChange={(value) => setNewAssignment({...newAssignment, faculty_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculty.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name} ({f.faculty_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={newAssignment.year} onValueChange={(value) => setNewAssignment({...newAssignment, year: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={newAssignment.role} onValueChange={(value: 'coordinator' | 'counsellor') => setNewAssignment({...newAssignment, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                        <SelectItem value="counsellor">Counsellor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Student Selection Methods */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="text-sm font-medium">Selection Method:</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={studentSelectionMode === 'year' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStudentSelectionMode('year')}
                      >
                        By Year
                      </Button>
                      <Button
                        variant={studentSelectionMode === 'range' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStudentSelectionMode('range')}
                      >
                        By HT Range
                      </Button>
                      <Button
                        variant={studentSelectionMode === 'individual' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStudentSelectionMode('individual')}
                      >
                        Individual
                      </Button>
                    </div>
                  </div>

                  {/* Year Selection */}
                  {studentSelectionMode === 'year' && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <Label className="text-sm font-medium mb-2 block">Select Year:</Label>
                      <div className="flex space-x-2">
                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => (
                          <Button
                            key={year}
                            variant={selectedYear === year ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedYear(year)}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                      {selectedYear && (
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAllInYear(selectedYear)}
                          >
                            Select All {getStudentCountByYear(selectedYear)} Students in {selectedYear}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* HT Range Selection */}
                  {studentSelectionMode === 'range' && (
                    <div className="p-4 border rounded-lg bg-green-50">
                      <Label className="text-sm font-medium mb-2 block">Select HT Number Range:</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Start HT (e.g., 22891A7201)"
                          value={htRangeStart}
                          onChange={(e) => setHtRangeStart(e.target.value)}
                        />
                        <span>to</span>
                        <Input
                          placeholder="End HT (e.g., 22891A7220)"
                          value={htRangeEnd}
                          onChange={(e) => setHtRangeEnd(e.target.value)}
                        />
                        <Button onClick={handleSelectByRange} size="sm">
                          Select Range
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Individual Selection */}
                  {studentSelectionMode === 'individual' && (
                    <div className="p-4 border rounded-lg bg-purple-50">
                      <Label className="text-sm font-medium mb-2 block">Search and Select Students:</Label>
                      <div className="flex space-x-2 mb-4">
                        <Input
                          placeholder="Search by name or HT number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Years</SelectItem>
                            <SelectItem value="1st Year">1st Year</SelectItem>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="4th Year">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Students Summary */}
                {selectedStudents.length > 0 && (
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">
                        Selected Students: {selectedStudents.length}
                      </Label>
                      <Button variant="outline" size="sm" onClick={clearSelection}>
                        Clear Selection
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedStudents.slice(0, 5).join(', ')}
                      {selectedStudents.length > 5 && ` ... and ${selectedStudents.length - 5} more`}
                    </div>
                  </div>
                )}

                {/* Student List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Available Students</h3>
                    <div className="text-sm text-gray-600">
                      Showing {filteredStudents.length} of {students.length} students
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>HT Number</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Section</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.hallTicket}>
                            <TableCell>
                              <Checkbox
                                checked={selectedStudents.includes(student.hallTicket)}
                                onCheckedChange={(checked) => 
                                  handleStudentSelection(student.hallTicket, checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell className="font-mono">{student.hallTicket}</TableCell>
                            <TableCell className="font-medium">{student.fullName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{student.year}</Badge>
                            </TableCell>
                            <TableCell>{student.section || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Assignment Action */}
                  {selectedStudents.length > 0 && (
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleManualStudentAssignment}
                        disabled={assigning || !newAssignment.faculty_id || !newAssignment.year}
                        size="lg"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Assign {selectedStudents.length} Students to Faculty
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auto Assign Tab */}
          <TabsContent value="auto-assign" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automatic Student Assignment</CardTitle>
                <CardDescription>Automatically assign students to counsellors for each year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This will automatically distribute students among counsellors for each year. 
                    Make sure you have assigned counsellors before running this.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => (
                    <Card key={year} className="p-4">
                      <div className="text-center space-y-3">
                        <h3 className="font-medium">{year}</h3>
                        <p className="text-sm text-gray-600">
                          {getStudentCountByYear(year)} students
                        </p>
                        <Button
                          onClick={() => handleAutoAssign(year)}
                          disabled={assigning}
                          className="w-full"
                          variant="outline"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Auto Assign
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      ['1st Year', '2nd Year', '3rd Year', '4th Year'].forEach(year => handleAutoAssign(year));
                    }}
                    disabled={assigning}
                    size="lg"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Auto Assign All Years
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignments;
