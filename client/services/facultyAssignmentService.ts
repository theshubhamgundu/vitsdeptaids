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

// Simplified model: exactly one coordinator and one counsellor per year
export interface YearRoles { coordinator_id: string; counsellor_id: string; }

export const setYearRoles = async (year: string, roles: YearRoles): Promise<boolean> => {
  try {
    const facultyAssignments = tables.facultyAssignments();
    if (facultyAssignments) {
      const upserts = [
        { faculty_id: roles.coordinator_id, year, role: 'coordinator', updated_at: new Date().toISOString() },
        { faculty_id: roles.counsellor_id, year, role: 'counsellor', updated_at: new Date().toISOString() },
      ];
      const { error } = await facultyAssignments.upsert(upserts as any, { onConflict: 'year,role' } as any);
      if (!error) {
        const cache = JSON.parse(localStorage.getItem('year_roles') || '{}');
        cache[year] = roles;
        localStorage.setItem('year_roles', JSON.stringify(cache));
        return true;
      }
    }
  } catch (e) {
    console.warn('setYearRoles DB upsert failed:', e);
  }
  try {
    const cache = JSON.parse(localStorage.getItem('year_roles') || '{}');
    cache[year] = roles;
    localStorage.setItem('year_roles', JSON.stringify(cache));
    return true;
  } catch {}
  return false;
};

export const getYearRoles = async (): Promise<Record<string, YearRoles>> => {
  const result: Record<string, YearRoles> = {};
  try {
    const facultyAssignments = tables.facultyAssignments();
    if (facultyAssignments) {
      const { data } = await facultyAssignments.select('faculty_id, year, role');
      (data || []).forEach((row: any) => {
        if (!result[row.year]) result[row.year] = { coordinator_id: '', counsellor_id: '' };
        if (row.role === 'coordinator') result[row.year].coordinator_id = row.faculty_id;
        if (row.role === 'counsellor') result[row.year].counsellor_id = row.faculty_id;
      });
    }
  } catch (e) {
    console.warn('getYearRoles DB read failed:', e);
  }
  try {
    const cache = JSON.parse(localStorage.getItem('year_roles') || '{}');
    for (const y of Object.keys(cache)) {
      result[y] = { ...(result[y] || {}), ...cache[y] };
    }
  } catch {}
  return result;
};

// Get students visible to a faculty member
export const getVisibleStudentsForFaculty = async (facultyId: string): Promise<any[]> => {
  try {
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
    // Simplified model: year roles
    const rolesByYear = await getYearRoles();
    const coordYears = Object.keys(rolesByYear).filter(y => rolesByYear[y]?.coordinator_id === facultyUuid || rolesByYear[y]?.coordinator_id === facultyId);
    const counsYears = Object.keys(rolesByYear).filter(y => rolesByYear[y]?.counsellor_id === facultyUuid || rolesByYear[y]?.counsellor_id === facultyId);

    if (coordYears.length === 0 && counsYears.length === 0) return [];

    // Pull students from department table (student_data)
    const studentDataTable = tables.studentsList?.();
    if (!studentDataTable) {
      console.warn("student_data table not available");
      return [];
    }
    const targetYears = Array.from(new Set([...coordYears, ...counsYears]));
    let { data: allYearStudents } = await studentDataTable
      .select('ht_no, student_name, year, id')
      .in('year', targetYears);
    allYearStudents = allYearStudents || [];

    const normalizeYear = (v: string) => (v || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const result: any[] = [];
    for (const year of targetYears) {
      const yearStudents = allYearStudents
        .filter((s: any) => normalizeYear(s.year) === normalizeYear(year))
        .sort((a: any, b: any) => (a.ht_no || '').localeCompare(b.ht_no || ''));

      if (coordYears.includes(year)) {
        yearStudents.forEach((s: any) => result.push({
          ht_no: s.ht_no,
          student_name: s.student_name,
          year: s.year,
          id: s.id || s.ht_no,
          assignment_type: 'coordinator'
        }));
      }

      if (counsYears.includes(year)) {
        const half = Math.ceil(yearStudents.length / 2);
        const counsellorSet = yearStudents.slice(0, half);
        counsellorSet.forEach((s: any) => result.push({
          ht_no: s.ht_no,
          student_name: s.student_name,
          year: s.year,
          id: s.id || s.ht_no,
          assignment_type: 'counsellor'
        }));
      }
    }

    const dedup: Record<string, any> = {};
    for (const s of result) {
      const prev = dedup[s.ht_no];
      if (!prev || prev.assignment_type === 'counsellor') dedup[s.ht_no] = s;
    }
    return Object.values(dedup);
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

    // Determine student's year
    let year: string | null = null;
    try {
      const studentsTable = tables.students();
      if (studentsTable) {
        const { data } = await studentsTable
          .select('year, hall_ticket')
          .eq('hall_ticket', studentHtNo)
          .single();
        year = data?.year || null;
      }
    } catch {}
    if (!year) {
      try {
        const studentData = tables.studentsList?.();
        if (studentData) {
          const { data } = await studentData
            .select('year, ht_no')
            .eq('ht_no', studentHtNo)
            .single();
          year = data?.year || null;
        }
      } catch {}
    }

    const roles = await getYearRoles();
    const counsellorId = year ? roles[year]?.counsellor_id || '' : '';
    let faculty: any = null;
    if (counsellorId) {
      const facultyTable = tables.faculty?.();
      try {
        if (facultyTable) {
          const { data } = await facultyTable
            .select('id, name, email, designation, specialization, faculty_id')
            .or(`id.eq.${counsellorId},faculty_id.eq.${counsellorId}`)
            .limit(1)
            .single();
          faculty = data;
        }
      } catch {}
    }
    return {
      student_ht_no: studentHtNo,
      counsellor_id: counsellorId,
      assigned_date: new Date().toISOString(),
      faculty: faculty || { id: counsellorId, name: counsellorId ? 'Counsellor' : 'Not Assigned', email: '', designation: '', specialization: '' }
    };
  } catch (error) {
    console.error("❌ Error in getCounsellorForStudent:", error);
    // Return default data instead of null
    return {
      student_ht_no: studentHtNo,
      counsellor_id: '',
      assigned_date: new Date().toISOString(),
      faculty: {
        id: '',
        name: "Not Assigned",
        email: "",
        designation: "",
        specialization: ""
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
  getCounsellorForStudent,
  setYearRoles,
  getYearRoles
};
