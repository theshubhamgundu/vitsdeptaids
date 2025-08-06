import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  UserCheck,
  UserPlus,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  UserCog,
} from "lucide-react";
import {
  enhancedMappingService,
  type Student,
  type Faculty,
  type MappingWithDetails,
} from "@/services/enhancedMappingService";

const EnhancedStudentFacultyMapping: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [mappings, setMappings] = useState<MappingWithDetails[]>([]);
  const [filteredMappings, setFilteredMappings] = useState<
    MappingWithDetails[]
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [mappingType, setMappingType] = useState<"coordinator" | "counsellor">(
    "coordinator",
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "coordinator" | "counsellor"
  >("all");
  const [filterSource, setFilterSource] = useState<
    "all" | "registered" | "department_database"
  >("all");
  const [stats, setStats] = useState({
    totalStudents: 0,
    assignedCoordinators: 0,
    assignedCounsellors: 0,
    unassignedCoordinators: 0,
    unassignedCounsellors: 0,
    totalFaculty: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMappings();
  }, [mappings, searchTerm, filterType, filterSource]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsData, facultyData, mappingsData, statsData] =
        await Promise.all([
          enhancedMappingService.getAllStudentsData(),
          enhancedMappingService.getAllFacultyData(),
          enhancedMappingService.getMappingsWithDetails(),
          enhancedMappingService.getAssignmentStats(),
        ]);

      setStudents(studentsData);
      setFaculty(facultyData);
      setMappings(mappingsData);
      setStats(statsData);

      console.log(
        `✅ Loaded: ${studentsData.length} students, ${facultyData.length} faculty, ${mappingsData.length} mappings`,
      );
    } catch (error) {
      console.error("Error loading mapping data:", error);
      toast({
        title: "Error",
        description: "Failed to load mapping data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMappings = () => {
    let filtered = mappings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (mapping) =>
          mapping.studentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          mapping.studentHallTicket
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          mapping.facultyName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(
        (mapping) => mapping.mappingType === filterType,
      );
    }

    // Apply source filter
    if (filterSource !== "all") {
      filtered = filtered.filter(
        (mapping) => mapping.studentSource === filterSource,
      );
    }

    setFilteredMappings(filtered);
  };

  const handleAssignStudent = async () => {
    if (!selectedStudent || !selectedFaculty) {
      toast({
        title: "Missing Selection",
        description: "Please select both a student and faculty member",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await enhancedMappingService.assignStudentToFaculty(
        selectedStudent,
        selectedFaculty,
        mappingType,
      );

      toast({
        title: "Assignment Successful",
        description: `Student assigned as ${mappingType} successfully`,
      });

      // Reset selections and reload data
      setSelectedStudent("");
      setSelectedFaculty("");
      await loadData();
    } catch (error) {
      console.error("Error assigning student:", error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMapping = async (mappingId: string) => {
    setLoading(true);
    try {
      const success = await enhancedMappingService.removeMapping(mappingId);

      if (success) {
        toast({
          title: "Mapping Removed",
          description: "Student-faculty mapping removed successfully",
        });
        await loadData();
      } else {
        throw new Error("Failed to remove mapping");
      }
    } catch (error) {
      console.error("Error removing mapping:", error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove mapping. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUnassignedStudents = (type: "coordinator" | "counsellor") => {
    const assignedStudentIds = mappings
      .filter((m) => m.mappingType === type)
      .map((m) => m.studentId);
    return students.filter(
      (student) => !assignedStudentIds.includes(student.id),
    );
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? `${student.name} (${student.hallTicket})`
      : "Unknown Student";
  };

  const getFacultyName = (facultyId: string) => {
    const facultyMember = faculty.find((f) => f.id === facultyId);
    return facultyMember
      ? `${facultyMember.name} - ${facultyMember.designation}`
      : "Unknown Faculty";
  };

  if (loading && mappings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mapping data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              All sources combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coordinators</CardTitle>
            <UserCog className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.assignedCoordinators}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.unassignedCoordinators} unassigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Counsellors</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.assignedCounsellors}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.unassignedCounsellors} unassigned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts for unassigned students */}
      {(stats.unassignedCoordinators > 0 ||
        stats.unassignedCounsellors > 0) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Pending Assignments:</strong> {stats.unassignedCoordinators}{" "}
            students need coordinators, {stats.unassignedCounsellors} students
            need counsellors.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="assign" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assign">Assign Students</TabsTrigger>
          <TabsTrigger value="manage">Manage Mappings</TabsTrigger>
        </TabsList>

        {/* Assignment Tab */}
        <TabsContent value="assign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Student to Faculty</CardTitle>
              <CardDescription>
                Create new coordinator or counsellor assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Assignment Type</Label>
                  <Select
                    value={mappingType}
                    onValueChange={(value: "coordinator" | "counsellor") =>
                      setMappingType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                      <SelectItem value="counsellor">Counsellor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={setSelectedStudent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnassignedStudents(mappingType).map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.hallTicket}) -{" "}
                          {student.source === "registered"
                            ? "Registered"
                            : "Dept DB"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Faculty</Label>
                  <Select
                    value={selectedFaculty}
                    onValueChange={setSelectedFaculty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculty.map((facultyMember) => (
                        <SelectItem
                          key={facultyMember.id}
                          value={facultyMember.id}
                        >
                          {facultyMember.name} - {facultyMember.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAssignStudent}
                disabled={loading || !selectedStudent || !selectedFaculty}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign as {mappingType}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="manage" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search mappings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filterType}
                  onValueChange={(value: any) => setFilterType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="coordinator">Coordinators</SelectItem>
                    <SelectItem value="counsellor">Counsellors</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterSource}
                  onValueChange={(value: any) => setFilterSource(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="registered">Registered Only</SelectItem>
                    <SelectItem value="department_database">
                      Department DB
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={loadData} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mappings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
              <CardDescription>
                Showing {filteredMappings.length} of {mappings.length}{" "}
                assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMappings.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No assignments found
                  </h3>
                  <p className="text-gray-600">
                    No student-faculty assignments match your criteria.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMappings.map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {mapping.studentName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {mapping.studentHallTicket}
                            </div>
                            <div className="text-xs text-gray-500">
                              {mapping.studentYear}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {mapping.facultyName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {mapping.facultyDesignation}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              mapping.mappingType === "coordinator"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {mapping.mappingType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              mapping.studentSource === "registered"
                                ? "border-green-200 text-green-700"
                                : "border-blue-200 text-blue-700"
                            }
                          >
                            {mapping.studentSource === "registered"
                              ? "Registered"
                              : "Dept DB"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(
                              mapping.assignedDate,
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveMapping(mapping.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedStudentFacultyMapping;
