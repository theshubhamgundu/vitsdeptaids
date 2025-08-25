import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  getVisibleStudentsForFaculty,
  getFacultyAssignmentsByFacultyId,
  FacultyAssignment 
} from "@/services/facultyAssignmentService";
import { 
  Users, 
  Search, 
  Eye, 
  BarChart3, 
  Calendar,
  Award,
  UserCheck,
  Heart,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";

interface AssignedStudent {
  id: string;
  name: string;
  hallTicket: string;
  year: string;

  email: string;
  phone?: string;
  cgpa?: number;
  attendance?: number;
  branch?: string;
  mappingType: 'coordinator' | 'counsellor';
  assignedDate: string;
}

const FacultyStudents = () => {
  const { user } = useAuth();
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<AssignedStudent | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [facultyAssignments, setFacultyAssignments] = useState<FacultyAssignment[]>([]);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isCounsellor, setIsCounsellor] = useState(false);

  useEffect(() => {
    if (user) {
      loadAssignedStudents();
    }
  }, [user]);

  useEffect(() => {
    filterStudents();
  }, [assignedStudents, searchTerm, activeTab]);

  const loadAssignedStudents = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Get faculty assignments for current user
      const assignments = await getFacultyAssignmentsByFacultyId(user.id);
      setFacultyAssignments(assignments);
      
      // Determine user's role
      const coordinatorRole = assignments.find(a => a.role === 'coordinator');
      const counsellorRole = assignments.find(a => a.role === 'counsellor');
      
      setIsCoordinator(!!coordinatorRole);
      setIsCounsellor(!!counsellorRole);

      // Get visible students from the new service; try user.id then fallback to user.facultyId
      let visibleStudents = await getVisibleStudentsForFaculty(user.id);
      if ((!visibleStudents || visibleStudents.length === 0) && (user as any)?.facultyId) {
        visibleStudents = await getVisibleStudentsForFaculty((user as any).facultyId);
      }
      
      // Transform the data to match our interface
      const assignedStudentsList = visibleStudents.map((student: any) => ({
        id: student.id || student.student_id || student.ht_no || '',
        name: student.name || student.student_name || student.full_name || 'Unknown Student',
        hallTicket: student.hall_ticket || student.ht_no || student.student_id || '',
        year: student.year || '',
        email: student.email || '',
        phone: student.phone || '',
        cgpa: student.cgpa || student.gpa || 0,
        attendance: student.attendance || 0,
        branch: student.branch || 'AI & DS',
        mappingType: (coordinatorRole ? 'coordinator' : 'counsellor') as 'coordinator' | 'counsellor',
        assignedDate: student.assigned_at || new Date().toISOString(),
      }));

      setAssignedStudents(assignedStudentsList);
    } catch (error) {
      console.error("Error loading assigned students:", error);
      setAssignedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = assignedStudents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === "coordinator" && isCoordinator) {
      filtered = filtered.filter(student => student.mappingType === 'coordinator');
    } else if (activeTab === "counsellor" && isCounsellor) {
      filtered = filtered.filter(student => student.mappingType === 'counsellor');
    }
    // "all" tab shows all students

    setFilteredStudents(filtered);
  };

  const getTabContent = () => {
    if (activeTab === "coordinator" && isCoordinator) {
      return {
        title: "Coordinator Students",
        description: "Students you coordinate for your assigned year",
        icon: UserCheck,
        color: "text-indigo-600"
      };
    } else if (activeTab === "counsellor" && isCounsellor) {
      return {
        title: "Counsellor Students",
        description: "Students you counsel individually",
        icon: GraduationCap,
        color: "text-teal-600"
      };
    } else {
      return {
        title: "All Assigned Students",
        description: "All students assigned to you in any capacity",
        icon: Users,
        color: "text-blue-600"
      };
    }
  };

  const tabContent = getTabContent();

  if (loading) {
    return (
      <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading assigned students...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
            <p className="text-gray-600">Manage and view your assigned students</p>
          </div>
        </div>

        {/* Role Badges */}
        <div className="flex gap-2">
          {isCoordinator && (
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              <UserCheck className="h-3 w-3 mr-1" />
              Coordinator
            </Badge>
          )}
          {isCounsellor && (
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
              <GraduationCap className="h-3 w-3 mr-1" />
              Counsellor
            </Badge>
          )}
        </div>

        {/* Students grid only; summary cards removed as requested */}

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name, hall ticket, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                >
                  All Students
                </Button>
                {isCoordinator && (
                  <Button
                    variant={activeTab === "coordinator" ? "default" : "outline"}
                    onClick={() => setActiveTab("coordinator")}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Coordinator
                  </Button>
                )}
                {isCounsellor && (
                  <Button
                    variant={activeTab === "counsellor" ? "default" : "outline"}
                    onClick={() => setActiveTab("counsellor")}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Counsellor
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <tabContent.icon className={`h-5 w-5 ${tabContent.color}`} />
              <span>{tabContent.title}</span>
            </CardTitle>
            <CardDescription>{tabContent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? "Try adjusting your search criteria." 
                    : "No students have been assigned to you yet. Contact the admin for assignments."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>HT: {student.hallTicket}</span>
                            <span>Year: {student.year}</span>
            
                            <span>Branch: {student.branch}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {student.email}
                            </span>
                            {student.phone && (
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {student.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={student.mappingType === 'coordinator' ? 'default' : 'secondary'}
                              className={student.mappingType === 'coordinator' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}
                            >
                              {student.mappingType === 'coordinator' ? (
                                <>
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Coordinator
                                </>
                              ) : (
                                <>
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                  Counsellor
                                </>
                              )}
                            </Badge>
                          </div>
                          
                          {student.cgpa > 0 && (
                            <div className="text-sm text-gray-600 mt-1">
                              CGPA: {student.cgpa.toFixed(2)}
                            </div>
                          )}
                          
                          {student.attendance > 0 && (
                            <div className="text-sm text-gray-600">
                              Attendance: {student.attendance}%
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`mailto:${student.email}`, '_blank')}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Detail Dialog */}
        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedStudent?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedStudent && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedStudent.name}</div>
                      <div><span className="font-medium">Hall Ticket:</span> {selectedStudent.hallTicket}</div>
                      <div><span className="font-medium">Email:</span> {selectedStudent.email}</div>
                      {selectedStudent.phone && (
                        <div><span className="font-medium">Phone:</span> {selectedStudent.phone}</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Academic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Year:</span> {selectedStudent.year}</div>
        
                      <div><span className="font-medium">Branch:</span> {selectedStudent.branch}</div>
                      <div><span className="font-medium">Role:</span> 
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${selectedStudent.mappingType === 'coordinator' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}`}
                        >
                          {selectedStudent.mappingType === 'coordinator' ? 'Coordinator' : 'Counsellor'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {(selectedStudent.cgpa > 0 || selectedStudent.attendance > 0) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedStudent.cgpa > 0 && (
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{selectedStudent.cgpa.toFixed(2)}</div>
                          <div className="text-sm text-blue-600">CGPA</div>
                        </div>
                      )}
                      
                      {selectedStudent.attendance > 0 && (
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{selectedStudent.attendance}%</div>
                          <div className="text-sm text-green-600">Attendance</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:${selectedStudent.email}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button onClick={() => setSelectedStudent(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FacultyStudents;
