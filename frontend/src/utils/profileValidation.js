export const validateProfileField = (field, value) => {
  switch (field) {
    case 'fullName':
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Full name must be at least 2 characters';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email';
      return '';
    case 'phone':
      if (value && !/^[+]?[\d\s-]{10,15}$/.test(value)) return 'Please enter a valid phone number';
      return '';
    case 'collegeName':
      if (!value.trim()) return 'College name is required';
      return '';
    case 'degree':
      if (!value.trim()) return 'Degree is required';
      return '';
    case 'branch':
      if (!value.trim()) return 'Branch is required';
      return '';
    case 'cgpa':
      if (value === '' || value === null) return 'CGPA is required';
      const cgpa = parseFloat(value);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) return 'CGPA must be between 0 and 10';
      return '';
    case 'graduationYear':
      if (!value) return 'Graduation year is required';
      const year = parseInt(value, 10);
      if (isNaN(year) || year < 2000 || year > 2100) return 'Please enter a valid graduation year';
      return '';
    case 'skills':
      if (!value.trim()) return 'At least one skill is required';
      return '';
    case 'targetRole':
      if (!value.trim()) return 'Target role is required';
      return '';
    default:
      return '';
  }
};

export const validateProfileForm = (form) => {
  const fields = [
    'fullName', 'email', 'phone', 'collegeName', 'degree', 'branch',
    'cgpa', 'graduationYear', 'skills', 'targetRole',
  ];
  const errors = {};
  fields.forEach((field) => {
    const error = validateProfileField(field, form[field]);
    if (error) errors[field] = error;
  });
  return errors;
};

export const parseListInput = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const formatListForInput = (list) => (Array.isArray(list) ? list.join(', ') : '');
