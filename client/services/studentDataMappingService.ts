import { tables } from "@/lib/supabase";

export interface StudentDataRecord {
  id?: string;
  // Common column names that might exist in your student_data table
  hall_ticket?: string;
  ht_no?: string;
  student_name?: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  year?: string;
  section?: string;
  cgpa?: number;
  attendance?: number;
  status?: string;
  branch?: string;
  semester?: number;
  address?: string;
  emergency_contact?: string;
  admission_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MappedStudentRecord {
  id: string;
  hallTicket: string;
  fullName: string;
  email: string;
  phone: string;
  year: string;
  section: string;
  cgpa: number;
  attendance: number;
  status: string;
  branch: string;
  semester: number;
  address: string;
  emergencyContact: string;
  admissionDate: string;
  createdAt: string;
}

// Map raw database record to expected format
export const mapStudentDataRecord = (record: StudentDataRecord): MappedStudentRecord => {
  return {
    id: record.id || crypto.randomUUID(),
    hallTicket: record.hall_ticket || record.ht_no || '',
    fullName: record.student_name || record.full_name || record.name || '',
    email: record.email || '',
    phone: record.phone || '',
    year: record.year || '',
    section: record.section || '',
    cgpa: record.cgpa || 0,
    attendance: record.attendance || 0,
    status: record.status || 'Active',
    branch: record.branch || 'AI & DS',
    semester: record.semester || 1,
    address: record.address || '',
    emergencyContact: record.emergency_contact || '',
    admissionDate: record.admission_date || '',
    createdAt: record.created_at || new Date().toISOString(),
  };
};

// Get all students from your student_data table
export const getAllStudentsFromData = async (): Promise<MappedStudentRecord[]> => {
  try {
    const studentDataTable = tables.studentsList();
    if (!studentDataTable) {
      console.warn("Supabase not configured - student_data table unavailable");
      return [];
    }

    const { data, error } = await studentDataTable
      .select("*");

    if (error) {
      console.error("Error fetching from student_data:", error);
      return [];
    }

    // Map the data to expected format
    return (data || []).map(mapStudentDataRecord);
  } catch (error) {
    console.error("Error in getAllStudentsFromData:", error);
    return [];
  }
};

// Get students by year from your student_data table
export const getStudentsByYearFromData = async (year: string): Promise<MappedStudentRecord[]> => {
  try {
    const studentDataTable = tables.studentsList();
    if (!studentDataTable) {
      console.warn("Supabase not configured - student_data table unavailable");
      return [];
    }

    // Try different possible column names for year
    let { data, error } = await studentDataTable
      .select("*")
      .eq("year", year);

    if (error) {
      // Try alternative column names
      const { data: altData, error: altError } = await studentDataTable
        .select("*")
        .eq("academic_year", year);
      
      if (altError) {
        console.error("Error fetching students by year:", error);
        return [];
      }
      data = altData;
    }

    return (data || []).map(mapStudentDataRecord);
  } catch (error) {
    console.error("Error in getStudentsByYearFromData:", error);
    return [];
  }
};

// Search students by name in your student_data table
export const searchStudentsByNameInData = async (searchTerm: string): Promise<MappedStudentRecord[]> => {
  try {
    const studentDataTable = tables.studentsList();
    if (!studentDataTable) {
      console.warn("Supabase not configured - student_data table unavailable");
      return [];
    }

    // Try different possible column names for name
    let { data, error } = await studentDataTable
      .select("*")
      .ilike("student_name", `%${searchTerm}%`);

    if (error) {
      // Try alternative column names
      const { data: altData, error: altError } = await studentDataTable
        .select("*")
        .ilike("full_name", `%${searchTerm}%`);
      
      if (altError) {
        const { data: nameData, error: nameError } = await studentDataTable
          .select("*")
          .ilike("name", `%${searchTerm}%`);
        
        if (nameError) {
          console.error("Error searching students:", error);
          return [];
        }
        data = nameData;
      } else {
        data = altData;
      }
    }

    return (data || []).map(mapStudentDataRecord);
  } catch (error) {
    console.error("Error in searchStudentsByNameInData:", error);
    return [];
  }
};

// Get student statistics from your student_data table
export const getStudentDataStats = async () => {
  try {
    const students = await getAllStudentsFromData();

    const stats = {
      total: students.length,
      byYear: {
        "1st Year": students.filter((s) => s.year.includes("1st")).length,
        "2nd Year": students.filter((s) => s.year.includes("2nd")).length,
        "3rd Year": students.filter((s) => s.year.includes("3rd")).length,
        "4th Year": students.filter((s) => s.year.includes("4th")).length,
      },
      yearDistribution: students.reduce((acc: any, student) => {
        acc[student.year] = (acc[student.year] || 0) + 1;
        return acc;
      }, {}),
    };

    return stats;
  } catch (error) {
    console.error("Error calculating student data stats:", error);
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

export default {
  getAllStudentsFromData,
  getStudentsByYearFromData,
  searchStudentsByNameInData,
  getStudentDataStats,
  mapStudentDataRecord,
};
