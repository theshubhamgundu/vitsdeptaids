import { validateStudentLocally } from "@/utils/localStudentData";
import {
  validateStudentInList,
  getStudentByHallTicket,
} from "@/services/studentsListService";

export interface StudentVerificationResult {
  isValid: boolean;
  source: "students_list" | "student_data" | "local_fallback" | "none";
  message: string;
  studentData?: any;
}

/**
 * Comprehensive student verification using all available sources
 * 1. First check the new students_list table
 * 2. Fallback to student_data table
 * 3. Final fallback to local data
 */
export const verifyStudentInDepartment = async (
  hallTicket: string,
  studentName: string,
  year: string,
): Promise<StudentVerificationResult> => {
  try {
    // Step 1: Check students_list table (new comprehensive database)
    console.log("🔍 Checking students_list table...");
    const isInStudentsList = await validateStudentInList(
      hallTicket,
      studentName,
      year,
    );

    if (isInStudentsList) {
      const studentData = await getStudentByHallTicket(hallTicket);
      return {
        isValid: true,
        source: "students_list",
        message: "Student verified from department database (students_list)",
        studentData,
      };
    }

    // Step 2: Fallback to student_data table (if available)
    console.log("🔍 Checking student_data table...");
    try {
      const { supabase } = await import("@/lib/supabase");
      if (supabase) {
        const { data, error } = await supabase
          .from("student_data")
          .select("*")
          .eq("ht_no", hallTicket)
          .eq("student_name", studentName.toUpperCase())
          .eq("year", year)
          .single();

        if (!error && data) {
          return {
            isValid: true,
            source: "student_data",
            message: "Student verified from student_data table",
            studentData: data,
          };
        }
      }
    } catch (error) {
      console.warn("Error checking student_data table:", error);
    }

    // Step 3: Final fallback to local data
    console.log("🔍 Checking local fallback data...");
    const isValidLocal = validateStudentLocally(hallTicket, studentName, year);

    if (isValidLocal) {
      return {
        isValid: true,
        source: "local_fallback",
        message: "Student verified from local fallback data",
      };
    }

    // No verification found
    return {
      isValid: false,
      source: "none",
      message:
        "Student not found in any verification source. Please check Hall Ticket Number, Name, and Year.",
    };
  } catch (error) {
    console.error("Error in student verification:", error);

    // Emergency fallback to local data only
    const isValidLocal = validateStudentLocally(hallTicket, studentName, year);

    if (isValidLocal) {
      return {
        isValid: true,
        source: "local_fallback",
        message: "Student verified from local data (emergency fallback)",
      };
    }

    return {
      isValid: false,
      source: "none",
      message: "Verification failed due to system error. Please try again.",
    };
  }
};

/**
 * Quick check if student exists in the new students_list table
 */
export const quickStudentCheck = async (
  hallTicket: string,
): Promise<boolean> => {
  try {
    const student = await getStudentByHallTicket(hallTicket);
    return !!student;
  } catch (error) {
    console.warn("Quick student check failed:", error);
    return false;
  }
};

/**
 * Get student info from students_list table
 */
export const getStudentInfo = async (hallTicket: string) => {
  try {
    const student = await getStudentByHallTicket(hallTicket);
    return student;
  } catch (error) {
    console.warn("Error getting student info:", error);
    return null;
  }
};

export default {
  verifyStudentInDepartment,
  quickStudentCheck,
  getStudentInfo,
};
