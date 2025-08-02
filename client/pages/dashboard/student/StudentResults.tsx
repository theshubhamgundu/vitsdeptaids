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
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  Download,
  Eye,
  Search,
  Calendar,
  BookOpen,
  Target,
  Star,
  ChevronRight,
  FileText,
  Calculator
} from "lucide-react";

const StudentResults = () => {
  const [studentData] = useState({
    name: "Rahul Sharma",
    hallTicket: "20AI001",
    year: "3rd Year",
    semester: "6th Semester",
    branch: "AI & DS",
    currentCGPA: 8.45,
    currentSGPA: 8.72
  });

  const [semesterResults, setSemesterResults] = useState([
    {
      semester: "6th Semester",
      sgpa: 8.72,
      cgpa: 8.45,
      credits: 22,
      status: "Current",
      subjects: [
        { code: "AI601", name: "Machine Learning", credits: 4, internal: 85, external: 78, total: 163, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "AI602", name: "Deep Learning", credits: 4, internal: 92, external: 85, total: 177, maxMarks: 200, grade: "A+", result: "Pass" },
        { code: "AI603", name: "Data Science", credits: 4, internal: 88, external: 82, total: 170, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "AI604", name: "Computer Vision", credits: 3, internal: 80, external: 75, total: 155, maxMarks: 200, grade: "B+", result: "Pass" },
        { code: "AI605", name: "Natural Language Processing", credits: 3, internal: 87, external: 80, total: 167, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "AI606", name: "AI Lab", credits: 2, internal: 95, external: 90, total: 185, maxMarks: 200, grade: "A+", result: "Pass" },
        { code: "AI607", name: "Project Work", credits: 2, internal: 88, external: 85, total: 173, maxMarks: 200, grade: "A", result: "Pass" }
      ]
    },
    {
      semester: "5th Semester",
      sgpa: 8.34,
      cgpa: 8.28,
      credits: 22,
      status: "Completed",
      subjects: [
        { code: "AI501", name: "Artificial Intelligence", credits: 4, internal: 82, external: 76, total: 158, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "AI502", name: "Database Management Systems", credits: 4, internal: 85, external: 78, total: 163, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "AI503", name: "Software Engineering", credits: 4, internal: 88, external: 80, total: 168, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "AI504", name: "Web Technologies", credits: 3, internal: 78, external: 72, total: 150, maxMarks: 200, grade: "B+", result: "Pass" },
        { code: "AI505", name: "Operating Systems", credits: 3, internal: 83, external: 77, total: 160, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "AI506", name: "Programming Lab", credits: 2, internal: 90, external: 88, total: 178, maxMarks: 200, grade: "A+", result: "Pass" },
        { code: "AI507", name: "Seminar", credits: 2, internal: 85, external: 82, total: 167, maxMarks: 200, grade: "A", result: "Pass" }
      ]
    },
    {
      semester: "4th Semester",
      sgpa: 8.56,
      cgpa: 8.15,
      credits: 21,
      status: "Completed",
      subjects: [
        { code: "CS401", name: "Data Structures", credits: 4, internal: 90, external: 84, total: 174, maxMarks: 200, grade: "A+", result: "Pass" },
        { code: "CS402", name: "Algorithms", credits: 4, internal: 87, external: 81, total: 168, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "CS403", name: "Computer Networks", credits: 4, internal: 85, external: 79, total: 164, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "CS404", name: "Theory of Computation", credits: 3, internal: 82, external: 75, total: 157, maxMarks: 200, grade: "A", result: "Pass" },
        { code: "CS405", name: "Microprocessors", credits: 3, internal: 80, external: 74, total: 154, maxMarks: 200, grade: "B+", result: "Pass" },
        { code: "CS406", name: "Programming Lab", credits: 2, internal: 92, external: 90, total: 182, maxMarks: 200, grade: "A+", result: "Pass" },
        { code: "HS407", name: "Technical Communication", credits: 1, internal: 88, external: 85, total: 173, maxMarks: 200, grade: "A", result: "Pass" }
      ]
    }
  ]);

  const [selectedSemester, setSelectedSemester] = useState("6th Semester");
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentSemesterData = semesterResults.find(sem => sem.semester === selectedSemester);

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-blue-100 text-blue-800';
      case 'B+':
        return 'bg-yellow-100 text-yellow-800';
      case 'B':
        return 'bg-orange-100 text-orange-800';
      case 'C':
        return 'bg-red-100 text-red-800';
      case 'F':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result) => {
    return result === "Pass" ? 'text-green-600' : 'text-red-600';
  };

  const cgpaHistory = semesterResults.map(sem => ({
    semester: sem.semester,
    cgpa: sem.cgpa,
    sgpa: sem.sgpa
  })).reverse();

  const totalCredits = semesterResults.reduce((sum, sem) => sum + sem.credits, 0);
  const totalSubjects = semesterResults.reduce((sum, sem) => sum + sem.subjects.length, 0);
  const passedSubjects = semesterResults.reduce((sum, sem) => 
    sum + sem.subjects.filter(sub => sub.result === "Pass").length, 0
  );

  return (
    <DashboardLayout userType="student" userName="Rahul Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
            <p className="text-gray-600">View your semester results and academic performance</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Transcript
            </Button>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{studentData.currentCGPA}</div>
              <p className="text-xs text-muted-foreground">Out of 10.0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current SGPA</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{studentData.currentSGPA}</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalCredits}</div>
              <p className="text-xs text-muted-foreground">Credits earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects Passed</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{passedSubjects}/{totalSubjects}</div>
              <p className="text-xs text-muted-foreground">Success rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Semester</TabsTrigger>
            <TabsTrigger value="history">Academic History</TabsTrigger>
            <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
          </TabsList>

          {/* Current Semester Tab */}
          <TabsContent value="current" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">6th Semester Results</h2>
                <p className="text-gray-600">Academic Year 2024-25</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">SGPA</div>
                  <div className="text-2xl font-bold text-blue-600">{currentSemesterData?.sgpa}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">CGPA</div>
                  <div className="text-2xl font-bold text-green-600">{currentSemesterData?.cgpa}</div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Results</CardTitle>
                <CardDescription>Detailed marks and grades for current semester</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Internal</TableHead>
                      <TableHead>External</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSemesterData?.subjects.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{subject.name}</div>
                            <div className="text-sm text-gray-600">{subject.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>{subject.credits}</TableCell>
                        <TableCell>{subject.internal}</TableCell>
                        <TableCell>{subject.external}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{subject.total}/{subject.maxMarks}</div>
                            <div className="text-sm text-gray-600">
                              {((subject.total / subject.maxMarks) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(subject.grade)}>
                            {subject.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getResultColor(subject.result)}>
                            {subject.result}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedSubject(subject);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Current semester performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4">
                  {['A+', 'A', 'B+', 'B', 'C', 'F'].map(grade => {
                    const count = currentSemesterData?.subjects.filter(sub => sub.grade === grade).length || 0;
                    return (
                      <div key={grade} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-gray-600">Grade {grade}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Semester-wise Performance</CardTitle>
                    <CardDescription>Your academic journey across all semesters</CardDescription>
                  </div>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterResults.map(sem => (
                        <SelectItem key={sem.semester} value={sem.semester}>
                          {sem.semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {semesterResults.map((semester, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{semester.semester}</h3>
                          <p className="text-sm text-gray-600">{semester.credits} Credits • {semester.subjects.length} Subjects</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">SGPA</div>
                          <div className="font-semibold">{semester.sgpa}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">CGPA</div>
                          <div className="font-semibold">{semester.cgpa}</div>
                        </div>
                        <Badge variant={semester.status === "Current" ? "default" : "secondary"}>
                          {semester.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedSemester(semester.semester)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Semester Details */}
            {selectedSemester && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSemester} - Detailed Results</CardTitle>
                  <CardDescription>Subject-wise performance breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterResults.find(sem => sem.semester === selectedSemester)?.subjects.map((subject, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{subject.name}</div>
                              <div className="text-sm text-gray-600">{subject.code}</div>
                            </div>
                          </TableCell>
                          <TableCell>{subject.credits}</TableCell>
                          <TableCell>{subject.total}/{subject.maxMarks}</TableCell>
                          <TableCell>{((subject.total / subject.maxMarks) * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge className={getGradeColor(subject.grade)}>
                              {subject.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={getResultColor(subject.result)}>
                              {subject.result}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Performance Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {/* CGPA Trend */}
            <Card>
              <CardHeader>
                <CardTitle>CGPA Trend Analysis</CardTitle>
                <CardDescription>Your academic performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cgpaHistory.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-32 font-medium">{item.semester}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm">SGPA: {item.sgpa}</span>
                          <span className="text-sm">CGPA: {item.cgpa}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.cgpa / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      {index > 0 && (
                        <div className="flex items-center">
                          {item.cgpa > cgpaHistory[index - 1].cgpa ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : item.cgpa < cgpaHistory[index - 1].cgpa ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strengths</CardTitle>
                  <CardDescription>Your best performing areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">Practical Subjects</div>
                        <div className="text-sm text-gray-600">Consistently high grades in lab courses</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">Core AI Subjects</div>
                        <div className="text-sm text-gray-600">Strong performance in ML and DL</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">Consistent Performance</div>
                        <div className="text-sm text-gray-600">Stable CGPA improvement</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Areas</CardTitle>
                  <CardDescription>Focus areas for better performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Theory Subjects</div>
                        <div className="text-sm text-gray-600">Can improve in theoretical concepts</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">External Exam Performance</div>
                        <div className="text-sm text-gray-600">Focus on exam preparation</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Time Management</div>
                        <div className="text-sm text-gray-600">Better exam time allocation</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Goals</CardTitle>
                <CardDescription>Targets for upcoming semesters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">8.5+</div>
                    <div className="text-sm text-gray-600">Target CGPA</div>
                    <div className="text-xs text-gray-500 mt-1">By graduation</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-600">Target Average</div>
                    <div className="text-xs text-gray-500 mt-1">Per subject</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">Top 10%</div>
                    <div className="text-sm text-gray-600">Class Rank</div>
                    <div className="text-xs text-gray-500 mt-1">Department wise</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Subject Detail Dialog */}
        {selectedSubject && (
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedSubject.name}</DialogTitle>
                <DialogDescription>Detailed marks breakdown</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Subject Code</Label>
                    <p className="text-sm text-gray-900">{selectedSubject.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Credits</Label>
                    <p className="text-sm text-gray-900">{selectedSubject.credits}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Internal Marks</Label>
                    <p className="text-lg font-semibold">{selectedSubject.internal}/100</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">External Marks</Label>
                    <p className="text-lg font-semibold">{selectedSubject.external}/100</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Marks</Label>
                    <p className="text-lg font-semibold">{selectedSubject.total}/{selectedSubject.maxMarks}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Percentage</Label>
                    <p className="text-lg font-semibold">{((selectedSubject.total / selectedSubject.maxMarks) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Grade</Label>
                    <Badge className={getGradeColor(selectedSubject.grade)}>
                      {selectedSubject.grade}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Result</Label>
                    <p className={`text-lg font-semibold ${getResultColor(selectedSubject.result)}`}>
                      {selectedSubject.result}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentResults;
