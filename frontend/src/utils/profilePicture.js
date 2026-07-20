const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const validateProfilePicture = (file) => {
  if (!file) return '';

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, WEBP, and GIF images are allowed.';
  }

  if (file.size > MAX_SIZE) {
    return 'Profile picture must not exceed 2MB.';
  }

  return '';
};

export const buildProfileFormData = (payload, profilePicture, removeProfilePicture = false) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value ?? '');
    }
  });

  if (profilePicture) {
    formData.append('profilePicture', profilePicture);
  }

  if (removeProfilePicture) {
    formData.append('removeProfilePicture', 'true');
  }

  return formData;
};
