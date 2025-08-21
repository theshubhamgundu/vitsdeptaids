export interface StudentFacultyMapping {
  id: string;
  studentId: string;
  facultyId: string;
  mappingType: 'coordinator' | 'counsellor';
  assignedDate: string;
  isActive: boolean;
}

export interface MappingWithDetails extends StudentFacultyMapping {
  studentName: string;
  studentHallTicket: string;
  facultyName: string;
  facultyDesignation: string;
}

const MAPPING_STORAGE_KEY = 'studentFacultyMappings';

class MappingService {
  private getMappings(): StudentFacultyMapping[] {
    try {
      const mappings = localStorage.getItem(MAPPING_STORAGE_KEY);
      return mappings ? JSON.parse(mappings) : [];
    } catch (error) {
      console.error('Error loading mappings:', error);
      return [];
    }
  }

  private saveMappings(mappings: StudentFacultyMapping[]): void {
    try {
      localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(mappings));
    } catch (error) {
      console.error('Error saving mappings:', error);
    }
  }

  private generateId(): string {
    return 'mapping_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  assignStudentToFaculty(
    studentId: string,
    facultyId: string,
    mappingType: 'coordinator' | 'counsellor'
  ): StudentFacultyMapping {
    const mappings = this.getMappings();
    
    // Check if mapping already exists
    const existingMapping = mappings.find(
      m => m.studentId === studentId && m.mappingType === mappingType && m.isActive
    );

    if (existingMapping) {
      // Update existing mapping
      existingMapping.facultyId = facultyId;
      existingMapping.assignedDate = new Date().toISOString();
    } else {
      // Create new mapping
      const newMapping: StudentFacultyMapping = {
        id: this.generateId(),
        studentId,
        facultyId,
        mappingType,
        assignedDate: new Date().toISOString(),
        isActive: true
      };
      mappings.push(newMapping);
    }

    this.saveMappings(mappings);
    return existingMapping || mappings[mappings.length - 1];
  }

  removeMapping(mappingId: string): boolean {
    const mappings = this.getMappings();
    const index = mappings.findIndex(m => m.id === mappingId);
    
    if (index !== -1) {
      mappings[index].isActive = false;
      this.saveMappings(mappings);
      return true;
    }
    return false;
  }

  getStudentMappings(studentId: string): StudentFacultyMapping[] {
    const mappings = this.getMappings();
    return mappings.filter(m => m.studentId === studentId && m.isActive);
  }

  getFacultyStudents(facultyId: string, mappingType?: 'coordinator' | 'counsellor'): StudentFacultyMapping[] {
    const mappings = this.getMappings();
    return mappings.filter(m => 
      m.facultyId === facultyId && 
      m.isActive &&
      (!mappingType || m.mappingType === mappingType)
    );
  }

  getAllMappings(): StudentFacultyMapping[] {
    return this.getMappings().filter(m => m.isActive);
  }

  getMappingsWithDetails(): MappingWithDetails[] {
    const mappings = this.getAllMappings();
    const students = this.getStoredStudents();
    const faculty = this.getStoredFaculty();

    return mappings.map(mapping => {
      const student = students.find(s => s.id === mapping.studentId);
      const facultyMember = faculty.find(f => f.id === mapping.facultyId);

      return {
        ...mapping,
        studentName: student?.name || 'Unknown Student',
        studentHallTicket: student?.hallTicket || '',
        facultyName: facultyMember?.name || 'Unknown Faculty',
        facultyDesignation: facultyMember?.designation || ''
      };
    });
  }

  private getStoredStudents(): any[] {
    try {
      const students = localStorage.getItem('students');
      return students ? JSON.parse(students) : [];
    } catch {
      return [];
    }
  }

  private getStoredFaculty(): any[] {
    try {
      const faculty = localStorage.getItem('faculty');
      return faculty ? JSON.parse(faculty) : [];
    } catch {
      return [];
    }
  }

  bulkAssignStudents(assignments: { studentId: string; facultyId: string; mappingType: 'coordinator' | 'counsellor' }[]): void {
    assignments.forEach(assignment => {
      this.assignStudentToFaculty(assignment.studentId, assignment.facultyId, assignment.mappingType);
    });
  }

  getUnassignedStudents(mappingType: 'coordinator' | 'counsellor'): any[] {
    const mappings = this.getMappings();
    const assignedStudentIds = mappings
      .filter(m => m.mappingType === mappingType && m.isActive)
      .map(m => m.studentId);

    const allStudents = this.getStoredStudents();
    return allStudents.filter(student => !assignedStudentIds.includes(student.id));
  }
}

export const mappingService = new MappingService();
