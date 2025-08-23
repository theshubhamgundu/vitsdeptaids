import { tables } from "@/lib/supabase";

export interface FacultyAssignment {
  id: string;
  faculty_id: string;
  year: string;
  role: 'coordinator' | 'counsellor';
  max_students?: number;
  created_at: string;
  updated_at: string;
}

export interface StudentCounsellorAssignment {
  id: string;
  student_ht_no: string;
  counsellor_id: string;
  year: string;
  assigned_at: string;
}

export interface FacultyWithAssignments {
  id: string;
  faculty_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  assignments: FacultyAssignment[];
}

export interface YearAssignmentSummary {
  year: string;
  coordinator?: {
    id: string;
    name: string;
    faculty_id: string;
  };
  counsellors: Array<{
    id: string;
    name: string;
    faculty_id: string;
    max_students: number;
    assigned_students: number;
  }>;
  total_students: number;
  assigned_students: number;
  unassigned_students: number;
}

// Get all faculty assignments
export const getAllFacultyAssignments = async (): Promise<FacultyAssignment[]> => {
  try {
    const facultyAssignmentsTable = tables.facultyAssignments();
    if (!facultyAssignmentsTable) {
      console.warn("Supabase not configured - faculty_assignments table unavailable");
      return [];
    }

    const { data, error } = await facultyAssignmentsTable
      .select("*")
      .order("year", { ascending: true })
      .order("role", { ascending: false }); // coordinators first

    if (error) {
      console.error("Error fetching faculty assignments:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllFacultyAssignments:", error);
    return [];
  }
};

// Get faculty assignments by year
export const getFacultyAssignmentsByYear = async (year: string): Promise<FacultyAssignment[]> => {
  try {
    const facultyAssignmentsTable = tables.facultyAssignments();
    if (!facultyAssignmentsTable) {
      console.warn("Supabase not configured - faculty_assignments table unavailable");
      return [];
    }

    const { data, error } = await facultyAssignmentsTable
      .select("*")
      .eq("year", year)
      .order("role", { ascending: false });

    if (error) {
      console.error("Error fetching faculty assignments by year:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFacultyAssignmentsByYear:", error);
    return [];
  }
};

// Get faculty assignments by faculty ID
export const getFacultyAssignmentsByFacultyId = async (facultyId: string): Promise<FacultyAssignment[]> => {
  try {
    const facultyAssignmentsTable = tables.facultyAssignments();
    if (!facultyAssignmentsTable) {
      console.warn("Supabase not configured - faculty_assignments table unavailable");
      return [];
    }

    const { data, error } = await facultyAssignmentsTable
      .select("*")
      .eq("faculty_id", facultyId)
      .order("year", { ascending: true });

    if (error) {
      console.error("Error fetching faculty assignments by faculty ID:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFacultyAssignmentsByFacultyId:", error);
    return [];
  }
};

// Create or update faculty assignment
export const upsertFacultyAssignment = async (assignment: Omit<FacultyAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    const facultyAssignmentsTable = tables.facultyAssignments();
    if (!facultyAssignmentsTable) {
      console.warn("Supabase not configured - faculty_assignments table unavailable");
      return false;
    }

    const { error } = await facultyAssignmentsTable
      .upsert({
        faculty_id: assignment.faculty_id,
        year: assignment.year,
        role: assignment.role,
        max_students: assignment.max_students,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'faculty_id,year'
      });

    if (error) {
      console.error("Error upserting faculty assignment:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in upsertFacultyAssignment:", error);
    return false;
  }
};

// Delete faculty assignment
export const deleteFacultyAssignment = async (facultyId: string, year: string): Promise<boolean> => {
  try {
    const facultyAssignmentsTable = tables.facultyAssignments();
    if (!facultyAssignmentsTable) {
      console.warn("Supabase not configured - faculty_assignments table unavailable");
      return false;
    }

    const { error } = await facultyAssignmentsTable
      .delete()
      .eq("faculty_id", facultyId)
      .eq("year", year);

    if (error) {
      console.error("Error deleting faculty assignment:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFacultyAssignment:", error);
    return false;
  }
};

// Get student-counsellor assignments
export const getStudentCounsellorAssignments = async (year?: string): Promise<StudentCounsellorAssignment[]> => {
  try {
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    if (!studentCounsellorAssignmentsTable) {
      console.warn("Supabase not configured - student_counsellor_assignments table unavailable");
      return [];
    }

    let query = studentCounsellorAssignmentsTable.select("*");
    
    if (year) {
      query = query.eq("year", year);
    }

    const { data, error } = await query.order("assigned_at", { ascending: false });

    if (error) {
      console.error("Error fetching student-counsellor assignments:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getStudentCounsellorAssignments:", error);
    return [];
  }
};

// Assign students to counsellors for a specific year
export const assignStudentsToCounsellors = async (year: string): Promise<boolean> => {
  try {
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    if (!studentCounsellorAssignmentsTable) {
      console.warn("Supabase not configured - student_counsellor_assignments table unavailable");
      return false;
    }

    // This will call the database function we created
    const supabaseClient = tables.supabase();
    if (!supabaseClient) {
      console.warn("Supabase client not available");
      return false;
    }
    const { error } = await supabaseClient.rpc('assign_students_to_counsellors', { target_year: year });

    if (error) {
      console.error("Error assigning students to counsellors:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in assignStudentsToCounsellors:", error);
    return false;
  }
};

// Get students visible to a faculty member
export const getVisibleStudentsForFaculty = async (facultyId: string): Promise<any[]> => {
  try {
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    if (!studentCounsellorAssignmentsTable) {
      console.warn("Supabase not configured - student_counsellor_assignments table unavailable");
      return [];
    }

    // This will call the database function we created
    const supabaseClient = tables.supabase();
    if (!supabaseClient) {
      console.warn("Supabase client not available");
      return [];
    }
    const { data, error } = await supabaseClient.rpc('get_visible_students_for_faculty', { faculty_uuid: facultyId });

    if (error) {
      console.error("Error getting visible students for faculty:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getVisibleStudentsForFaculty:", error);
    return [];
  }
};

// Get year assignment summary
export const getYearAssignmentSummary = async (): Promise<YearAssignmentSummary[]> => {
  try {
    const facultyAssignmentsTable = tables.facultyAssignments();
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    
    if (!facultyAssignmentsTable || !studentCounsellorAssignmentsTable) {
      console.warn("Supabase not configured - required tables unavailable");
      return [];
    }

    // Get all assignments
    const [assignments, studentAssignments] = await Promise.all([
      getAllFacultyAssignments(),
      getStudentCounsellorAssignments()
    ]);

    // Group by year
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const summaries: YearAssignmentSummary[] = [];

    for (const year of years) {
      const yearAssignments = assignments.filter(a => a.year === year);
      const coordinator = yearAssignments.find(a => a.role === 'coordinator');
      const counsellors = yearAssignments.filter(a => a.role === 'counsellor');

      // Count students for this year (you'll need to implement this based on your student_data table)
      const totalStudents = 0; // TODO: Implement based on your student_data table
      const assignedStudents = studentAssignments.filter(sa => sa.year === year).length;

      summaries.push({
        year,
        coordinator: coordinator ? {
          id: coordinator.faculty_id,
          name: '', // TODO: Get faculty name
          faculty_id: coordinator.faculty_id
        } : undefined,
        counsellors: counsellors.map(c => ({
          id: c.faculty_id,
          name: '', // TODO: Get faculty name
          faculty_id: c.faculty_id,
          max_students: c.max_students || 0,
          assigned_students: studentAssignments.filter(sa => 
            sa.counsellor_id === c.faculty_id && sa.year === year
          ).length
        })),
        total_students: totalStudents,
        assigned_students: assignedStudents,
        unassigned_students: totalStudents - assignedStudents
      });
    }

    return summaries;
  } catch (error) {
    console.error("Error in getYearAssignmentSummary:", error);
    return [];
  }
};

// Manual assignment of a student to a counsellor
export const assignStudentToCounsellor = async (
  studentHtNo: string, 
  counsellorId: string, 
  year: string
): Promise<boolean> => {
  try {
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    if (!studentCounsellorAssignmentsTable) {
      console.warn("Supabase not configured - student_counsellor_assignments table unavailable");
      return false;
    }

    const { error } = await studentCounsellorAssignmentsTable
      .upsert({
        student_ht_no: studentHtNo,
        counsellor_id: counsellorId,
        year,
        assigned_at: new Date().toISOString()
      }, {
        onConflict: 'student_ht_no,year'
      });

    if (error) {
      console.error("Error assigning student to counsellor:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in assignStudentToCounsellor:", error);
    return false;
  }
};

// Remove student assignment
export const removeStudentAssignment = async (studentHtNo: string, year: string): Promise<boolean> => {
  try {
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    if (!studentCounsellorAssignmentsTable) {
      console.warn("Supabase not configured - student_counsellor_assignments table unavailable");
      return false;
    }

    const { error } = await studentCounsellorAssignmentsTable
      .delete()
      .eq("student_ht_no", studentHtNo)
      .eq("year", year);

    if (error) {
      console.error("Error removing student assignment:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in removeStudentAssignment:", error);
    return false;
  }
};

// Get counsellor information for a specific student
export const getCounsellorForStudent = async (studentHtNo: string): Promise<any> => {
  try {
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    if (!studentCounsellorAssignmentsTable) {
      console.warn("Supabase not configured - student_counsellor_assignments table unavailable");
      return null;
    }

    const { data, error } = await studentCounsellorAssignmentsTable
      .select(`
        *,
        faculty:faculty_id (
          id,
          name,
          email,
          designation,
          specialization
        )
      `)
      .eq("student_ht_no", studentHtNo)
      .single();

    if (error) {
      console.error("Error fetching counsellor for student:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCounsellorForStudent:", error);
    return null;
  }
};

export default {
  getAllFacultyAssignments,
  getFacultyAssignmentsByYear,
  getFacultyAssignmentsByFacultyId,
  upsertFacultyAssignment,
  deleteFacultyAssignment,
  getStudentCounsellorAssignments,
  assignStudentsToCounsellors,
  getVisibleStudentsForFaculty,
  getYearAssignmentSummary,
  assignStudentToCounsellor,
  removeStudentAssignment,
  getCounsellorForStudent
};
