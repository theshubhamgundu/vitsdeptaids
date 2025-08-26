import { supabase, authHelpers, tables } from "@/lib/supabase";
import {
  getAllFaculty as getFallbackFaculty,
  authenticateFaculty as fallbackAuthFaculty,
  getFacultyByRole as getFallbackFacultyByRole,
  getFacultyById as getFallbackFacultyById,
} from "@/data/facultyData";

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  facultyId: string;
  role: "HOD" | "Faculty" | "Admin";
  defaultPassword: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  experience: number;
  qualification: string;
  canChangePassword: boolean;
}

export interface Student {
  id: string;
  name: string;
  hallTicket: string;
  email: string;
  year: string;
  section: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  facultyId?: string;
  hallTicket?: string;
  email: string;
  designation?: string;
  year?: string;
  section?: string;
}

// Faculty Authentication
export const authenticateFaculty = async (
  facultyId: string,
  password: string,
): Promise<FacultyMember | null> => {
  try {
    // Check if Supabase is properly configured
    const facultyTable = tables.faculty();
    if (!facultyTable) {
      console.log("Supabase not configured, falling back to local data");
      return fallbackAuthFaculty(facultyId, password);
    }

    const { data: faculty, error } = await facultyTable
      .select("*")
      .eq("faculty_id", facultyId)
      .eq("password_hash", password)
      .single();

    if (error || !faculty) {
      console.log(
        "Supabase authentication failed, trying fallback:",
        error?.message,
      );
      return fallbackAuthFaculty(facultyId, password);
    }

    return {
      id: faculty.id,
      name: faculty.name,
      designation: faculty.designation,
      facultyId: faculty.faculty_id,
      role:
        faculty.role === "hod"
          ? "HOD"
          : faculty.role === "admin"
            ? "Admin"
            : "Faculty",
      defaultPassword: faculty.password_hash,
      email: faculty.email,
      phone: faculty.phone || "",
      department: faculty.department,
      specialization: faculty.specialization || "",
      experience: faculty.experience || 0,
      qualification: faculty.qualification || "",
      canChangePassword: faculty.can_change_password,
    };
  } catch (error) {
    console.log("Error with Supabase authentication, using fallback:", error);
    return fallbackAuthFaculty(facultyId, password);
  }
};

// Student Authentication
export const authenticateStudent = async (
  hallTicket: string,
  password: string,
): Promise<Student | null> => {
  try {
    console.log(`🔍 Authenticating student: ${hallTicket}`);

    // 1) Prefer Supabase for multi-device login
    const studentsTable = tables.students();
    if (studentsTable) {
      try {
        // Try provided password first
        let { data: student, error } = await studentsTable
          .select("*")
          .eq("hall_ticket", hallTicket)
          .eq("password", password)
          .single();

        // If not found, allow default password = hall ticket
        if ((error || !student) && password !== hallTicket) {
          console.log("Trying with hall ticket as password...");
          const result = await studentsTable
            .select("*")
            .eq("hall_ticket", hallTicket)
            .eq("password", hallTicket)
            .single();
          student = result.data;
          error = result.error;
        }

        if (!error && student) {
          console.log("✅ Student authenticated from database");
          return {
            id: student.id,
            name: student.name,
            hallTicket: student.hall_ticket,
            email: student.email,
            year: student.year,
            section: student.section || "A",
          };
        }
      } catch (dbError) {
        console.warn("Database authentication failed:", dbError);
      }
    }

    // 2) Fallback to localStorage (legacy single-device accounts)
    const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
    const localStudent = localUsers.find(
      (user: any) =>
        user.hallTicket === hallTicket &&
        (user.password === password || hallTicket === password) &&
        user.role === "student",
    );

    if (localStudent) {
      console.log("✅ Student authenticated from local storage");
      // Try to upsert this legacy account into DB so other devices can login
      try {
        const userProfiles = tables.userProfiles?.();
        const students = tables.students?.();
        if (userProfiles && students) {
          // Ensure user_profile exists
          const profileId = localStudent.id;
          await userProfiles.upsert([
            {
              id: profileId,
              email: localStudent.email,
              role: "student",
              hall_ticket: localStudent.hallTicket,
              name: localStudent.name,
              year: localStudent.year,
              is_active: true,
              profile_completed: !!localStudent.profileCompleted,
            },
          ] as any);

          // Ensure student row exists with default password policy
          await students.upsert([
            {
              user_id: profileId,
              hall_ticket: localStudent.hallTicket,
              name: localStudent.name,
              email: localStudent.email,
              year: localStudent.year,
              section: localStudent.section || "A",
              is_active: true,
              password: localStudent.password || localStudent.hallTicket,
            },
          ] as any, { onConflict: "hall_ticket" } as any);
          console.log("☁️ Migrated legacy local student to database for multi-device login");
        }
      } catch (migrateErr) {
        console.warn("Legacy student migration to DB failed (will continue using local):", migrateErr);
      }
      return {
        id: localStudent.id,
        name: localStudent.name,
        hallTicket: localStudent.hallTicket,
        email: localStudent.email,
        year: localStudent.year,
        section: localStudent.section || "A",
      };
    }

    console.log("❌ Student authentication failed");
    return null;
  } catch (error) {
    console.error("Error authenticating student:", error);
    return null;
  }
};

