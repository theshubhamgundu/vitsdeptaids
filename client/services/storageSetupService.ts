import { supabase } from "@/lib/supabase";

export const storageSetupService = {
  // Initialize all required storage buckets
  initializeStorageBuckets: async (): Promise<{ success: boolean; message: string }> => {
    try {
      if (!supabase) {
        return { success: false, message: "Supabase not configured" };
      }

      const bucketsToCreate = [
        {
          name: "profiles",
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"]
        },
        {
          name: "documents", 
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ["application/pdf", "image/*", "text/*"]
        },
        {
          name: "materials",
          public: true, 
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ["application/pdf", "image/*", "text/*"]
        }
      ];

      const results = [];

      for (const bucketConfig of bucketsToCreate) {
        try {
          // Check if bucket already exists
          const { data: existingBuckets } = await supabase.storage.listBuckets();
          const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketConfig.name);

          if (!bucketExists) {
            const { data, error } = await supabase.storage.createBucket(bucketConfig.name, {
              public: bucketConfig.public,
              allowedMimeTypes: bucketConfig.allowedMimeTypes,
              fileSizeLimit: bucketConfig.fileSizeLimit
            });

            if (error) {
              results.push(`❌ Failed to create ${bucketConfig.name}: ${error.message}`);
            } else {
              results.push(`✅ Created bucket: ${bucketConfig.name}`);
            }
          } else {
            results.push(`ℹ️ Bucket ${bucketConfig.name} already exists`);
          }
        } catch (bucketError) {
          results.push(`❌ Error with ${bucketConfig.name}: ${bucketError}`);
        }
      }

      return {
        success: true,
        message: results.join('\n')
      };

    } catch (error) {
      console.error("Error initializing storage buckets:", error);
      return {
        success: false,
        message: `Failed to initialize storage: ${error}`
      };
    }
  },

  // Check if all required buckets exist
  checkStorageBuckets: async (): Promise<{ exists: boolean; buckets: any[] }> => {
    try {
      if (!supabase) {
        return { exists: false, buckets: [] };
      }

      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking storage buckets:", error);
        return { exists: false, buckets: [] };
      }

      const requiredBuckets = ['profiles', 'documents', 'materials'];
      const existingBuckets = buckets?.filter(bucket => requiredBuckets.includes(bucket.name)) || [];

      return {
        exists: existingBuckets.length === requiredBuckets.length,
        buckets: existingBuckets
      };

    } catch (error) {
      console.error("Error checking storage buckets:", error);
      return { exists: false, buckets: [] };
    }
  },

  // Test upload to verify bucket permissions
  testUpload: async (): Promise<{ success: boolean; message: string }> => {
    try {
      if (!supabase) {
        return { success: false, message: "Supabase not configured" };
      }

      // Create a simple test file
      const testContent = "Test file for storage verification";
      const testFile = new File([testContent], "test.txt", { type: "text/plain" });

      // Try to upload to profiles bucket
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload('test/test.txt', testFile);

      if (error) {
        return { success: false, message: `Upload test failed: ${error.message}` };
      }

      // Clean up test file
      await supabase.storage
        .from('profiles')
        .remove(['test/test.txt']);

      return { success: true, message: "Storage test successful" };

    } catch (error) {
      console.error("Error testing storage upload:", error);
      return { success: false, message: `Test failed: ${error}` };
    }
  }
};

export default storageSetupService;
