import { tables, fileHelpers } from "@/lib/supabase";

export interface StudentRecord {
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

export interface Certificate {
  id: string;
  studentId: string;
  title: string;
  description: string;
  organization: string;
  issueDate: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  fileUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// Get all student data from various sources
export const getAllStudents = async (): Promise<StudentRecord[]> => {
  try {
    let students: StudentRecord[] = [];

    // Try to fetch from Supabase first
    try {
      const studentsTable = tables.students();
      if (studentsTable) {
        const { data, error } = await studentsTable
          .select("*")
          .order("full_name");

        if (error) {
          console.error("Error fetching from Supabase:", error);
          // If it's a table doesn't exist error, log it specifically
          if (error.code === '42P01') {
            console.warn("Students table doesn't exist yet. Please run the database setup script.");
          }
        } else if (data) {
          students = data.map((student: any) => ({
            id: student.id,
            hallTicket: student.hall_ticket || student.hallTicket,
            fullName: student.full_name || student.fullName,
            email: student.email,
            phone: student.phone,
            year: student.year,
            section: student.section,
            cgpa: student.cgpa || 0,
            attendance: student.attendance || 0,
            status: student.status || "Active",
            branch: student.branch || "AI & DS",
            semester: student.semester || 1,
            address: student.address || "",
            emergencyContact: student.emergency_contact || student.emergencyContact || "",
            admissionDate: student.admission_date || student.admissionDate || "",
            createdAt: student.created_at || student.createdAt || "",
          }));
        }
      }
    } catch (dbError) {
      console.warn("Database fetch failed, using local data only:", dbError);
    }

    // If no data from database, try to get from localStorage
    if (students.length === 0) {
      try {
        // Get admin-created students
        const adminStudents = JSON.parse(
          localStorage.getItem("adminCreatedStudents") || "[]"
        );
        
        // Get local users who are students
        const localUsers = JSON.parse(
          localStorage.getItem("localUsers") || "[]"
        );
        
        const localStudents = localUsers.filter((user: any) => user.role === "student");
        
        // Combine both sources
        students = [...adminStudents, ...localStudents];
      } catch (localError) {
        console.warn("Local storage fetch failed:", localError);
      }
    }

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

// Get student by ID
export const getStudentById = async (
  studentId: string,
): Promise<StudentRecord | null> => {
  try {
    const students = await getAllStudents();
    return students.find((student) => student.id === studentId) || null;
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return null;
  }
};

// Get student by hall ticket
export const getStudentByHallTicket = async (
  hallTicket: string,
): Promise<StudentRecord | null> => {
  try {
    const students = await getAllStudents();
    return (
      students.find(
        (student) =>
          student.hallTicket.toLowerCase() === hallTicket.toLowerCase(),
      ) || null
    );
  } catch (error) {
    console.error("Error fetching student by hall ticket:", error);
    return null;
  }
};

// Get students by year
export const getStudentsByYear = async (
  year: string,
): Promise<StudentRecord[]> => {
  try {
    const students = await getAllStudents();
    return students.filter((student) => student.year === year);
  } catch (error) {
    console.error("Error fetching students by year:", error);
    return [];
  }
};

// Get students by status
export const getStudentsByStatus = async (
  status: string,
): Promise<StudentRecord[]> => {
  try {
    const students = await getAllStudents();
    return students.filter(
      (student) => student.status.toLowerCase() === status.toLowerCase(),
    );
  } catch (error) {
    console.error("Error fetching students by status:", error);
    return [];
  }
};

// Search students
export const searchStudents = async (
  query: string,
): Promise<StudentRecord[]> => {
  try {
    const students = await getAllStudents();
    const searchTerm = query.toLowerCase();

    return students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm) ||
        student.hallTicket.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm),
    );
  } catch (error) {
    console.error("Error searching students:", error);
    return [];
  }
};

// Get student statistics
export const getStudentStats = async (): Promise<{
  total: number;
  byYear: Record<number, number>;
  byStatus: Record<string, number>;
  averageCgpa: number;
  averageAttendance: number;
}> => {
  try {
    const students = await getAllStudents();

    const stats = {
      total: students.length,
      byYear: {} as Record<number, number>,
      byStatus: {} as Record<string, number>,
      averageCgpa: 0,
      averageAttendance: 0,
    };

    // Calculate year-wise distribution
    students.forEach((student) => {
      const yearNum = parseInt(student.year.match(/\d+/)?.[0] || "1");
      stats.byYear[yearNum] = (stats.byYear[yearNum] || 0) + 1;
    });

    // Calculate status-wise distribution
    students.forEach((student) => {
      const status = student.status.toLowerCase();
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    });

    // Calculate averages
    if (students.length > 0) {
      const totalCgpa = students.reduce((sum, student) => sum + student.cgpa, 0);
      const totalAttendance = students.reduce(
        (sum, student) => sum + student.attendance,
        0,
      );

      stats.averageCgpa = totalCgpa / students.length;
      stats.averageAttendance = totalAttendance / students.length;
    }

    return stats;
  } catch (error) {
    console.error("Error calculating student stats:", error);
    return {
      total: 0,
      byYear: {},
      byStatus: {},
      averageCgpa: 0,
      averageAttendance: 0,
    };
  }
};

// Get certificates for a student
export const getStudentCertificates = async (
  studentId: string,
): Promise<Certificate[]> => {
  try {
    // Prefer Supabase table if present
    const supabaseClient = tables.supabase();
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("student_certificates")
          .select("*")
          .eq("student_id", studentId)
          .order("upload_date", { ascending: false });

        if (!error && data) {
          return data.map((row: any) => ({
            id: row.id,
            studentId: row.student_id,
            title: row.title,
            description: row.description || "",
            organization: row.organization || "",
            issueDate: row.issue_date,
            uploadDate: row.upload_date,
            status: row.status || "pending",
            fileUrl: row.file_url || undefined,
            approvedBy: row.approved_by || undefined,
            approvedAt: row.approved_at || undefined,
            rejectionReason: row.rejection_reason || undefined,
          }));
        }
      } catch (e) {
        // fall back to local
      }
    }