// Get all faculty members
export const getAllFaculty = async (): Promise<FacultyMember[]> => {
  try {
    // Check if Supabase is properly configured
    const facultyTable = tables.faculty();
    if (!facultyTable) {
      console.log("Supabase not configured, using local faculty data");
      return getFallbackFaculty();
    }

    const { data: facultyList, error } = await facultyTable
      .select("*")
      .order("name");

    if (error) {
      console.log(
        "Error fetching faculty from Supabase, using fallback:",
        error,
      );
      return getFallbackFaculty();
    }

    return facultyList
      .filter((f) => (f.name || '').toLowerCase() !== 'k. somesh' && (f.name || '').toLowerCase() !== 'k somesh')
      .map((faculty) => ({
      id: faculty.id,
      name: faculty.name,
      designation: faculty.designation,
      facultyId: faculty.faculty_id,
      role:
        faculty.role === "hod"
          ? "HOD"
          : faculty.role === "admin"
            ? "Admin"
            : "Faculty",
      defaultPassword: faculty.password_hash,
      email: faculty.email,
      phone: faculty.phone || "",
      department: faculty.department,
      specialization: faculty.specialization || "",
      experience: faculty.experience || 0,
      qualification: faculty.qualification || "",
      canChangePassword: faculty.can_change_password,
    }));
  } catch (error) {
    console.log("Error with Supabase, using local faculty data:", error);
    return getFallbackFaculty();
  }
};

// Get faculty by role
export const getFacultyByRole = async (
  role: "HOD" | "Faculty" | "Admin",
): Promise<FacultyMember[]> => {
  try {
    const facultyTable = tables.faculty();
    if (!facultyTable) {
      console.log("Supabase not configured, using local faculty data");
      return getFallbackFacultyByRole(role);
    }

    const roleValue = role === "HOD" ? "hod" : role.toLowerCase();

    const { data: facultyList, error } = await facultyTable
      .select("*")
      .eq("role", roleValue)
      .order("name");

    if (error) {
      console.log(
        "Error fetching faculty by role from Supabase, using fallback:",
        error,
      );
      return getFallbackFacultyByRole(role);
    }

    return facultyList.map((faculty) => ({
      id: faculty.id,
      name: faculty.name,
      designation: faculty.designation,
      facultyId: faculty.faculty_id,
      role:
        faculty.role === "hod"
          ? "HOD"
          : faculty.role === "admin"
            ? "Admin"
            : "Faculty",
      defaultPassword: faculty.password_hash,
      email: faculty.email,
      phone: faculty.phone || "",
      department: faculty.department,
      specialization: faculty.specialization || "",
      experience: faculty.experience || 0,
      qualification: faculty.qualification || "",
      canChangePassword: faculty.can_change_password,
    }));
  } catch (error) {
    console.log("Error with Supabase, using local faculty data:", error);
    return getFallbackFacultyByRole(role);
  }
};

