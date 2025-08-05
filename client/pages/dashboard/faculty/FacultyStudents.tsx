import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, 
  Search, 
  Eye, 
  BarChart3, 
  Calendar,
  Award,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Filter
} from "lucide-react";

const FacultyStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, yearFilter]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (yearFilter !== "all") {
      filtered = filtered.filter(student => student.year.toString() === yearFilter);
    }
    
    setFilteredStudents(filtered);
  };

  const fetchStudentAnalysis = async (studentId) => {
    try {
      const response = await fetch(`/api/students/${studentId}/analysis`);
      const data = await response.json();
      if (data.success) {
        setAnalysisData(data.data);
      }
    } catch (error) {
      console.error('Error fetching student analysis:', error);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    fetchStudentAnalysis(student.id);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-600 bg-green-50";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getCGPAColor = (cgpa) => {
    if (cgpa >= 8.5) return "text-green-600";
    if (cgpa >= 7.0) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600">View and analyze student information</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {filteredStudents.length} Students
          </Badge>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label>Quick Stats</Label>
                <div className="text-sm text-gray-600">
                  Total: {students.length} | Filtered: {filteredStudents.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/api/placeholder/50/50" />
                    <AvatarFallback>{student.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{student.fullName}</h3>
                    <p className="text-sm text-gray-600">{student.hallTicket}</p>
                  </div>
                  <Badge variant="outline">Year {student.year}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">CGPA:</span>
                    <span className={`ml-2 font-semibold ${getCGPAColor(student.cgpa)}`}>
                      {student.cgpa}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Attendance:</span>
                    <span className={`ml-2 font-semibold px-2 py-1 rounded ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2">{student.email}</span>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleStudentClick(student)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/api/placeholder/50/50" />
                            <AvatarFallback>{selectedStudent?.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{selectedStudent?.fullName}</div>
                            <div className="text-sm text-gray-600 font-normal">{selectedStudent?.hallTicket}</div>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      
                      {selectedStudent && (
                        <div className="space-y-6">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>Year:</strong> {selectedStudent.year}</div>
                                <div><strong>Branch:</strong> {selectedStudent.branch}</div>
                                <div><strong>Email:</strong> {selectedStudent.email}</div>
                                <div><strong>Phone:</strong> {selectedStudent.phone}</div>
                                <div><strong>Status:</strong> 
                                  <Badge className="ml-2" variant="outline">{selectedStudent.status}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Academic Performance</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>CGPA:</strong> 
                                  <span className={`ml-2 font-bold ${getCGPAColor(selectedStudent.cgpa)}`}>
                                    {selectedStudent.cgpa}
                                  </span>
                                </div>
                                <div><strong>Attendance:</strong> 
                                  <span className={`ml-2 font-bold px-2 py-1 rounded ${getAttendanceColor(selectedStudent.attendance)}`}>
                                    {selectedStudent.attendance}%
                                  </span>
                                </div>
                                <div><strong>Semester:</strong> {selectedStudent.semester}</div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Analysis Data */}
                          {analysisData && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Detailed Analysis</h3>
                              
                              {/* Academic Performance Chart */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Academic Performance</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Subject-wise Performance</h4>
                                      <div className="space-y-2">
                                        {analysisData.academicPerformance.subjectWise.map((subject, index) => (
                                          <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm">{subject.subject}</span>
                                            <div className="flex items-center space-x-2">
                                              <span className="text-sm font-medium">{subject.marks}/100</span>
                                              <Badge variant="outline">{subject.grade}</Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium mb-2">Semester Progress</h4>
                                      <div className="space-y-2">
                                        {analysisData.academicPerformance.semesterWise.slice(-3).map((sem, index) => (
                                          <div key={index} className="flex justify-between">
                                            <span className="text-sm">Semester {sem.semester}</span>
                                            <span className="font-medium">{sem.cgpa}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Attendance Analysis */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Attendance Analysis</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span>Overall Attendance</span>
                                      <span className={`font-bold px-3 py-1 rounded ${getAttendanceColor(analysisData.attendance.overall)}`}>
                                        {analysisData.attendance.overall}%
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Subject-wise Attendance</h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        {analysisData.attendance.subjectWise.map((subject, index) => (
                                          <div key={index} className="flex justify-between text-sm">
                                            <span>{subject.subject}</span>
                                            <span className={`font-medium ${getCGPAColor(subject.percentage / 10)}`}>
                                              {subject.percentage}%
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Certificates & Achievements */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                      <Award className="h-5 w-5" />
                                      <span>Certificates</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span>Approved:</span>
                                        <Badge className="bg-green-100 text-green-800">{analysisData.certificates.approved}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Pending:</span>
                                        <Badge className="bg-yellow-100 text-yellow-800">{analysisData.certificates.pending}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Rejected:</span>
                                        <Badge className="bg-red-100 text-red-800">{analysisData.certificates.rejected}</Badge>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                      <FileText className="h-5 w-5" />
                                      <span>Leave History</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span>Total Leaves:</span>
                                        <span className="font-medium">{analysisData.total_leaves}</span>
                                      </div>
                                      {analysisData.leaveHistory.slice(0, 2).map((leave, index) => (
                                        <div key={index} className="text-sm border-l-2 border-blue-300 pl-2">
                                          <div>{leave.type} leave - {leave.days} days</div>
                                          <div className="text-gray-600">{leave.date}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Risk Factors & Recommendations */}
                              {analysisData.riskFactors.length > 0 && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-red-600">
                                      <AlertTriangle className="h-5 w-5" />
                                      <span>Risk Factors</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      {analysisData.riskFactors.map((risk, index) => (
                                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                                          <div className="font-medium text-red-800">{risk.message}</div>
                                          <div className="text-sm text-red-600">{risk.action}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center space-x-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Recommendations</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-1">
                                    {analysisData.recommendations.map((rec, index) => (
                                      <li key={index} className="text-sm text-gray-700 flex items-start">
                                        <span className="text-green-600 mr-2">•</span>
                                        {rec}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyStudents;