    // Fallback: localStorage
    const localCertificates = JSON.parse(
      localStorage.getItem(`certificates_${studentId}`) || "[]",
    );
    return localCertificates;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
};

// Add a new certificate
export const addStudentCertificate = async (
  studentId: string,
  certificate: Omit<Certificate, "id" | "studentId" | "uploadDate" | "status">,
): Promise<boolean> => {
  try {
    // Upload file to documents bucket and save record if Supabase available
    const supabaseClient = tables.supabase();
    if (supabaseClient) {
      // Expect caller to pass a fileUrl temporarily as File name; improve signature by allowing File
      let uploadedUrl: string | undefined = certificate.fileUrl;
      // If fileUrl is a File-like path we cannot detect here; rely on UI to upload via fileHelpers
      if (!uploadedUrl) {
        // nothing to upload; reject
        return false;
      }

      const { data: inserted, error } = await supabaseClient
        .from("student_certificates")
        .insert({
          student_id: studentId,
          title: certificate.title,
          description: certificate.description,
          organization: certificate.organization,
          issue_date: certificate.issueDate,
          upload_date: new Date().toISOString(),
          status: "pending",
          file_url: uploadedUrl,
        })
        .select("id");

      if (error) {
        console.warn("Supabase insert failed, falling back to local:", error);
      } else if (inserted && inserted.length > 0) {
        return true;
      }
    }

    // Fallback local storage
    const newCertificate: Certificate = {
      id: crypto.randomUUID(),
      studentId,
      ...certificate,
      uploadDate: new Date().toISOString(),
      status: "pending",
    };

    const existingCertificates = await getStudentCertificates(studentId);
    const updatedCertificates = [...existingCertificates, newCertificate];
    localStorage.setItem(
      `certificates_${studentId}`,
      JSON.stringify(updatedCertificates),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `certificates_${studentId}`,
        newValue: JSON.stringify(updatedCertificates),
      }),
    );
    return true;
  } catch (error) {
    console.error("Error adding certificate:", error);
    return false;
  }
};

