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
import { resultsService, StudentResult } from "@/services/resultsService";
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
  const [results, setResults] = useState<StudentResult[]>([]);
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
  }, [results, searchTerm, selectedSubject, selectedExamType, selectedSemester]);

  const loadResults = async () => {
    if (!user?.hallTicket) return;

    setLoading(true);
    try {
      // Load results for this specific student by hall ticket
      const studentResults = await resultsService.getStudentResultsByHallTicket(user.hallTicket);
      setResults(studentResults);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    let filtered = results;

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

  const getUniqueSubjects = () => {
    return [...new Set(results.map(result => result.subject))];
  };

  const getUniqueExamTypes = () => {
    return [...new Set(results.map(result => result.examType))];
  };

  const getUniqueSemesters = () => {
    return [...new Set(results.map(result => result.semester))];
  };

  const calculateOverallPerformance = () => {
    if (results.length === 0) return { percentage: 0, grade: "N/A" };

    const totalMarks = results.reduce((sum, result) => sum + result.marks, 0);
    const maxMarks = results.reduce((sum, result) => sum + result.maxMarks, 0);
    const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    return { percentage, grade };
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-800";
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="student" userName={user?.name || "Student"}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const overallPerformance = calculateOverallPerformance();

  return (
    <DashboardLayout userType="student" userName={user?.name || "Student"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
            <p className="text-gray-600">View your academic performance and grades</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {overallPerformance.percentage}%
                </div>
                <p className="text-sm text-gray-600">Overall Percentage</p>
              </div>
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getGradeColor(overallPerformance.grade)}`}>
                  {overallPerformance.grade}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">Overall Grade</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {results.length}
                </div>
                <p className="text-sm text-gray-600">Total Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search
                </label>
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Subject
                </label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getUniqueSubjects().map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Exam Type
                </label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {getUniqueExamTypes().map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Semester
                </label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {getUniqueSemesters().map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
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
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Subject-wise Results
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your academic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredResults.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No results found</p>
                <p className="text-sm text-gray-500">
                  {results.length === 0 
                    ? "No results have been uploaded yet." 
                    : "Try adjusting your filters."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index) => {
                    const percentage = result.maxMarks > 0 
                      ? Math.round((result.marks / result.maxMarks) * 100) 
                      : 0;
                    const grade = percentage >= 90 ? "A+" :
                                 percentage >= 80 ? "A" :
                                 percentage >= 70 ? "B+" :
                                 percentage >= 60 ? "B" :
                                 percentage >= 50 ? "C" :
                                 percentage >= 40 ? "D" : "F";

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.subject}</TableCell>
                        <TableCell>{result.examType}</TableCell>
                        <TableCell>{result.semester}</TableCell>
                        <TableCell>{result.marks}</TableCell>
                        <TableCell>{result.maxMarks}</TableCell>
                        <TableCell>{percentage}%</TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(grade)}>
                            {grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(result.examDate).toLocaleDateString()}
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
