import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { resultsService, StudentResult, StudentPerformance } from "@/services/resultsService";
import {
  BarChart,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  GraduationCap,
  Target,
  Trophy,
  BookOpen
} from "lucide-react";

const StudentResults = () => {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<StudentPerformance | null>(null);
  const [filteredResults, setFilteredResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");

  useEffect(() => {
    loadResults();
  }, [user]);

  useEffect(() => {
    filterResults();
  }, [performance, searchTerm, selectedSubject, selectedExamType, selectedSemester]);

  const loadResults = () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const studentPerformance = resultsService.getStudentPerformance(user.id);
      setPerformance(studentPerformance);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    if (!performance) return;

    let filtered = performance.results;

    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.examType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter(result => result.subject === selectedSubject);
    }

    if (selectedExamType !== "all") {
      filtered = filtered.filter(result => result.examType === selectedExamType);
    }

    if (selectedSemester !== "all") {
      filtered = filtered.filter(result => result.semester === selectedSemester);
    }

    setFilteredResults(filtered);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCGPAIcon = (cgpa: number) => {
    if (cgpa >= 9.0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (cgpa >= 8.0) return <Award className="h-5 w-5 text-blue-500" />;
    if (cgpa >= 7.0) return <Target className="h-5 w-5 text-green-500" />;
    return <BookOpen className="h-5 w-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <DashboardLayout userType="student" userName={user?.name || "Student"}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!performance || performance.results.length === 0) {
    return (
      <DashboardLayout userType="student" userName={user?.name || "Student"}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
            <p className="text-gray-600">View your examination results and academic performance</p>
          </div>
          
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
              <p className="text-gray-600">Your examination results will appear here once they are published by faculty.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const subjects = Array.from(new Set(performance.results.map(r => r.subject)));
  const examTypes = Array.from(new Set(performance.results.map(r => r.examType)));
  const semesters = Array.from(new Set(performance.results.map(r => r.semester)));

  return (
    <DashboardLayout userType="student" userName={user?.name || "Student"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
            <p className="text-gray-600">Track your academic performance and examination results</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <GraduationCap className="h-4 w-4 mr-2" />
            CGPA: {performance.overallCGPA}
          </Badge>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall CGPA</p>
                  <p className="text-2xl font-bold">{performance.overallCGPA}</p>
                </div>
                {getCGPAIcon(performance.overallCGPA)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Semester</p>
                  <p className="text-lg font-bold">{performance.currentSemester}</p>
                </div>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Credits</p>
                  <p className="text-2xl font-bold">{performance.totalCredits}</p>
                </div>
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Exams</p>
                  <p className="text-2xl font-bold">{performance.results.length}</p>
                </div>
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Subject-wise Performance</span>
            </CardTitle>
            <CardDescription>
              Your performance breakdown by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performance.subjectWisePerformance.map((subject, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{subject.subject}</h4>
                        <Badge className={getGradeColor(subject.grade)}>
                          {subject.grade}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {subject.totalMarks}/{subject.maxMarks} marks
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                      <div className={`text-sm font-medium ${getPerformanceColor(subject.percentage)}`}>
                        {subject.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search subjects or exam types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject-filter">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exam-type-filter">Exam Type</Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All exam types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {examTypes.map(examType => (
                      <SelectItem key={examType} value={examType}>{examType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester-filter">Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="All semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
            <CardDescription>
              Complete list of your examination results ({filteredResults.length} results)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Exam Date</TableHead>
                    <TableHead>Semester</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => {
                    const percentage = (result.marks / result.maxMarks) * 100;
                    return (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div className="font-medium">{result.subject}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{result.examType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {result.marks}/{result.maxMarks}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${getPerformanceColor(percentage)}`}>
                            {percentage.toFixed(1)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(result.grade)}>
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(result.examDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{result.semester}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentResults;
