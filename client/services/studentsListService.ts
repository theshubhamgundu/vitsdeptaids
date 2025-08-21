import { tables } from "@/lib/supabase";

export interface StudentsListRecord {
  id?: string;
  ht_no: string;
  student_name: string;
  year: string;
  branch?: string;
  section?: string;
  created_at?: string;
  updated_at?: string;
}

// Get all students from students_list table
export const getAllStudentsFromList = async (): Promise<
  StudentsListRecord[]
> => {
  try {
    const studentsListTable = tables.studentsList();
    if (!studentsListTable) {
      console.warn("Supabase not configured - students_list table unavailable");
      return [];
    }

    const { data, error } = await studentsListTable
      .select("*")
      .order("student_name");

    if (error) {
      console.error("Error fetching students list:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllStudentsFromList:", error);
    return [];
  }
};

// Get students by year
export const getStudentsByYear = async (
  year: string,
): Promise<StudentsListRecord[]> => {
  try {
    const studentsListTable = tables.studentsList();
    if (!studentsListTable) {
      console.warn("Supabase not configured - students_list table unavailable");
      return [];
    }

    const { data, error } = await studentsListTable
      .select("*")
      .eq("year", year)
      .order("student_name");

    if (error) {
      console.error("Error fetching students by year:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getStudentsByYear:", error);
    return [];
  }
};

// Get student by hall ticket number
export const getStudentByHallTicket = async (
  hallTicket: string,
): Promise<StudentsListRecord | null> => {
  try {
    const studentsListTable = tables.studentsList();
    if (!studentsListTable) {
      console.warn("Supabase not configured - students_list table unavailable");
      return null;
    }

    const { data, error } = await studentsListTable
      .select("*")
      .eq("ht_no", hallTicket)
      .single();

    if (error) {
      console.error("Error fetching student by hall ticket:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getStudentByHallTicket:", error);
    return null;
  }
};

// Search students by name
export const searchStudentsByName = async (
  searchTerm: string,
): Promise<StudentsListRecord[]> => {
  try {
    const studentsListTable = tables.studentsList();
    if (!studentsListTable) {
      console.warn("Supabase not configured - students_list table unavailable");
      return [];
    }

    const { data, error } = await studentsListTable
      .select("*")
      .ilike("student_name", `%${searchTerm}%`)
      .order("student_name");

    if (error) {
      console.error("Error searching students:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in searchStudentsByName:", error);
    return [];
  }
};

// Get student statistics from students_list
export const getStudentsListStats = async () => {
  try {
    const students = await getAllStudentsFromList();

    const stats = {
      total: students.length,
      byYear: {
        "1st Year": students.filter((s) => s.year === "1st Year").length,
        "2nd Year": students.filter((s) => s.year === "2nd Year").length,
        "3rd Year": students.filter((s) => s.year === "3rd Year").length,
        "4th Year": students.filter((s) => s.year === "4th Year").length,
      },
      yearDistribution: students.reduce((acc: any, student) => {
        acc[student.year] = (acc[student.year] || 0) + 1;
        return acc;
      }, {}),
    };

    return stats;
  } catch (error) {
    console.error("Error calculating students list stats:", error);
    return {
      total: 0,
      byYear: {
        "1st Year": 0,
        "2nd Year": 0,
        "3rd Year": 0,
        "4th Year": 0,
      },
      yearDistribution: {},
    };
  }
};

// Validate if a student exists in the students_list
export const validateStudentInList = async (
  hallTicket: string,
  studentName: string,
  year: string,
): Promise<boolean> => {
  try {
    const studentsListTable = tables.studentsList();
    if (!studentsListTable) {
      console.warn("Supabase not configured - students_list table unavailable");
      return false;
    }

    const { data, error } = await studentsListTable
      .select("id")
      .eq("ht_no", hallTicket)
      .eq("student_name", studentName.toUpperCase())
      .eq("year", year)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error validating student:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in validateStudentInList:", error);
    return false;
  }
};

export default {
  getAllStudentsFromList,
  getStudentsByYear,
  getStudentByHallTicket,
  searchStudentsByName,
  getStudentsListStats,
  validateStudentInList,
};