// Subscribe to student data changes
export const subscribeToStudentData = (callback: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.key === "localUsers" ||
      event.key === "adminCreatedStudents"
    ) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  // Return unsubscribe function
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};

// Add new student
export const addStudent = async (
  studentData: Omit<StudentRecord, "id" | "createdAt">,
): Promise<StudentRecord> => {
  try {
    const newStudent: StudentRecord = {
      ...studentData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage for now
    const existingStudents = JSON.parse(
      localStorage.getItem("adminCreatedStudents") || "[]",
    );
    existingStudents.push(newStudent);
    localStorage.setItem(
      "adminCreatedStudents",
      JSON.stringify(existingStudents),
    );

    // Also add to localUsers for authentication
    const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
    localUsers.push({
      id: newStudent.id,
      name: newStudent.fullName,
      role: "student",
      hallTicket: newStudent.hallTicket,
      email: newStudent.email,
      phone: newStudent.phone,
      year: newStudent.year,
      section: newStudent.section,
      password: "student123", // Default password
      cgpa: newStudent.cgpa,
      attendance: newStudent.attendance,
      status: newStudent.status,
      createdAt: newStudent.createdAt,
    });
    localStorage.setItem("localUsers", JSON.stringify(localUsers));

    return newStudent;
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

// Update student
export const updateStudent = async (
  studentId: string,
  updates: Partial<StudentRecord>,
): Promise<StudentRecord | null> => {
  try {
    const students = await getAllStudents();
    const studentIndex = students.findIndex(
      (student) => student.id === studentId,
    );

    if (studentIndex === -1) return null;

    const updatedStudent = { ...students[studentIndex], ...updates };
    students[studentIndex] = updatedStudent;

    // Update in localStorage
    const adminStudents = JSON.parse(
      localStorage.getItem("adminCreatedStudents") || "[]",
    );
    const adminIndex = adminStudents.findIndex(
      (s: any) => s.id === studentId,
    );

    if (adminIndex !== -1) {
      adminStudents[adminIndex] = updatedStudent;
      localStorage.setItem(
        "adminCreatedStudents",
        JSON.stringify(adminStudents),
      );
    }

    // Update in localUsers
    const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
    const userIndex = localUsers.findIndex((u: any) => u.id === studentId);

    if (userIndex !== -1) {
      localUsers[userIndex] = { ...localUsers[userIndex], ...updates };
      localStorage.setItem("localUsers", JSON.stringify(localUsers));
    }

    return updatedStudent;
  } catch (error) {
    console.error("Error updating student:", error);
    return null;
  }
};

// Delete student
export const deleteStudent = async (studentId: string): Promise<boolean> => {
  try {
    // Remove from adminCreatedStudents
    const adminStudents = JSON.parse(
      localStorage.getItem("adminCreatedStudents") || "[]",
    );
    const filteredAdminStudents = adminStudents.filter(
      (s: any) => s.id !== studentId,
    );
    localStorage.setItem(
      "adminCreatedStudents",
      JSON.stringify(filteredAdminStudents),
    );

    // Remove from localUsers
    const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
    const filteredLocalUsers = localUsers.filter(
      (u: any) => u.id !== studentId,
    );
    localStorage.setItem("localUsers", JSON.stringify(filteredLocalUsers));

    return true;
  } catch (error) {
    console.error("Error deleting student:", error);
    return false;
  }
};

export default {
  getAllStudents,
  getStudentById,
  getStudentByHallTicket,
  getStudentsByYear,
  getStudentsByStatus,
  searchStudents,
  getStudentStats,
  getStudentCertificates,
  addStudentCertificate,
  subscribeToStudentData,
  addStudent,
  updateStudent,
  deleteStudent,
};
