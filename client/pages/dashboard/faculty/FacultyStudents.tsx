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
import { mappingService } from "@/services/mappingService";
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
  Phone
} from "lucide-react";

interface AssignedStudent {
  id: string;
  name: string;
  hallTicket: string;
  year: string;
  section: string;
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
  const [activeTab, setActiveTab] = useState("coordinator");

  useEffect(() => {
    loadAssignedStudents();
  }, [user]);

  useEffect(() => {
    filterStudents();
  }, [assignedStudents, searchTerm, activeTab]);

  const loadAssignedStudents = () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Get mappings for this faculty member
      const mappings = mappingService.getFacultyStudents(user.id);
      
      // Get student details from localStorage
      const storedStudents = localStorage.getItem('students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];

      // Combine mapping data with student details
      const assignedStudentsList = mappings.map(mapping => {
        const student = students.find(s => s.id === mapping.studentId);
        return {
          id: student?.id || mapping.studentId,
          name: student?.name || student?.fullName || 'Unknown Student',
          hallTicket: student?.hallTicket || '',
          year: student?.year || '',
          section: student?.section || '',
          email: student?.email || '',
          phone: student?.phone || '',
          cgpa: student?.cgpa || 0,
          attendance: student?.attendance || 0,
          branch: student?.branch || 'AI & DS',
          mappingType: mapping.mappingType,
          assignedDate: mapping.assignedDate
        };
      });

      setAssignedStudents(assignedStudentsList);
    } catch (error) {
      console.error('Error loading assigned students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = assignedStudents.filter(student => 
      student.mappingType === activeTab
    );
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStudents(filtered);
  };

  const handleStudentClick = (student: AssignedStudent) => {
    setSelectedStudent(student);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600 bg-green-50";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getCGPAColor = (cgpa: number) => {
    if (cgpa >= 8.5) return "text-green-600";
    if (cgpa >= 7.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getRoleIcon = (type: 'coordinator' | 'counsellor') => {
    return type === 'coordinator' ? 
      <UserCheck className="h-4 w-4" /> : 
      <Heart className="h-4 w-4" />;
  };

  const coordinatorStudents = assignedStudents.filter(s => s.mappingType === 'coordinator');
  const counsellorStudents = assignedStudents.filter(s => s.mappingType === 'counsellor');

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
            <h1 className="text-2xl font-bold text-gray-900">My Assigned Students</h1>
            <p className="text-gray-600">Manage students assigned to you as coordinator or counsellor</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <UserCheck className="h-4 w-4 mr-2" />
              {coordinatorStudents.length} Coordinator
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              {counsellorStudents.length} Counsellor
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Students</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, hall ticket, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Coordinator and Counsellor */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="coordinator" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Coordinator ({coordinatorStudents.length})</span>
            </TabsTrigger>
            <TabsTrigger value="counsellor" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Counsellor ({counsellorStudents.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coordinator" className="space-y-6">
            {coordinatorStudents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Assigned</h3>
                  <p className="text-gray-600">You haven't been assigned any students as a coordinator yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard 
                    key={student.id} 
                    student={student} 
                    onViewDetails={handleStudentClick}
                    getAttendanceColor={getAttendanceColor}
                    getCGPAColor={getCGPAColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="counsellor" className="space-y-6">
            {counsellorStudents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Assigned</h3>
                  <p className="text-gray-600">You haven't been assigned any students as a counsellor yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard 
                    key={student.id} 
                    student={student} 
                    onViewDetails={handleStudentClick}
                    getAttendanceColor={getAttendanceColor}
                    getCGPAColor={getCGPAColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* No students found message */}
        {filteredStudents.length === 0 && assignedStudents.length > 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Student Details Dialog */}
        {selectedStudent && (
          <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/50/50" />
                    <AvatarFallback>{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{selectedStudent.name}</span>
                      <Badge variant="outline">
                        {getRoleIcon(selectedStudent.mappingType)}
                        <span className="ml-1 capitalize">{selectedStudent.mappingType}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 font-normal">{selectedStudent.hallTicket}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Year:</strong> {selectedStudent.year}</div>
                      <div><strong>Section:</strong> {selectedStudent.section}</div>
                      <div><strong>Branch:</strong> {selectedStudent.branch}</div>
                      <div><strong>Email:</strong> {selectedStudent.email}</div>
                      {selectedStudent.phone && <div><strong>Phone:</strong> {selectedStudent.phone}</div>}
                      <div><strong>Assigned as:</strong> 
                        <Badge className="ml-2" variant="outline">
                          {getRoleIcon(selectedStudent.mappingType)}
                          <span className="ml-1 capitalize">{selectedStudent.mappingType}</span>
                        </Badge>
                      </div>
                      <div><strong>Assigned Date:</strong> {new Date(selectedStudent.assignedDate).toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Academic Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>CGPA:</strong> 
                        <span className={`ml-2 font-bold ${getCGPAColor(selectedStudent.cgpa || 0)}`}>
                          {selectedStudent.cgpa || 'N/A'}
                        </span>
                      </div>
                      <div><strong>Attendance:</strong> 
                        <span className={`ml-2 font-bold px-2 py-1 rounded ${getAttendanceColor(selectedStudent.attendance || 0)}`}>
                          {selectedStudent.attendance || 0}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  {selectedStudent.phone && (
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

// Student Card Component
interface StudentCardProps {
  student: AssignedStudent;
  onViewDetails: (student: AssignedStudent) => void;
  getAttendanceColor: (percentage: number) => string;
  getCGPAColor: (cgpa: number) => string;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onViewDetails, 
  getAttendanceColor, 
  getCGPAColor 
}) => {
  const getRoleIcon = (type: 'coordinator' | 'counsellor') => {
    return type === 'coordinator' ? 
      <UserCheck className="h-4 w-4" /> : 
      <Heart className="h-4 w-4" />;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/api/placeholder/50/50" />
            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.hallTicket}</p>
          </div>
          <Badge variant="outline">
            {getRoleIcon(student.mappingType)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Year:</span>
            <span className="ml-2 font-medium">{student.year}</span>
          </div>
          <div>
            <span className="text-gray-600">Section:</span>
            <span className="ml-2 font-medium">{student.section}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">CGPA:</span>
            <span className={`ml-2 font-semibold ${getCGPAColor(student.cgpa || 0)}`}>
              {student.cgpa || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Attendance:</span>
            <span className={`ml-2 font-semibold px-2 py-1 rounded ${getAttendanceColor(student.attendance || 0)}`}>
              {student.attendance || 0}%
            </span>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="text-gray-600">Email:</span>
          <span className="ml-2">{student.email}</span>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(student)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyStudents;
