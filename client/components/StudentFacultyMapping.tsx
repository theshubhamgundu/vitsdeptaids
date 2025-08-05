import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, UserCheck, UserPlus, Trash2, RefreshCw } from 'lucide-react';
import { mappingService, MappingWithDetails } from '@/services/mappingService';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  hallTicket: string;
  year: string;
  section: string;
}

interface Faculty {
  id: string;
  name: string;
  designation: string;
  facultyId: string;
}

const StudentFacultyMapping: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [mappings, setMappings] = useState<MappingWithDetails[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [mappingType, setMappingType] = useState<'coordinator' | 'counsellor'>('coordinator');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Load students from localStorage
      const storedStudents = localStorage.getItem('students');
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }

      // Load faculty from localStorage
      const storedFaculty = localStorage.getItem('faculty');
      if (storedFaculty) {
        setFaculty(JSON.parse(storedFaculty));
      }

      // Load mappings
      setMappings(mappingService.getMappingsWithDetails());
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load student and faculty data",
        variant: "destructive",
      });
    }
  };

  const handleAssignment = async () => {
    if (!selectedStudent || !selectedFaculty) {
      toast({
        title: "Selection Required",
        description: "Please select both a student and faculty member",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      mappingService.assignStudentToFaculty(selectedStudent, selectedFaculty, mappingType);
      
      toast({
        title: "Assignment Successful",
        description: `Student assigned to ${mappingType} successfully`,
      });

      // Refresh mappings and reset form
      setMappings(mappingService.getMappingsWithDetails());
      setSelectedStudent('');
      setSelectedFaculty('');
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign student to faculty",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMapping = (mappingId: string) => {
    try {
      if (mappingService.removeMapping(mappingId)) {
        toast({
          title: "Mapping Removed",
          description: "Student-faculty mapping removed successfully",
        });
        setMappings(mappingService.getMappingsWithDetails());
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove mapping",
        variant: "destructive",
      });
    }
  };

  const getUnassignedStudents = (type: 'coordinator' | 'counsellor') => {
    return mappingService.getUnassignedStudents(type);
  };

  const coordinatorMappings = mappings.filter(m => m.mappingType === 'coordinator');
  const counsellorMappings = mappings.filter(m => m.mappingType === 'counsellor');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Student to Faculty
          </CardTitle>
          <CardDescription>
            Assign students to faculty members as coordinators or counsellors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Assignment Type</label>
              <Select value={mappingType} onValueChange={(value: 'coordinator' | 'counsellor') => setMappingType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coordinator">Coordinator</SelectItem>
                  <SelectItem value="counsellor">Counsellor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Select Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.hallTicket})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Select Faculty</label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((facultyMember) => (
                    <SelectItem key={facultyMember.id} value={facultyMember.id}>
                      {facultyMember.name} ({facultyMember.designation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAssignment} 
                disabled={loading || !selectedStudent || !selectedFaculty}
                className="w-full"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                Assign
              </Button>
            </div>
          </div>

          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              <strong>Unassigned Students ({mappingType}):</strong> {getUnassignedStudents(mappingType).length} students need assignment
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>
            View and manage existing student-faculty assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="coordinator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coordinator">Coordinators ({coordinatorMappings.length})</TabsTrigger>
              <TabsTrigger value="counsellor">Counsellors ({counsellorMappings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="coordinator" className="space-y-4">
              {coordinatorMappings.length === 0 ? (
                <Alert>
                  <AlertDescription>No coordinator assignments found</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {coordinatorMappings.map((mapping) => (
                    <Card key={mapping.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{mapping.studentName}</span>
                              <Badge variant="outline">{mapping.studentHallTicket}</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Coordinator: {mapping.facultyName} ({mapping.facultyDesignation})
                            </div>
                            <div className="text-xs text-gray-500">
                              Assigned: {new Date(mapping.assignedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMapping(mapping.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="counsellor" className="space-y-4">
              {counsellorMappings.length === 0 ? (
                <Alert>
                  <AlertDescription>No counsellor assignments found</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {counsellorMappings.map((mapping) => (
                    <Card key={mapping.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{mapping.studentName}</span>
                              <Badge variant="outline">{mapping.studentHallTicket}</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Counsellor: {mapping.facultyName} ({mapping.facultyDesignation})
                            </div>
                            <div className="text-xs text-gray-500">
                              Assigned: {new Date(mapping.assignedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMapping(mapping.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFacultyMapping;
