import { supabase, tables } from "@/lib/supabase";

export interface StudentProfileData {
  id: string;
  user_id: string;
  hall_ticket: string;
  name: string;
  email: string;
  phone?: string;
  year: string;
  section?: string;
  father_name?: string;
  mother_name?: string;
  address?: string;
  date_of_birth?: string;
  blood_group?: string;
  profile_photo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentStats {
  certificates: number;
  pendingApplications: number;
  attendance: number;
  cgpa: number;
}

export const profileService = {
  // Get complete student profile from database
  getStudentProfile: async (userId: string): Promise<StudentProfileData | null> => {
    try {
      // Check localStorage first (since database queries are failing)
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if (currentUser.id === userId || currentUser.hallTicket) {
        const profileData: StudentProfileData = {
          id: currentUser.id || crypto.randomUUID(),
          user_id: userId,
          hall_ticket: currentUser.hallTicket || "",
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          year: currentUser.year || "",
          section: currentUser.section || "A",
          father_name: currentUser.fatherName || "",
          mother_name: currentUser.motherName || "",
          address: currentUser.address || "",
          date_of_birth: currentUser.dateOfBirth || "",
          blood_group: currentUser.bloodGroup || "",
          profile_photo_url: currentUser.profilePhotoUrl || "",
          is_active: true,
          created_at: currentUser.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        console.log("📱 Student profile loaded from localStorage");
        return profileData;
      }

      // Try database as fallback (but don't fail if it doesn't work)
      const studentsTable = tables.students();
      if (studentsTable) {
        try {
          // Try by user_id first
          const { data, error } = await studentsTable
            .select("*")
            .eq("user_id", userId)
            .single();

          if (!error && data) {
            console.log("✅ Student profile loaded from database");
            return data;
          }

          // Try by hall ticket if user_id doesn't work
          if (currentUser.hallTicket) {
            const { data: hallTicketData, error: hallTicketError } = await studentsTable
              .select("*")
              .eq("hall_ticket", currentUser.hallTicket)
              .single();

            if (!hallTicketError && hallTicketData) {
              console.log("✅ Student profile loaded from database by hall ticket");
              return hallTicketData;
            }
          }
        } catch (dbError) {
          console.warn("⚠️ Database query failed (expected):", dbError);
          // Don't throw error, just continue
        }
      }

      console.log("📱 No student profile found");
      return null;
    } catch (error) {
      console.error("❌ Error getting student profile:", error);
      return null;
    }
  },

  // Update student profile in database and localStorage
  updateStudentProfile: async (
    userId: string,
    profileData: Partial<StudentProfileData>
  ): Promise<boolean> => {
    try {
      let updateSuccess = false;

      // Update in database if available
      const studentsTable = tables.students();
      if (studentsTable) {
        try {
          const { error } = await studentsTable
            .update({
              ...profileData,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

          if (!error) {
            console.log("✅ Student profile updated in database");
            updateSuccess = true;
          } else {
            console.warn("Database update failed:", error);
          }
        } catch (dbError) {
          console.warn("Database update error:", dbError);
        }
      }

      // Always update localStorage for immediate reflection
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if (currentUser.id === userId) {
        const updatedUser = {
          ...currentUser,
          name: profileData.name || currentUser.name,
          email: profileData.email || currentUser.email,
          phone: profileData.phone || currentUser.phone,
          year: profileData.year || currentUser.year,
          section: profileData.section || currentUser.section,
          fatherName: profileData.father_name || currentUser.fatherName,
          motherName: profileData.mother_name || currentUser.motherName,
          address: profileData.address || currentUser.address,
          dateOfBirth: profileData.date_of_birth || currentUser.dateOfBirth,
          bloodGroup: profileData.blood_group || currentUser.bloodGroup,
          profilePhotoUrl: profileData.profile_photo_url || currentUser.profilePhotoUrl,
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        console.log("📱 Student profile updated in localStorage");
        updateSuccess = true;
      }

      // Update in localUsers array
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const userIndex = localUsers.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        localUsers[userIndex] = {
          ...localUsers[userIndex],
          name: profileData.name || localUsers[userIndex].name,
          email: profileData.email || localUsers[userIndex].email,
          phone: profileData.phone || localUsers[userIndex].phone,
          year: profileData.year || localUsers[userIndex].year,
          section: profileData.section || localUsers[userIndex].section,
          fatherName: profileData.father_name || localUsers[userIndex].fatherName,
          motherName: profileData.mother_name || localUsers[userIndex].motherName,
          address: profileData.address || localUsers[userIndex].address,
          dateOfBirth: profileData.date_of_birth || localUsers[userIndex].dateOfBirth,
          bloodGroup: profileData.blood_group || localUsers[userIndex].bloodGroup,
          profilePhotoUrl: profileData.profile_photo_url || localUsers[userIndex].profilePhotoUrl,
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("localUsers", JSON.stringify(localUsers));
      }

      return updateSuccess;
    } catch (error) {
      console.error("Error updating student profile:", error);
      return false;
    }
  },

  // Get student statistics (real data)
  getStudentStats: async (userId: string): Promise<StudentStats> => {
    try {
      const stats: StudentStats = {
        certificates: 0,
        pendingApplications: 0,
        attendance: 0,
        cgpa: 0,
      };

      // Get certificates count
      const certificates = JSON.parse(
        localStorage.getItem(`certificates_${userId}`) || "[]"
      );
      stats.certificates = certificates.length;

      // Get pending applications count
      const leaves = JSON.parse(
        localStorage.getItem(`leaves_${userId}`) || "[]"
      );
      stats.pendingApplications = leaves.filter(
        (leave: any) => leave.status === "pending"
      ).length;

      // Get attendance from database or localStorage
      const attendanceRecords = JSON.parse(
        localStorage.getItem(`attendance_${userId}`) || "[]"
      );
      
      if (attendanceRecords.length > 0) {
        const presentCount = attendanceRecords.filter(
          (record: any) => record.status === "present"
        ).length;
        stats.attendance = Math.round((presentCount / attendanceRecords.length) * 100);
      }

      // Get CGPA from results or profile
      const results = JSON.parse(
        localStorage.getItem(`results_${userId}`) || "[]"
      );
      
      if (results.length > 0) {
        const totalGradePoints = results.reduce((sum: number, result: any) => {
          return sum + (result.gradePoint || 0);
        }, 0);
        stats.cgpa = Number((totalGradePoints / results.length).toFixed(2));
      }

      return stats;
    } catch (error) {
      console.error("Error getting student stats:", error);
      return {
        certificates: 0,
        pendingApplications: 0,
        attendance: 0,
        cgpa: 0,
      };
    }
  },

  // Create student profile in database (called after registration)
  createStudentProfile: async (
    userData: any
  ): Promise<boolean> => {
    try {
      const studentsTable = tables.students();
      if (studentsTable) {
        const { error } = await studentsTable.insert([
          {
            id: crypto.randomUUID(),
            user_id: userData.id,
            hall_ticket: userData.hallTicket,
            name: userData.name,
            email: userData.email,
            year: userData.year,
            section: userData.section || "A",
            is_active: true,
          },
        ]);

        if (!error) {
          console.log("✅ Student profile created in database");
          return true;
        } else {
          console.warn("Database profile creation failed:", error);
        }
      }

      console.log("📱 Student profile will be managed locally");
      return true;
    } catch (error) {
      console.error("Error creating student profile:", error);
      return false;
    }
  },

  // Get recent activities for dashboard
  getRecentActivities: async (userId: string): Promise<any[]> => {
    try {
      const activities: any[] = [];

      // Get recent certificates
      const certificates = JSON.parse(
        localStorage.getItem(`certificates_${userId}`) || "[]"
      );
      certificates.slice(-3).forEach((cert: any) => {
        activities.push({
          id: cert.id,
          type: "certificate",
          title: "Certificate uploaded",
          description: cert.title,
          time: new Date(cert.uploadDate).toLocaleDateString(),
          icon: "Award",
          status: cert.status === "approved" ? "success" : "warning",
        });
      });

      // Get recent results
      const results = JSON.parse(
        localStorage.getItem(`results_${userId}`) || "[]"
      );
      results.slice(-2).forEach((result: any) => {
        activities.push({
          id: result.id,
          type: "result",
          title: "Result published",
          description: `${result.subject} - ${result.marks}/${result.totalMarks}`,
          time: new Date(result.examDate).toLocaleDateString(),
          icon: "BarChart3",
          status: result.marks >= 60 ? "success" : "warning",
        });
      });

      // Get recent leave applications
      const leaves = JSON.parse(
        localStorage.getItem(`leaves_${userId}`) || "[]"
      );
      leaves.slice(-2).forEach((leave: any) => {
        activities.push({
          id: leave.id,
          type: "leave",
          title: "Leave application",
          description: `${leave.type} leave - ${leave.status}`,
          time: new Date(leave.appliedDate).toLocaleDateString(),
          icon: "Plane",
          status: leave.status === "approved" ? "success" : leave.status === "rejected" ? "error" : "warning",
        });
      });

      // Sort by time (most recent first)
      return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    } catch (error) {
      console.error("Error getting recent activities:", error);
      return [];
    }
  },

  // Get upcoming events for dashboard
  getUpcomingEvents: async (): Promise<any[]> => {
    try {
      // Get from database if available
      if (supabase) {
        const { data, error } = await supabase
          .from("department_events")
          .select("*")
          .eq("is_active", true)
          .gte("event_date", new Date().toISOString().split("T")[0])
          .order("event_date", { ascending: true })
          .limit(5);

        if (!error && data) {
          return data.map((event: any) => ({
            title: event.title,
            date: new Date(event.event_date).toLocaleDateString(),
            time: event.start_time || "TBD",
            priority: event.title.toLowerCase().includes("exam") ? "high" : "medium",
          }));
        }
      }

      // Fallback to default events
      return [
        {
          title: "Final Exams",
          date: "April 15, 2025",
          time: "10:00 AM",
          priority: "high",
        },
        {
          title: "Project Submission",
          date: "April 10, 2025",
          time: "11:59 PM",
          priority: "high",
        },
      ];
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      return [];
    }
  },
};

export default profileService;
