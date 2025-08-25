import { supabase, tables, buckets, fileHelpers } from "@/lib/supabase";
import { imageUtils } from "@/utils/imageUtils";

export interface ProfilePhotoUploadResult {
  success: boolean;
  photoUrl?: string;
  error?: string;
  isLocalStorage?: boolean;
}

// Convert file to base64 for localStorage fallback
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Compress image; ensure output is < maxSizeBytes (default 1MB)
const compressImage = (
  file: File,
  maxSizeBytes: number = 1024 * 1024,
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const maxDimension = 600; // allow a bit larger, we will adapt quality too
      let { width, height } = img;

      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // Iteratively decrease quality until under size or min quality reached
      let quality = 0.85;
      const minQuality = 0.5;

      const tryExport = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            if (blob.size <= maxSizeBytes || quality <= minQuality) {
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              quality -= 0.1;
              tryExport();
            }
          },
          "image/jpeg",
          quality,
        );
      };

      tryExport();
    };

    img.src = URL.createObjectURL(file);
  });
};

export const profilePhotoService = {
  // Upload profile photo
  uploadProfilePhoto: async (
    userId: string,
    file: File,
    userRole: string = "student",
  ): Promise<{
    success: boolean;
    photoUrl?: string;
    error?: string;
    isLocalStorage?: boolean;
  }> => {
    try {
      console.log("📤 Starting profile photo upload for user:", userId);

      // Validate file
      if (!file || file.size === 0) {
        return {
          success: false,
          error: "Please select a valid file",
        };
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: "File size must be less than 5MB",
        };
      }

      // Compress image to ensure < 1MB
      const processedFile = await compressImage(file, 1024 * 1024);

      if (supabase && buckets.profiles()) {
        try {
          console.log("📤 Attempting Supabase storage upload...");

          const uploadResult = await fileHelpers.uploadProfilePhoto(
            userId,
            processedFile,
          );

          if (uploadResult.data && uploadResult.data.publicUrl) {
            // Save URL to user profile in database
            await profilePhotoService.savePhotoUrlToProfile(
              userId,
              uploadResult.data.publicUrl,
              userRole,
            );

            console.log("✅ Photo uploaded to Supabase storage successfully");
            return {
              success: true,
              photoUrl: uploadResult.data.publicUrl,
              isLocalStorage: false,
            };
          } else if (uploadResult.error) {
            console.warn("⚠️ Supabase storage error:", uploadResult.error);
            
            // Check if it's a bucket not found error
            if (uploadResult.error.message?.includes('bucket') || uploadResult.error.message?.includes('not found')) {
              console.log("🔄 Storage bucket not configured, using localStorage fallback");
              // Store in localStorage as fallback using base64
              const photoUrl = await imageUtils.saveImageToLocalStorage(userId, processedFile);
              
              // Also save to user profile
              await profilePhotoService.savePhotoUrlToProfile(
                userId,
                photoUrl,
                userRole,
              );
              
              return { 
                success: true, 
                photoUrl: photoUrl,
                isLocalStorage: true,
                error: null
              };
            }
            
            // For any other error, return error instead of localStorage fallback
            console.error("❌ Supabase storage error:", uploadResult.error);
            return { 
              success: false, 
              error: "Storage upload failed. Please try again or contact administrator.",
              isLocalStorage: false
            };
          } else {
            throw new Error("Upload failed");
          }
        } catch (supabaseError) {
          console.warn("⚠️ Supabase storage error:", supabaseError);
          
          // For any storage error, try localStorage fallback
          console.log("🔄 Attempting to use localStorage fallback for profile photo");
          const photoUrl = await imageUtils.saveImageToLocalStorage(userId, processedFile);
          
          // Also save to user profile
          await profilePhotoService.savePhotoUrlToProfile(
            userId,
            photoUrl,
            userRole,
          );
          
          return { 
            success: true, 
            photoUrl: photoUrl,
            isLocalStorage: true,
            error: null
          };
        }
      } else {
        console.warn("⚠️ Supabase not configured, using localStorage");
        // Store in localStorage as fallback using base64
        const photoUrl = await imageUtils.saveImageToLocalStorage(userId, processedFile);
        
        // Also save to user profile
        await profilePhotoService.savePhotoUrlToProfile(
          userId,
          photoUrl,
          userRole,
        );
        
        return { 
          success: true, 
          photoUrl: photoUrl,
          isLocalStorage: true,
          error: null
        };
      }
      
    } catch (error) {
      console.error("❌ Profile photo upload error:", error);
      return {
        success: false,
        error: "Upload failed. Please try again.",
      };
    }
  },

  // Save photo URL to user profile
  savePhotoUrlToProfile: async (
    userId: string,
    photoUrl: string,
    userRole: string,
  ): Promise<void> => {
    try {
      // Always update localStorage for quick access (prioritize localStorage)
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        userData.profilePhotoUrl = photoUrl;
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }

      // Update in localUsers if exists
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const userIndex = localUsers.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        localUsers[userIndex].profilePhotoUrl = photoUrl;
        localStorage.setItem("localUsers", JSON.stringify(localUsers));
      }

      // Try to update database as well (but don't fail if it doesn't work)
      if (supabase) {
        try {
          if (userRole === "student") {
            const studentsTable = tables.students();
            if (studentsTable) {
              await studentsTable
                .update({ profile_photo_url: photoUrl })
                .eq("id", userId);
            }
          } else {
            const facultyTable = tables.faculty();
            if (facultyTable) {
              await facultyTable
                .update({ profile_photo_url: photoUrl })
                .eq("id", userId);
            }
          }
        } catch (dbError) {
          console.warn("⚠️ Database update failed (expected):", dbError);
          // Don't throw error, just continue
        }
      }
    } catch (error) {
      console.error("Error saving photo URL to profile:", error);
    }
  },

  // Get profile photo URL
  getProfilePhotoUrl: async (
    userId: string,
    userRole: string = "student",
  ): Promise<string | null> => {
    try {
      // Check localStorage first (prioritize localStorage)
      const localPhoto = imageUtils.getImageFromLocalStorage(userId);
      if (localPhoto) {
        console.log("📱 Profile photo loaded from localStorage");
        return localPhoto;
      }

      // Check current user data
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.id === userId && userData.profilePhotoUrl) {
          console.log("📱 Profile photo loaded from current user data");
          return userData.profilePhotoUrl;
        }
      }

      // Check localUsers array
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const user = localUsers.find((u: any) => u.id === userId);
      if (user && user.profilePhotoUrl) {
        console.log("📱 Profile photo loaded from localUsers");
        return user.profilePhotoUrl;
      }

      console.log("📱 No profile photo found");
      return null;
    } catch (error) {
      console.error("❌ Error getting profile photo URL:", error);
      return null;
    }
  },

  // Delete profile photo
  deleteProfilePhoto: async (
    userId: string,
    userRole: string = "student",
  ): Promise<boolean> => {
    try {
      // Remove from Supabase storage if exists
      if (supabase && buckets.profiles()) {
        try {
          const fileName = `${userId}/profile.jpg`; // Assuming jpg extension
          await buckets.profiles().remove([fileName]);
        } catch (storageError) {
          console.warn("Storage deletion failed:", storageError);
        }
      }

      // Remove from database
      if (supabase) {
        try {
          if (userRole === "student") {
            await supabase
              .from("students")
              .update({ profile_photo_url: null })
              .eq("id", userId);
          } else {
            await supabase
              .from("faculty")
              .update({ profile_photo_url: null })
              .eq("id", userId);
          }
        } catch (dbError) {
          console.warn("Database update failed:", dbError);
        }
      }

      // Remove from localStorage
      const photoKey = `profile_photo_${userId}`;
      localStorage.removeItem(photoKey);

      // Update current user
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.id === userId) {
          delete userData.profilePhotoUrl;
          localStorage.setItem("currentUser", JSON.stringify(userData));
        }
      }

      // Update localUsers
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const userIndex = localUsers.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        delete localUsers[userIndex].profilePhotoUrl;
        localStorage.setItem("localUsers", JSON.stringify(localUsers));
      }

      return true;
    } catch (error) {
      console.error("Error deleting profile photo:", error);
      return false;
    }
  },

  // Initialize storage buckets (for admin setup)
  initializeStorageBuckets: async (): Promise<void> => {
    try {
      if (!supabase) {
        console.warn("Supabase not configured, skipping bucket initialization");
        return;
      }

      // Check if buckets exist, create if they don't
      const bucketsToCreate = [
        "profiles",
        "documents",
        "materials",
        "timetables",
      ];

      for (const bucketName of bucketsToCreate) {
        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const bucketExists = buckets?.some(
            (bucket) => bucket.name === bucketName,
          );

          if (!bucketExists) {
            await supabase.storage.createBucket(bucketName, {
              public: true,
              allowedMimeTypes:
                bucketName === "profiles"
                  ? ["image/jpeg", "image/png", "image/webp"]
                  : undefined,
              fileSizeLimit:
                bucketName === "profiles"
                  ? 5242880 // 5MB
                  : undefined,
            });
            console.log(`✅ Created storage bucket: ${bucketName}`);
          }
        } catch (bucketError) {
          console.warn(
            `Warning: Could not initialize bucket ${bucketName}:`,
            bucketError,
          );
        }
      }
    } catch (error) {
      console.error("Error initializing storage buckets:", error);
    }
  },
};

export default profilePhotoService;
