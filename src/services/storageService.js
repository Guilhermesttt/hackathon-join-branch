import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage';
import { storage } from './firebase';

export class StorageService {
  // Upload profile photo
  async uploadProfilePhoto(file, userId, onProgress = null) {
    try {
      this.validateFile(file, 5); // 5MB limit for profile photos
      
      const fileName = `profile_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `users/${userId}/profile/${fileName}`);
      
      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(new Error(`Upload failed: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                  success: true,
                  downloadURL,
                  fileName,
                  path: `users/${userId}/profile/${fileName}`
                });
              } catch (error) {
                reject(new Error(`Failed to get download URL: ${error.message}`));
              }
            }
          );
        });
      } else {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          success: true,
          downloadURL,
          fileName,
          path: `users/${userId}/profile/${fileName}`
        };
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }

  // Upload banner photo
  async uploadBannerPhoto(file, userId, onProgress = null) {
    try {
      this.validateFile(file, 10); // 10MB limit for banners
      
      const fileName = `banner_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `users/${userId}/banner/${fileName}`);
      
      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(new Error(`Upload failed: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                  success: true,
                  downloadURL,
                  fileName,
                  path: `users/${userId}/banner/${fileName}`
                });
              } catch (error) {
                reject(new Error(`Failed to get download URL: ${error.message}`));
              }
            }
          );
        });
      } else {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          success: true,
          downloadURL,
          fileName,
          path: `users/${userId}/banner/${fileName}`
        };
      }
    } catch (error) {
      console.error('Error uploading banner photo:', error);
      throw error;
    }
  }

  // Upload post image
  async uploadPostImage(file, userId, postId, onProgress = null) {
    try {
      this.validateFile(file, 15); // 15MB limit for post images
      
      const fileName = `post_${postId}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `posts/${postId}/images/${fileName}`);
      
      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(new Error(`Upload failed: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                  success: true,
                  downloadURL,
                  fileName,
                  path: `posts/${postId}/images/${fileName}`
                });
              } catch (error) {
                reject(new Error(`Failed to get download URL: ${error.message}`));
              }
            }
          );
        });
      } else {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          success: true,
          downloadURL,
          fileName,
          path: `posts/${postId}/images/${fileName}`
        };
      }
    } catch (error) {
      console.error('Error uploading post image:', error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Get file metadata
  async getFileMetadata(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      const metadata = await getMetadata(fileRef);
      return metadata;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  // Validate file
  validateFile(file, maxSizeMB = 5) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`);
    }

    return true;
  }

  // Generate unique filename
  generateFileName(originalName, prefix = '') {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    
    return `${prefix}${timestamp}_${randomString}.${extension}`;
  }

  // Compress image before upload (basic implementation)
  async compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

export const storageService = new StorageService();