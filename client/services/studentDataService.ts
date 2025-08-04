import { supabase, tables } from "@/lib/supabase";

export interface StudentRecord {
  id: string;
  hallTicket: string;
  fullName: string;
  email: string;
  phone?: string;
  year: string;
  section: string;
  cgpa: number;
  attendance: number;
  status: string;
  branch: string;
  semester: number;
  address?: string;
  emergencyContact?: string;
  admissionDate: string;
  createdAt: string;
  password?: string; // For local authentication
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

export interface Result {
  id: string;
  studentId: string;
  subject: string;
  semester: number;
  marks: number;
  grade: string;
  examType: string;
  examDate: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: string;
  status: "present" | "absent" | "late";
  period: number;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: "medical" | "personal" | "emergency";
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// Get all student data from various sources
export const getAllStudents = async (): Promise<StudentRecord[]> => {
  try {
    let students: StudentRecord[] = [];

    // Get from localStorage (newly registered students)
    const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
    const localStudents = localUsers.filter((user: any) => user.role === "student");
    
    students = localStudents.map((student: any) => ({
      id: student.id,
      hallTicket: student.hallTicket,
      fullName: student.name,
      email: student.email,
      phone: student.phone || "",
      year: student.year,
      section: student.section || "A",
      cgpa: student.cgpa || 0.0,
      attendance: student.attendance || 0,
      status: student.status || "Active",
      branch: "AI & DS",
      semester: getDefaultSemester(student.year),
      address: student.address || "",
      emergencyContact: student.emergencyContact || "",
      admissionDate: student.createdAt || new Date().toISOString(),
      createdAt: student.createdAt || new Date().toISOString(),
      password: student.password,
    }));

    // Get from Supabase if available
    const studentsTable = tables.students();
    if (studentsTable) {
      try {
        const { data: dbStudents, error } = await studentsTable
          .select("*")
          .order("name");

        if (!error && dbStudents) {
          const dbStudentRecords = dbStudents.map((student: any) => ({
            id: student.id,
            hallTicket: student.hall_ticket,
            fullName: student.name,
            email: student.email,
            phone: student.phone || "",
            year: student.year,
            section: student.section || "A",
            cgpa: student.cgpa || 0.0,
            attendance: student.attendance || 0,
            status: student.status || "Active",
            branch: student.branch || "AI & DS",
            semester: student.semester || getDefaultSemester(student.year),
            address: student.address || "",
            emergencyContact: student.emergency_contact || "",
            admissionDate: student.admission_date || student.created_at,
            createdAt: student.created_at,
          }));
          
          // Merge with local students, avoiding duplicates
          const existingHallTickets = students.map(s => s.hallTicket);
          const newDbStudents = dbStudentRecords.filter(
            s => !existingHallTickets.includes(s.hallTicket)
          );
          students = [...students, ...newDbStudents];
        }
      } catch (dbError) {
        console.warn("Database fetch failed, using local data only:", dbError);
      }
    }

    // Add demo students if no data exists
    if (students.length === 0) {
      students = [
        {
          id: "demo-1",
          hallTicket: "20AI001",
          fullName: "Demo Student",
          email: "demo@vignan.ac.in",
          phone: "+91 9876543210",
          year: "3rd Year",
          section: "A",
          cgpa: 8.45,
          attendance: 88,
          status: "Active",
          branch: "AI & DS",
          semester: 6,
          address: "Demo Address",
          emergencyContact: "+91 9876543211",
          admissionDate: "2021-08-01",
          createdAt: "2021-08-01T00:00:00.000Z",
        }
      ];
    }

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

// Get student by ID
export const getStudentById = async (studentId: string): Promise<StudentRecord | null> => {
  const students = await getAllStudents();
  return students.find(s => s.id === studentId) || null;
};

// Get student by hall ticket
export const getStudentByHallTicket = async (hallTicket: string): Promise<StudentRecord | null> => {
  const students = await getAllStudents();
  return students.find(s => s.hallTicket === hallTicket) || null;
};

// Get student statistics
export const getStudentStats = async () => {
  const students = await getAllStudents();
  
  const stats = {
    total: students.length,
    byYear: {
      1: students.filter(s => s.year.includes("1st")).length,
      2: students.filter(s => s.year.includes("2nd")).length,
      3: students.filter(s => s.year.includes("3rd")).length,
      4: students.filter(s => s.year.includes("4th")).length,
    },
    byStatus: {
      active: students.filter(s => s.status === "Active").length,
      inactive: students.filter(s => s.status === "Inactive").length,
      graduated: students.filter(s => s.status === "Graduated").length,
    },
    averageCgpa: students.length > 0 ? 
      students.reduce((sum, s) => sum + s.cgpa, 0) / students.length : 0,
    averageAttendance: students.length > 0 ? 
      students.reduce((sum, s) => sum + s.attendance, 0) / students.length : 0,
  };

  return stats;
};

// Get certificates for a student
export const getStudentCertificates = async (studentId: string): Promise<Certificate[]> => {
  try {
    // Get from localStorage first
    const localCertificates = JSON.parse(localStorage.getItem(`certificates_${studentId}`) || "[]");
    
    // TODO: Add Supabase integration for certificates
    
    return localCertificates;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
};

// Add a new certificate
export const addStudentCertificate = async (studentId: string, certificate: Omit<Certificate, "id" | "studentId" | "uploadDate" | "status">): Promise<boolean> => {
  try {
    const newCertificate: Certificate = {
      id: crypto.randomUUID(),
      studentId,
      ...certificate,
      uploadDate: new Date().toISOString(),
      status: "pending",
    };

    const existingCertificates = await getStudentCertificates(studentId);
    const updatedCertificates = [...existingCertificates, newCertificate];
    
    localStorage.setItem(`certificates_${studentId}`, JSON.stringify(updatedCertificates));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: `certificates_${studentId}`,
      newValue: JSON.stringify(updatedCertificates)
    }));
    
    return true;
  } catch (error) {
    console.error("Error adding certificate:", error);
    return false;
  }
};

// Get results for a student
export const getStudentResults = async (studentId: string): Promise<Result[]> => {
  try {
    const localResults = JSON.parse(localStorage.getItem(`results_${studentId}`) || "[]");
    return localResults;
  } catch (error) {
    console.error("Error fetching results:", error);
    return [];
  }
};

// Get attendance for a student
export const getStudentAttendance = async (studentId: string): Promise<AttendanceRecord[]> => {
  try {
    const localAttendance = JSON.parse(localStorage.getItem(`attendance_${studentId}`) || "[]");
    return localAttendance;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
};

// Get leave applications for a student
export const getStudentLeaveApplications = async (studentId: string): Promise<LeaveApplication[]> => {
  try {
    const localLeaves = JSON.parse(localStorage.getItem(`leaves_${studentId}`) || "[]");
    return localLeaves;
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    return [];
  }
};

// Add a leave application
export const addLeaveApplication = async (studentId: string, leave: Omit<LeaveApplication, "id" | "studentId" | "appliedDate" | "status">): Promise<boolean> => {
  try {
    const newLeave: LeaveApplication = {
      id: crypto.randomUUID(),
      studentId,
      ...leave,
      appliedDate: new Date().toISOString(),
      status: "pending",
    };

    const existingLeaves = await getStudentLeaveApplications(studentId);
    const updatedLeaves = [...existingLeaves, newLeave];
    
    localStorage.setItem(`leaves_${studentId}`, JSON.stringify(updatedLeaves));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: `leaves_${studentId}`,
      newValue: JSON.stringify(updatedLeaves)
    }));
    
    return true;
  } catch (error) {
    console.error("Error adding leave application:", error);
    return false;
  }
};

// Helper function to get default semester based on year
function getDefaultSemester(year: string): number {
  if (year.includes("1st")) return 2;
  if (year.includes("2nd")) return 4;
  if (year.includes("3rd")) return 6;
  if (year.includes("4th")) return 8;
  return 1;
}

// Real-time data update listeners
export const subscribeToStudentData = (callback: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "localUsers" || event.key?.startsWith("certificates_") || 
        event.key?.startsWith("results_") || event.key?.startsWith("attendance_") || 
        event.key?.startsWith("leaves_")) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};

export default {
  getAllStudents,
  getStudentById,
  getStudentByHallTicket,
  getStudentStats,
  getStudentCertificates,
  addStudentCertificate,
  getStudentResults,
  getStudentAttendance,
  getStudentLeaveApplications,
  addLeaveApplication,
  subscribeToStudentData,
};
