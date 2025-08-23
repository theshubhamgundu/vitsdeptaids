import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getVisibleStudentsForFaculty } from "@/services/facultyAssignmentService";
import { Users, UserCheck, BookOpen, Calendar } from "lucide-react";

interface FacultyStudentViewProps {
  facultyId: string;
  facultyName: string;
}

interface VisibleStudent {
  ht_no: string;
  student_name: string;
  year: string;
  section: string;
  branch: string;
  role: string;
  assignment_type: string;
}

const FacultyStudentView = ({ facultyId, facultyName }: FacultyStudentViewProps) => {
  const [students, setStudents] = useState<VisibleStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    loadStudents();
  }, [facultyId]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getVisibleStudentsForFaculty(facultyId);
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = selectedYear === 'all' 
    ? students 
    : students.filter(s => s.year === selectedYear);

  const getYearStats = (year: string) => {
    const yearStudents = students.filter(s => s.year === year);
    return {
      total: yearStudents.length,
      assigned: yearStudents.filter(s => s.assignment_type === 'Assigned subset').length,
      all: yearStudents.filter(s => s.assignment_type === 'All students in year').length
    };
  };

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading students...</span>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            My Students
          </CardTitle>
          <CardDescription>No students assigned to you yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>You don't have any student assignments yet.</p>
            <p className="text-sm">Contact your administrator to get assigned students.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            My Students
          </CardTitle>
          <CardDescription>
            Students assigned to {facultyName} - {students.length} total students
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Year Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {years.map((year) => {
          const stats = getYearStats(year);
          if (stats.total === 0) return null;
          
          return (
            <Card key={year}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{year}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <div className="mt-2 space-y-1">
                  {stats.assigned > 0 && (
                    <div className="text-xs text-blue-600">
                      {stats.assigned} assigned to me
                    </div>
                  )}
                  {stats.all > 0 && (
                    <div className="text-xs text-green-600">
                      {stats.all} total in year (coordinator)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Details</CardTitle>
              <CardDescription>
                Showing {filteredStudents.length} of {students.length} students
              </CardDescription>
            </div>
            <div className="w-48">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hall Ticket</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Assignment Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student.ht_no || index}>
                  <TableCell className="font-mono">{student.ht_no}</TableCell>
                  <TableCell className="font-medium">{student.student_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.year}</Badge>
                  </TableCell>
                  <TableCell>{student.section || 'N/A'}</TableCell>
                  <TableCell>{student.branch || 'AI & DS'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={student.assignment_type === 'All students in year' ? 'default' : 'secondary'}
                    >
                      {student.assignment_type === 'All students in year' ? 'Coordinator' : 'Counsellor'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyStudentView;
