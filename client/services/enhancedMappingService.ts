import { supabase, tables } from "@/lib/supabase";
import { getAllStudents } from "@/services/studentDataService";
import { getAllStudentsFromList } from "@/services/studentsListService";
import { getAllFaculty } from "@/services/authService";

export interface StudentFacultyMapping {
  id: string;
  studentId: string;
  facultyId: string;
  mappingType: "coordinator" | "counsellor";
  assignedDate: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MappingWithDetails extends StudentFacultyMapping {
  studentName: string;
  studentHallTicket: string;
  studentYear: string;
  facultyName: string;
  facultyDesignation: string;
  studentSource: "registered" | "department_database";
}

export interface Student {
  id: string;
  name: string;
  hallTicket: string;
  year: string;
  section?: string;
  email?: string;
  source?: "registered" | "department_database";
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  facultyId: string;
  role: string;
  email: string;
}

const MAPPING_STORAGE_KEY = "studentFacultyMappings";

class EnhancedMappingService {
  // Get all students from all sources
  async getAllStudentsData(): Promise<Student[]> {
    try {
      // Get registered students
      const registeredStudents = await getAllStudents();

      // Get department database students
      const departmentStudents = await getAllStudentsFromList();

      // Convert registered students to standard format
      const formattedRegisteredStudents: Student[] = registeredStudents.map(
        (student) => ({
          id: student.id,
          name: student.fullName || student.name || "Unknown",
          hallTicket: student.hallTicket,
          year: student.year,
          section: student.section,
          email: student.email,
          source: "registered" as const,
        }),
      );

      // Convert department students to standard format
      const formattedDepartmentStudents: Student[] = departmentStudents.map(
        (student) => ({
          id: student.id || student.ht_no,
          name: student.student_name,
          hallTicket: student.ht_no,
          year: student.year,
          section: "A", // Default section
          email: `${student.ht_no}@vignan.ac.in`,
          source: "department_database" as const,
        }),
      );

      // Merge students, avoiding duplicates based on hall ticket
      const existingHallTickets = formattedRegisteredStudents.map(
        (s) => s.hallTicket,
      );
      const newDepartmentStudents = formattedDepartmentStudents.filter(
        (s) => !existingHallTickets.includes(s.hallTicket),
      );

      return [...formattedRegisteredStudents, ...newDepartmentStudents];
    } catch (error) {
      console.error("Error getting all students data:", error);
      return [];
    }
  }

  // Get all faculty data
  async getAllFacultyData(): Promise<Faculty[]> {
    try {
      const facultyData = await getAllFaculty();
      return facultyData.map((faculty) => ({
        id: faculty.id,
        name: faculty.name,
        designation: faculty.designation,
        facultyId: faculty.facultyId,
        role: faculty.role,
        email: faculty.email,
      }));
    } catch (error) {
      console.error("Error getting faculty data:", error);
      return [];
    }
  }

  // Get mappings from database or localStorage
  private async getMappings(): Promise<StudentFacultyMapping[]> {
    try {
      // Try database first
      if (supabase) {
        const { data, error } = await supabase
          .from("student_faculty_mappings")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((mapping) => ({
            id: mapping.id,
            studentId: mapping.student_id,
            facultyId: mapping.faculty_id,
            mappingType: mapping.mapping_type,
            assignedDate: mapping.assigned_date,
            isActive: mapping.is_active,
            createdAt: mapping.created_at,
            updatedAt: mapping.updated_at,
          }));
        }
      }

      // Fallback to localStorage
      const mappings = localStorage.getItem(MAPPING_STORAGE_KEY);
      return mappings ? JSON.parse(mappings) : [];
    } catch (error) {
      console.error("Error loading mappings:", error);
      return [];
    }
  }

