import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { resultsService } from "@/services/resultsService";
import { getAllStudents } from "@/services/studentDataService";
import {
  BarChart3,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  Save,
  Eye,
  Calculator,
  FileText,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const FacultyResults = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [newResult, setNewResult] = useState({
    studentId: "",
    subject: "",
    examType: "Mid-term",
    marks: "",
    maxMarks: "",
    examDate: ""
  });

  const subjects = [
    "Machine Learning",
    "Deep Learning", 
    "Data Science",
    "Programming",
    "Statistics",
    "Mathematics"
  ];

  const examTypes = [
    "Mid-term",
    "End-term", 
    "Internal Assessment",
    "Project",
    "Quiz"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load students
      const studentsData = await getAllStudents();
      setStudents(studentsData);
      
      // Load results for this faculty
      const allResults = resultsService.getAllResults();
      const facultyResults = allResults.filter(result => 
        result.uploadedBy === user?.id || result.uploadedBy === user?.facultyId
      );
      setResults(facultyResults);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = () => {
    if (!newResult.studentId || !newResult.subject || !newResult.marks || !newResult.maxMarks) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const student = students.find(s => s.id === newResult.studentId);
      if (!student) {
        toast({
          title: "Error",
          description: "Student not found",
          variant: "destructive",
        });
        return;
      }

      const result = resultsService.addResult({
        studentId: newResult.studentId,
        studentName: student.fullName || student.name,
        hallTicket: student.hallTicket,
        examType: newResult.examType as any,
        subject: newResult.subject,
        year: student.year,
        semester: student.semester?.toString() || "1st Semester",
        marks: parseInt(newResult.marks),
        maxMarks: parseInt(newResult.maxMarks),
        grade: "", // Will be calculated by service
        examDate: newResult.examDate,
        publishedDate: new Date().toISOString(),
        uploadedBy: user?.id || user?.facultyId || "faculty",
        uploadedByName: user?.name || "Faculty Member",
        published: false
      });

      setResults(prev => [...prev, result]);
      setShowAddDialog(false);
      setNewResult({
        studentId: "",
        subject: "",
        examType: "Mid-term",
        marks: "",
        maxMarks: "",
        examDate: ""
      });

      toast({
        title: "Success",
        description: "Result added successfully",
      });
    } catch (error) {
      console.error("Error adding result:", error);
      toast({
        title: "Error",
        description: "Failed to add result",
        variant: "destructive",
      });
    }
  };

  const handleBulkUpload = () => {
    // TODO: Implement bulk upload functionality
    toast({
      title: "Bulk Upload",
      description: "Bulk upload functionality coming soon",
    });
    setShowBulkUploadDialog(false);
  };

  const handleExportResults = () => {
    // TODO: Implement export functionality
    toast({
      title: "Export Started",
      description: "Results export in progress...",
    });
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = !searchTerm || 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.hallTicket.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "all" || result.subject === selectedSubject;
    const matchesYear = selectedYear === "all" || result.year === selectedYear;
    
    return matchesSearch && matchesSubject && matchesYear;
  });

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-green-100 text-green-800";
    if (grade === "B+" || grade === "B") return "bg-blue-100 text-blue-800";
    if (grade === "C+" || grade === "C") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Results Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage student results and academic performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
            <Button onClick={() => setShowBulkUploadDialog(true)} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button onClick={handleExportResults} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Results</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
              <p className="text-xs text-muted-foreground">All results</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => r.published).length}
              </div>
              <p className="text-xs text-muted-foreground">Results published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {results.filter(r => !r.published).length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting publication</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Total students</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Results</Label>
                <div className="text-sm text-gray-600">
                  Showing {filteredResults.length} of {results.length} results
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
            <CardDescription>
              Manage and view student academic results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  {results.length === 0 
                    ? "No results have been added yet. Start by adding individual results or bulk uploading."
                    : "No results match your current filters. Try adjusting your search criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">{result.studentName}</h3>
                            <p className="text-sm text-gray-600">{result.hallTicket}</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{result.subject}</p>
                            <p>{result.year} • {result.semester}</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{result.examType}</p>
                            <p>{new Date(result.examDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {result.marks}/{result.maxMarks}
                          </div>
                          <div className="text-sm text-gray-600">
                            {((result.marks / result.maxMarks) * 100).toFixed(1)}%
                          </div>
                        </div>
                        
                        <Badge className={getGradeColor(result.grade)}>
                          {result.grade}
                        </Badge>
                        
                        <Badge variant={result.published ? "default" : "secondary"}>
                          {result.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Result Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New Result</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <select
                    id="student"
                    value={newResult.studentId}
                    onChange={(e) => setNewResult(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.fullName || student.name} - {student.hallTicket}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <select
                      id="subject"
                      value={newResult.subject}
                      onChange={(e) => setNewResult(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="examType">Exam Type</Label>
                    <select
                      id="examType"
                      value={newResult.examType}
                      onChange={(e) => setNewResult(prev => ({ ...prev, examType: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      {examTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marks">Marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      placeholder="85"
                      value={newResult.marks}
                      onChange={(e) => setNewResult(prev => ({ ...prev, marks: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxMarks">Max Marks</Label>
                    <Input
                      id="maxMarks"
                      type="number"
                      placeholder="100"
                      value={newResult.maxMarks}
                      onChange={(e) => setNewResult(prev => ({ ...prev, maxMarks: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="examDate">Exam Date</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={newResult.examDate}
                    onChange={(e) => setNewResult(prev => ({ ...prev, examDate: e.target.value }))}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleAddResult} className="flex-1">
                    Add Result
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Dialog */}
        {showBulkUploadDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Bulk Upload Results</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop your Excel file here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports XLSX, XLS files
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleBulkUpload} className="flex-1">
                    Upload & Process
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBulkUploadDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyResults;
