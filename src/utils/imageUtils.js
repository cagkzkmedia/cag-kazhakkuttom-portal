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
