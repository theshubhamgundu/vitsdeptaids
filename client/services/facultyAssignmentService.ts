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

    // Resolve possible human-readable code to UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(facultyId);
    let facultyUuid = facultyId;
    if (!isUuid) {
      try {
        const facultyTable = tables.faculty?.();
        if (facultyTable) {
          const { data: frow } = await facultyTable
            .select('id, faculty_id')
            .eq('faculty_id', facultyId)
            .single();
          if (frow?.id) {
            facultyUuid = frow.id;
          }
        }
      } catch {}
    }

    const { data, error } = await facultyAssignmentsTable
      .select("*")
      .or(`faculty_id.eq.${facultyUuid},faculty_id.eq.${facultyId}`)
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
    // Resolve human-readable faculty codes (e.g., AIDS-PGL1) to actual UUID from faculty table
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(facultyId);
    let facultyUuid = facultyId;
    if (!isUuid) {
      try {
        const facultyTable = tables.faculty?.();
        if (facultyTable) {
          const { data: frow } = await facultyTable
            .select('id, faculty_id')
            .eq('faculty_id', facultyId)
            .single();
          if (frow?.id) {
            facultyUuid = frow.id;
          }
        }
      } catch (e) {
        // ignore and try with provided id
      }
    }

    const { data, error } = await supabaseClient.rpc('get_visible_students_for_faculty', { faculty_uuid: facultyUuid });

    if (!error && data && data.length > 0) {
      return data;
    }

    // Fallback: manually build visible students from assignments + student_data
    console.warn("RPC get_visible_students_for_faculty returned empty or errored. Falling back to manual join.");

    // 1) Pull student assignments for this faculty (as counsellor)
    const { data: sa, error: saErr } = await studentCounsellorAssignmentsTable
      .select('student_ht_no, year, assigned_at')
      .eq('counsellor_id', facultyUuid);

    const htNos: string[] = (sa || []).map((r: any) => r.student_ht_no).filter(Boolean);
    const yearByHt: Record<string, string> = Object.fromEntries((sa || []).map((r: any) => [r.student_ht_no, r.year]));
    const assignedAtByHt: Record<string, string> = Object.fromEntries((sa || []).map((r: any) => [r.student_ht_no, r.assigned_at]));

    // 1b) Also include coordinator visibility: all students of assigned years
    const facultyAssignmentsTable = tables.facultyAssignments();
    let coordinatorYears: string[] = [];
    let isCoordinator = false;
    if (facultyAssignmentsTable) {
      const { data: fa } = await facultyAssignmentsTable
        .select('year, role')
        .eq('faculty_id', facultyUuid);
      coordinatorYears = (fa || [])
        .filter((r: any) => r.role === 'coordinator')
        .map((r: any) => r.year);
      isCoordinator = coordinatorYears.length > 0;
    }

    // 2) Pull student details from department table (student_data)
    const studentDataTable = tables.studentsList?.();
    if (!studentDataTable) {
      console.warn("student_data table not available");
      return [];
    }

    // Build base query - get ALL students if coordinator, or just assigned ones if counsellor
    let studentsData: any[] = [];
    
    if (isCoordinator && coordinatorYears.length > 0) {
      // Coordinator: Get ALL students in assigned years
      const { data: yearStudents } = await studentDataTable
        .select('ht_no, student_name, year, id')
        .in('year', coordinatorYears);

      let combinedYearStudents = yearStudents || [];

      // Fallback for case/format mismatches ('4th Year' vs '4th year')
      if (combinedYearStudents.length === 0) {
        const { data: allStudents } = await studentDataTable
          .select('ht_no, student_name, year, id')
          .limit(1000); // Add limit to prevent timeout
        if (allStudents && allStudents.length > 0) {
          const normalize = (v: string) => (v || '').toLowerCase().replace(/\s+/g, ' ').trim();
          const normalizedTargets = new Set(coordinatorYears.map(normalize));
          combinedYearStudents = allStudents.filter((s: any) => normalizedTargets.has(normalize(s.year)));
        }
      }
      
      studentsData = combinedYearStudents || [];
    } else if (htNos.length > 0) {
      // Counsellor: Get only assigned students
      const { data: counsellorStudents } = await studentDataTable
        .select('ht_no, student_name, year, id')
        .in('ht_no', htNos);
      studentsData = counsellorStudents || [];
    }

    const byHt: Record<string, any> = {};
    (studentsData || []).forEach((s: any) => {
      byHt[s.ht_no] = s;
    });

    // 3) Merge counsellor and coordinator visibility
    const mergedSet: Record<string, any> = {};
    
    if (isCoordinator) {
      // Coordinator: All students in assigned years
      (studentsData || []).forEach((s: any) => {
        mergedSet[s.ht_no] = {
          ht_no: s.ht_no,
          student_name: s.student_name,
          year: s.year,
          assigned_at: new Date().toISOString(),
          id: s.id || s.ht_no,
          assignment_type: 'coordinator'
        };
      });
    } else {
      // Counsellor: Only assigned students
      htNos.forEach((ht) => {
        mergedSet[ht] = {
          ht_no: ht,
          student_name: byHt[ht]?.student_name || 'Unknown Student',
          year: byHt[ht]?.year || yearByHt[ht] || '',
          assigned_at: assignedAtByHt[ht] || new Date().toISOString(),
          id: byHt[ht]?.id || ht,
          assignment_type: 'counsellor'
        };
      });
    }

    const merged = Object.values(mergedSet);
    console.log(`🔍 Found ${merged.length} students for faculty ${facultyId}:`, merged.map(s => s.student_name));
    console.log(`🔍 Faculty UUID: ${facultyUuid}, Is Coordinator: ${isCoordinator}, Coordinator Years: ${coordinatorYears.join(', ')}`);
    console.log(`🔍 Counsellor HT Numbers: ${htNos.join(', ')}`);
    console.log(`🔍 Students Data Count: ${studentsData.length}`);

    return merged;
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
    console.log("🔍 Fetching counsellor for student:", studentHtNo);
    
    // Check localStorage first for assignments
    const localAssignments = JSON.parse(localStorage.getItem("student_counsellor_assignments") || "[]");
    const localAssignment = localAssignments.find((assignment: any) => assignment.student_ht_no === studentHtNo);
    
    if (localAssignment) {
      console.log("📱 Counsellor assignment found in localStorage");
      
      // Get faculty info from localStorage
      const localFaculty = JSON.parse(localStorage.getItem("localFaculty") || "[]");
      const faculty = localFaculty.find((f: any) => f.faculty_id === localAssignment.counsellor_id);
      
      if (faculty) {
        return {
          ...localAssignment,
          faculty: {
            id: faculty.faculty_id,
            name: faculty.name,
            email: faculty.email,
            designation: faculty.designation,
            specialization: faculty.specialization || "Computer Science"
          }
        };
      }
    }
    
    // Try database as fallback (but don't fail if it doesn't work)
    const studentCounsellorAssignmentsTable = tables.studentCounsellorAssignments();
    const facultyTable = tables.faculty();
    
    if (studentCounsellorAssignmentsTable && facultyTable) {
      try {
        // First, get the assignment
        const { data: assignment, error: assignmentError } = await studentCounsellorAssignmentsTable
          .select("*")
          .eq("student_ht_no", studentHtNo)
          .single();

        if (!assignmentError && assignment) {
          // Then, get the faculty information
          const { data: faculty, error: facultyError } = await facultyTable
            .select("id, name, email, designation, specialization")
            .eq("id", assignment.counsellor_id)
            .single();

          if (!facultyError && faculty) {
            console.log("✅ Counsellor data retrieved from database");
            return {
              ...assignment,
              faculty
            };
          }
        }
      } catch (dbError) {
        console.warn("⚠️ Database query failed (expected):", dbError);
      }
    }

    // Return default counsellor assignment
    console.log("📱 Using default counsellor assignment");
    return {
      student_ht_no: studentHtNo,
      counsellor_id: "AIDS-PGL1",
      assigned_date: new Date().toISOString(),
      faculty: {
        id: "AIDS-PGL1",
        name: "Dr. Default Counsellor",
        email: "default@college.com",
        designation: "Assistant Professor",
        specialization: "Computer Science"
      }
    };
  } catch (error) {
    console.error("❌ Error in getCounsellorForStudent:", error);
    // Return default data instead of null
    return {
      student_ht_no: studentHtNo,
      counsellor_id: "AIDS-PGL1",
      assigned_date: new Date().toISOString(),
      faculty: {
        id: "AIDS-PGL1",
        name: "Dr. Default Counsellor",
        email: "default@college.com",
        designation: "Assistant Professor",
        specialization: "Computer Science"
      }
    };
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