  // Save mappings to database or localStorage
  private async saveMappings(mappings: StudentFacultyMapping[]): Promise<void> {
    try {
      // Save to localStorage for immediate access
      localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(mappings));

      // Try to save to database if available
      if (supabase) {
        // Note: This is a simplified approach. In production, you'd want to
        // handle individual updates rather than replacing all mappings
        console.log(
          "Mappings saved to localStorage. Database sync would happen here.",
        );
      }
    } catch (error) {
      console.error("Error saving mappings:", error);
    }
  }

  // Generate unique ID
  private generateId(): string {
    return (
      "mapping_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  // Assign student to faculty
  async assignStudentToFaculty(
    studentId: string,
    facultyId: string,
    mappingType: "coordinator" | "counsellor",
  ): Promise<StudentFacultyMapping> {
    try {
      const mappings = await this.getMappings();

      // Check if mapping already exists
      const existingMapping = mappings.find(
        (m) =>
          m.studentId === studentId &&
          m.mappingType === mappingType &&
          m.isActive,
      );

      const now = new Date().toISOString();

      if (existingMapping) {
        // Update existing mapping
        existingMapping.facultyId = facultyId;
        existingMapping.assignedDate = now;
        existingMapping.updatedAt = now;
        await this.saveMappings(mappings);
        return existingMapping;
      } else {
        // Create new mapping
        const newMapping: StudentFacultyMapping = {
          id: this.generateId(),
          studentId,
          facultyId,
          mappingType,
          assignedDate: now,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        };

        mappings.push(newMapping);
        await this.saveMappings(mappings);
        return newMapping;
      }
    } catch (error) {
      console.error("Error assigning student to faculty:", error);
      throw error;
    }
  }

  // Remove mapping
  async removeMapping(mappingId: string): Promise<boolean> {
    try {
      const mappings = await this.getMappings();
      const index = mappings.findIndex((m) => m.id === mappingId);

      if (index !== -1) {
        mappings[index].isActive = false;
        mappings[index].updatedAt = new Date().toISOString();
        await this.saveMappings(mappings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing mapping:", error);
      return false;
    }
  }

  // Get student mappings
  async getStudentMappings(
    studentId: string,
  ): Promise<StudentFacultyMapping[]> {
    try {
      const mappings = await this.getMappings();
      return mappings.filter((m) => m.studentId === studentId && m.isActive);
    } catch (error) {
      console.error("Error getting student mappings:", error);
      return [];
    }
  }

  // Get faculty students
  async getFacultyStudents(
    facultyId: string,
    mappingType?: "coordinator" | "counsellor",
  ): Promise<StudentFacultyMapping[]> {
    try {
      const mappings = await this.getMappings();
      return mappings.filter(
        (m) =>
          m.facultyId === facultyId &&
          m.isActive &&
          (!mappingType || m.mappingType === mappingType),
      );
    } catch (error) {
      console.error("Error getting faculty students:", error);
      return [];
    }
  }

  // Get all mappings
  async getAllMappings(): Promise<StudentFacultyMapping[]> {
    try {
      const mappings = await this.getMappings();
      return mappings.filter((m) => m.isActive);
    } catch (error) {
      console.error("Error getting all mappings:", error);
      return [];
    }
  }

  // Get mappings with detailed information
  async getMappingsWithDetails(): Promise<MappingWithDetails[]> {
    try {
      const [mappings, students, faculty] = await Promise.all([
        this.getAllMappings(),
        this.getAllStudentsData(),
        this.getAllFacultyData(),
      ]);

      return mappings.map((mapping) => {
        const student = students.find((s) => s.id === mapping.studentId);
        const facultyMember = faculty.find((f) => f.id === mapping.facultyId);

        return {
          ...mapping,
          studentName: student?.name || "Unknown Student",
          studentHallTicket: student?.hallTicket || "",
          studentYear: student?.year || "",
          facultyName: facultyMember?.name || "Unknown Faculty",
          facultyDesignation: facultyMember?.designation || "",
          studentSource: student?.source || "registered",
        };
      });
    } catch (error) {
      console.error("Error getting mappings with details:", error);
      return [];
    }
  }

  // Bulk assign students
  async bulkAssignStudents(
    assignments: {
      studentId: string;
      facultyId: string;
      mappingType: "coordinator" | "counsellor";
    }[],
  ): Promise<void> {
    try {
      for (const assignment of assignments) {
        await this.assignStudentToFaculty(
          assignment.studentId,
          assignment.facultyId,
          assignment.mappingType,
        );
      }
    } catch (error) {
      console.error("Error in bulk assign:", error);
      throw error;
    }
  }

  // Get unassigned students
  async getUnassignedStudents(
    mappingType: "coordinator" | "counsellor",
  ): Promise<Student[]> {
    try {
      const [mappings, allStudents] = await Promise.all([
        this.getMappings(),
        this.getAllStudentsData(),
      ]);

      const assignedStudentIds = mappings
        .filter((m) => m.mappingType === mappingType && m.isActive)
        .map((m) => m.studentId);

      return allStudents.filter(
        (student) => !assignedStudentIds.includes(student.id),
      );
    } catch (error) {
      console.error("Error getting unassigned students:", error);
      return [];
    }
  }

  // Get assignment statistics
  async getAssignmentStats(): Promise<{
    totalStudents: number;
    assignedCoordinators: number;
    assignedCounsellors: number;
    unassignedCoordinators: number;
    unassignedCounsellors: number;
    totalFaculty: number;
  }> {
    try {
      const [students, mappings, faculty] = await Promise.all([
        this.getAllStudentsData(),
        this.getMappings(),
        this.getAllFacultyData(),
      ]);

      const activeMappings = mappings.filter((m) => m.isActive);
      const coordinatorMappings = activeMappings.filter(
        (m) => m.mappingType === "coordinator",
      );
      const counsellorMappings = activeMappings.filter(
        (m) => m.mappingType === "counsellor",
      );

      return {
        totalStudents: students.length,
        assignedCoordinators: coordinatorMappings.length,
        assignedCounsellors: counsellorMappings.length,
        unassignedCoordinators: students.length - coordinatorMappings.length,
        unassignedCounsellors: students.length - counsellorMappings.length,
        totalFaculty: faculty.length,
      };
    } catch (error) {
      console.error("Error getting assignment stats:", error);
      return {
        totalStudents: 0,
        assignedCoordinators: 0,
        assignedCounsellors: 0,
        unassignedCoordinators: 0,
        unassignedCounsellors: 0,
        totalFaculty: 0,
      };
    }
  }
}

export const enhancedMappingService = new EnhancedMappingService();
export default enhancedMappingService;
