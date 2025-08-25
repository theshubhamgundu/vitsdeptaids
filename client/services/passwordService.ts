import { supabase, tables } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface PasswordChangeRequest {
  userId: string;
  userRole: "student" | "faculty" | "admin" | "hod";
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const passwordService = {
  // Validate password strength
  validatePassword: (password: string): PasswordValidationResult => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate password change request
  validatePasswordChange: (request: PasswordChangeRequest): PasswordValidationResult => {
    const errors: string[] = [];
    
    // Check if passwords match
    if (request.newPassword !== request.confirmPassword) {
      errors.push("New password and confirm password do not match");
    }
    
    // Check if new password is different from current
    if (request.currentPassword === request.newPassword) {
      errors.push("New password must be different from current password");
    }
    
    // Validate new password strength
    const passwordValidation = passwordService.validatePassword(request.newPassword);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Change password for faculty
  changeFacultyPassword: async (
    facultyId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("🔐 Changing faculty password for:", facultyId);
      
      const facultyTable = tables.faculty();
      if (!facultyTable) {
        return { success: false, error: "Database not configured" };
      }

      // First, verify current password
      const { data: faculty, error: verifyError } = await facultyTable
        .select("id, password_hash")
        .eq("faculty_id", facultyId)
        .eq("password_hash", currentPassword)
        .single();

      if (verifyError || !faculty) {
        return { success: false, error: "Current password is incorrect" };
      }

      // Update password in database
      const { error: updateError } = await facultyTable
        .update({ 
          password_hash: newPassword,
          password_changed_at: new Date().toISOString(),
          can_change_password: false // Disable further changes if needed
        })
        .eq("id", faculty.id);

      if (updateError) {
        console.error("❌ Password update failed:", updateError);
        return { success: false, error: "Failed to update password" };
      }

      console.log("✅ Faculty password changed successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Error changing faculty password:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  // Change password for student
  changeStudentPassword: async (
    hallTicket: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("🔐 Changing student password for:", hallTicket);
      
      const studentsTable = tables.students();
      let passwordVerified = false;
      let studentId = null;

      // First, try to verify current password from database
      if (studentsTable) {
        try {
          const { data: student, error: verifyError } = await studentsTable
            .select("id, password")
            .eq("hall_ticket", hallTicket)
            .eq("password", currentPassword)
            .single();

          if (!verifyError && student) {
            passwordVerified = true;
            studentId = student.id;
          }
        } catch (dbError) {
          console.warn("Database password verification failed, trying localStorage:", dbError);
        }
      }

      // If database verification failed, try localStorage
      if (!passwordVerified) {
        try {
          const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
          const student = localUsers.find((user: any) => 
            user.hallTicket === hallTicket && 
            (user.password === currentPassword || user.password === hallTicket) // Allow hall ticket as default
          );
          
          if (student) {
            passwordVerified = true;
            studentId = student.id;
            console.log("✅ Password verified from localStorage");
          }
        } catch (localError) {
          console.warn("localStorage password verification failed:", localError);
        }
      }

      if (!passwordVerified) {
        return { success: false, error: "Current password is incorrect" };
      }

      // Update password in database if available
      if (studentsTable && studentId) {
        try {
          const { error: updateError } = await studentsTable
            .update({ 
              password: newPassword,
              password_changed_at: new Date().toISOString()
            })
            .eq("id", studentId);

          if (updateError) {
            console.error("❌ Database password update failed:", updateError);
          } else {
            console.log("✅ Password updated in database");
          }
        } catch (dbError) {
          console.warn("Database password update failed:", dbError);
        }
      }

      // Update password in localStorage
      try {
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const userIndex = localUsers.findIndex((user: any) => user.hallTicket === hallTicket);
        
        if (userIndex !== -1) {
          localUsers[userIndex].password = newPassword;
          localStorage.setItem("localUsers", JSON.stringify(localUsers));
          console.log("✅ Password updated in localStorage");
        }
      } catch (localError) {
        console.warn("localStorage password update failed:", localError);
      }

      console.log("✅ Student password changed successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Error changing student password:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  // Reset password to default (for admin use)
  resetPasswordToDefault: async (
    userId: string,
    userRole: "student" | "faculty",
    defaultPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("🔄 Resetting password to default for:", userId);
      
      if (userRole === "faculty") {
        const facultyTable = tables.faculty();
        if (!facultyTable) {
          return { success: false, error: "Database not configured" };
        }

        const { error } = await facultyTable
          .update({ 
            password_hash: defaultPassword,
            password_changed_at: null,
            can_change_password: true
          })
          .eq("id", userId);

        if (error) {
          return { success: false, error: "Failed to reset password" };
        }
      } else {
        const studentsTable = tables.students();
        if (!studentsTable) {
          return { success: false, error: "Database not configured" };
        }

        const { error } = await studentsTable
          .update({ 
            password: defaultPassword,
            password_changed_at: null
          })
          .eq("id", userId);

        if (error) {
          return { success: false, error: "Failed to reset password" };
        }
      }

      console.log("✅ Password reset to default successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  // Get password change status
  getPasswordChangeStatus: async (
    userId: string,
    userRole: "student" | "faculty"
  ): Promise<{ hasChangedPassword: boolean; lastChanged?: string }> => {
    try {
      if (userRole === "faculty") {
        const facultyTable = tables.faculty();
        if (!facultyTable) {
          return { hasChangedPassword: false };
        }

        const { data } = await facultyTable
          .select("password_changed_at")
          .eq("id", userId)
          .single();

        return {
          hasChangedPassword: !!data?.password_changed_at,
          lastChanged: data?.password_changed_at
        };
      } else {
        const studentsTable = tables.students();
        if (!studentsTable) {
          return { hasChangedPassword: false };
        }

        const { data } = await studentsTable
          .select("password_changed_at")
          .eq("id", userId)
          .single();

        return {
          hasChangedPassword: !!data?.password_changed_at,
          lastChanged: data?.password_changed_at
        };
      }
    } catch (error) {
      console.error("❌ Error getting password change status:", error);
      return { hasChangedPassword: false };
    }
  }
};

export default passwordService;
