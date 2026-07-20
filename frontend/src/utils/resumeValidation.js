const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];

export const validateResumeFile = (file) => {
  if (!file) return 'Please select a file to upload.';

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only PDF and DOCX files are allowed.';
  }

  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return 'Only PDF and DOCX files are allowed.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size must not exceed 5MB.';
  }

  return '';
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
