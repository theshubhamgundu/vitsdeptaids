// Utility functions for handling images in localStorage
export const imageUtils = {
  // Convert file to base64 for localStorage storage
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  // Convert base64 to blob URL
  base64ToBlobUrl: (base64: string): string => {
    return base64; // base64 can be used directly as src
  },

  // Compress image and convert to base64
  compressAndConvertToBase64: async (file: File, maxSizeBytes: number = 1024 * 1024): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 300x300 for profile photos)
        const maxDimension = 300;
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

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with quality 0.8
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  // Save image to localStorage with base64
  saveImageToLocalStorage: async (userId: string, file: File): Promise<string> => {
    try {
      const base64 = await imageUtils.compressAndConvertToBase64(file);
      const photoKey = `profile_photo_${userId}`;
      localStorage.setItem(photoKey, base64);
      return base64;
    } catch (error) {
      console.error('Error saving image to localStorage:', error);
      throw error;
    }
  },

  // Get image from localStorage
  getImageFromLocalStorage: (userId: string): string | null => {
    const photoKey = `profile_photo_${userId}`;
    return localStorage.getItem(photoKey);
  },

  // Check if image exists in localStorage
  hasImageInLocalStorage: (userId: string): boolean => {
    const photoKey = `profile_photo_${userId}`;
    return localStorage.getItem(photoKey) !== null;
  }
};