// Get faculty by ID
export const getFacultyById = async (
  facultyId: string,
): Promise<FacultyMember | null> => {
  try {
    const facultyTable = tables.faculty();
    if (!facultyTable) {
      console.log("Supabase not configured, using local faculty data");
      return getFallbackFacultyById(facultyId);
    }

    const { data: faculty, error } = await facultyTable
      .select("*")
      .eq("faculty_id", facultyId)
      .single();

    if (error || !faculty) {
      console.log(
        "Error fetching faculty by ID from Supabase, using fallback:",
        error,
      );
      return getFallbackFacultyById(facultyId);
    }

    return {
      id: faculty.id,
      name: faculty.name,
      designation: faculty.designation,
      facultyId: faculty.faculty_id,
      role:
        faculty.role === "hod"
          ? "HOD"
          : faculty.role === "admin"
            ? "Admin"
            : "Faculty",
      defaultPassword: faculty.password_hash,
      email: faculty.email,
      phone: faculty.phone || "",
      department: faculty.department,
      specialization: faculty.specialization || "",
      experience: faculty.experience || 0,
      qualification: faculty.qualification || "",
      canChangePassword: faculty.can_change_password,
    };
  } catch (error) {
    console.log("Error with Supabase, using local faculty data:", error);
    return getFallbackFacultyById(facultyId);
  }
};

// Update faculty password
export const updateFacultyPassword = async (
  facultyId: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const { error } = await tables
      .faculty()
      .update({ password_hash: newPassword })
      .eq("faculty_id", facultyId);

    if (error) {
      console.error("Error updating password:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating faculty password:", error);
    return false;
  }
};

// Message functions
export const sendMessage = async (
  senderId: string,
  messageData: {
    title: string;
    content: string;
    recipients: string[];
    priority: string;
    category: string;
    scheduledDate?: string;
  },
) => {
  try {
    const { data, error } = await tables
      .messages()
      .insert([
        {
          sender_id: senderId,
          title: messageData.title,
          content: messageData.content,
          recipients: messageData.recipients,
          recipient_count: messageData.recipients.length,
          priority: messageData.priority,
          category: messageData.category,
          scheduled_date: messageData.scheduledDate
            ? new Date(messageData.scheduledDate).toISOString()
            : null,
          status: messageData.scheduledDate ? "scheduled" : "sent",
        },
      ])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error("Error sending message:", error);
    return { data: null, error };
  }
};

// Get messages for HOD dashboard
export const getMessages = async (senderId?: string) => {
  try {
    let query = tables
      .messages()
      .select("*")
      .order("sent_date", { ascending: false });

    if (senderId) {
      query = query.eq("sender_id", senderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// Get time slots
export const getTimeSlots = async () => {
  try {
    const { data, error } = await tables
      .time_slots()
      .select("*")
      .eq("is_active", true)
      .order("order_index");

    if (error) {
      console.error("Error fetching time slots:", error);
      return [];
    }

    return data.map(
      (slot) => `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
    );
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return [];
  }
};

// Add new time slot
export const addTimeSlot = async (startTime: string, endTime: string) => {
  try {
    // Get the highest order index
    const { data: maxOrder } = await tables
      .time_slots()
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    const newOrderIndex = (maxOrder?.order_index || 0) + 1;

    const { data, error } = await tables
      .time_slots()
      .insert([
        {
          slot_name: `${startTime} - ${endTime}`,
          start_time: startTime,
          end_time: endTime,
          order_index: newOrderIndex,
          is_active: true,
        },
      ])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error("Error adding time slot:", error);
    return { data: null, error };
  }
};

// Get courses
export const getCourses = async () => {
  try {
    const { data, error } = await tables
      .courses()
      .select("*")
      .order("course_name");

    if (error) {
      console.error("Error fetching courses:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

// Get department events
export const getDepartmentEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("department_events")
      .select(
        `
        *,
        organizer:organizer_id(name, designation)
      `,
      )
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching department events:", error);
    return [];
  }
};

export default {
  authenticateFaculty,
  authenticateStudent,
  getAllFaculty,
  getFacultyByRole,
  getFacultyById,
  updateFacultyPassword,
  sendMessage,
  getMessages,
  getTimeSlots,
  addTimeSlot,
  getCourses,
  getDepartmentEvents,
};
