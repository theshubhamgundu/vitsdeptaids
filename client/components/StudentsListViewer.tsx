import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Users, TrendingUp, BookOpen, RefreshCw } from "lucide-react";
import { 
  getAllStudentsFromList, 
  getStudentsByYear, 
  searchStudentsByName, 
  getStudentsListStats,
  StudentsListRecord 
} from "@/services/studentsListService";

const StudentsListViewer = () => {
  const [students, setStudents] = useState<StudentsListRecord[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentsListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    byYear: {
      "1st Year": 0,
      "2nd Year": 0,
      "3rd Year": 0,
      "4th Year": 0,
    },
    yearDistribution: {}
  });

  useEffect(() => {
    loadStudents();
    loadStats();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedYear]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudentsFromList();
      setStudents(data);
      console.log(`✅ Loaded ${data.length} students from students_list table`);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getStudentsListStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter(student => student.year === selectedYear);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.ht_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await loadStudents();
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchStudentsByName(searchTerm);
      setStudents(searchResults);
    } catch (error) {
      console.error("Error searching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearFilter = async (year: string) => {
    setSelectedYear(year);
    if (year === "all") {
      await loadStudents();
    } else {
      setLoading(true);
      try {
        const yearData = await getStudentsByYear(year);
        setStudents(yearData);
      } catch (error) {
        console.error("Error filtering by year:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const refreshData = async () => {
    await loadStudents();
    await loadStats();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Complete department list
            </p>
          </CardContent>
        </Card>

        {Object.entries(stats.byYear).map(([year, count]) => (
          <Card key={year}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{year}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">
                {((count / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Department Students List
            </span>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Complete list of students from the department database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search by name or hall ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={selectedYear}
                onValueChange={handleYearFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading students...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <Alert>
              <AlertDescription>
                No students found matching your criteria.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hall Ticket</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Branch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id || index}>
                      <TableCell className="font-mono">
                        {student.ht_no}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.student_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {student.year}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.branch || "AI & DS"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredStudents.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsListViewer;
