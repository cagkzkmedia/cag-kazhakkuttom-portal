/**
 * Image Utility Functions
 * Handles image conversion to base64 and placeholder generation
 */

/**
 * Convert image file to base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 encoded string
 */
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject('File is not an image');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      reject('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onloadend = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject('Error reading file');
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get gender-based placeholder icon/avatar
 * @param {string} gender - Gender (male/female)
 * @param {string} name - Person's name for avatar generation
 * @returns {string} Avatar URL or emoji
 */
export const getGenderPlaceholder = (gender, name = 'User') => {
  if (gender?.toLowerCase() === 'male') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=4A90E2&color=fff&bold=true`;
  } else if (gender?.toLowerCase() === 'female') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=E91E63&color=fff&bold=true`;
  } else {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=667eea&color=fff&bold=true`;
  }
};

/**
 * Get profile image URL or fallback to placeholder
 * @param {string} profileImage - Base64 image string
 * @param {string} gender - Gender for placeholder
 * @param {string} name - Name for avatar
 * @returns {string} Image URL
 */
export const getProfileImageUrl = (profileImage, gender, name) => {
  if (profileImage && profileImage.startsWith('data:image')) {
    return profileImage;
  }
  return getGenderPlaceholder(gender, name);
};

/**
 * Validate image file
 * @param {File} file - Image file
 * @returns {object} Validation result
 */
export const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { valid: false, errors };
  }
  
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }
  
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    errors.push('Image size must be less than 2MB');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, GIF, and WebP images are allowed');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Crop image using canvas
 * @param {string} imageSrc - Image source (data URL)
 * @param {object} cropArea - Crop area with x, y, width, height, scale
 * @returns {Promise<string>} Cropped image as base64
 */
export const cropImage = (imageSrc, cropArea) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = imageSrc;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate the original image coordinates
        const scaleFactor = 1 / cropArea.scale;
        const x = cropArea.x * scaleFactor;
        const y = cropArea.y * scaleFactor;
        const width = cropArea.width * scaleFactor;
        const height = cropArea.height * scaleFactor;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw the cropped image
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        
        // Convert to base64
        const base64Image = canvas.toDataURL('image/jpeg', 0.9);
        resolve(base64Image);
      };
      
      img.onerror = () => {
        reject('Failed to load image for cropping');
      };
    } catch (err) {
      reject(err.message || 'Error cropping image');
    }
  });
};

