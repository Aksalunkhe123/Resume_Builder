import { useState } from 'react';
import Alert from './Alert';
import ProfilePictureUpload from './ProfilePictureUpload';
import { validateProfileForm, parseListInput } from '../utils/profileValidation';
import { buildProfileFormData } from '../utils/profilePicture';

const inputClass = (hasError) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-500 ${
    hasError ? 'border-red-400' : 'border-slate-300'
  }`;

const Field = ({ label, name, error, children }) => (
  <div>
    <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default function ProfileForm({ initialData, onSubmit, submitLabel, title, subtitle }) {
  const [form, setForm] = useState(initialData);
  const [profilePicture, setProfilePicture] = useState(null);
  const [removePicture, setRemovePicture] = useState(false);
  const [pictureError, setPictureError] = useState('');
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handlePictureChange = (file, error, removed) => {
    setProfilePicture(file);
    setPictureError(error);
    setRemovePicture(removed);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setAlert({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfileForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (pictureError) return;

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      collegeName: form.collegeName.trim(),
      degree: form.degree.trim(),
      branch: form.branch.trim(),
      cgpa: parseFloat(form.cgpa),
      graduationYear: parseInt(form.graduationYear, 10),
      skills: parseListInput(form.skills),
      certifications: parseListInput(form.certifications),
      targetRole: form.targetRole.trim(),
      targetCompany: form.targetCompany.trim(),
    };

    setSubmitting(true);
    try {
      const formData = buildProfileFormData(payload, profilePicture, removePicture);
      await onSubmit(formData);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {alert.message && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        )}

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <ProfilePictureUpload
            currentUrl={initialData.profilePictureUrl}
            onChange={handlePictureChange}
            error={pictureError}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name *" name="fullName" error={errors.fullName}>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputClass(errors.fullName)}
              placeholder="John Doe"
            />
          </Field>

          <Field label="Email *" name="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Phone" name="phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={inputClass(errors.phone)}
              placeholder="+91 9876543210"
            />
          </Field>

          <Field label="College Name *" name="collegeName" error={errors.collegeName}>
            <input
              id="collegeName"
              name="collegeName"
              value={form.collegeName}
              onChange={handleChange}
              className={inputClass(errors.collegeName)}
              placeholder="ABC University"
            />
          </Field>

          <Field label="Degree *" name="degree" error={errors.degree}>
            <input
              id="degree"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              className={inputClass(errors.degree)}
              placeholder="B.Tech"
            />
          </Field>

          <Field label="Branch *" name="branch" error={errors.branch}>
            <input
              id="branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className={inputClass(errors.branch)}
              placeholder="Computer Science"
            />
          </Field>

          <Field label="CGPA *" name="cgpa" error={errors.cgpa}>
            <input
              id="cgpa"
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.cgpa}
              onChange={handleChange}
              className={inputClass(errors.cgpa)}
              placeholder="8.5"
            />
          </Field>

          <Field label="Graduation Year *" name="graduationYear" error={errors.graduationYear}>
            <input
              id="graduationYear"
              name="graduationYear"
              type="number"
              min="2000"
              max="2100"
              value={form.graduationYear}
              onChange={handleChange}
              className={inputClass(errors.graduationYear)}
              placeholder="2026"
            />
          </Field>

          <Field label="Target Role *" name="targetRole" error={errors.targetRole}>
            <input
              id="targetRole"
              name="targetRole"
              value={form.targetRole}
              onChange={handleChange}
              className={inputClass(errors.targetRole)}
              placeholder="Software Engineer"
            />
          </Field>

          <Field label="Target Company" name="targetCompany" error={errors.targetCompany}>
            <input
              id="targetCompany"
              name="targetCompany"
              value={form.targetCompany}
              onChange={handleChange}
              className={inputClass(errors.targetCompany)}
              placeholder="Google"
            />
          </Field>
        </div>

        <Field label="Skills *" name="skills" error={errors.skills}>
          <input
            id="skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className={inputClass(errors.skills)}
            placeholder="JavaScript, React, Node.js"
          />
          <p className="mt-1 text-xs text-slate-500">Separate skills with commas</p>
        </Field>

        <Field label="Certifications" name="certifications" error={errors.certifications}>
          <input
            id="certifications"
            name="certifications"
            value={form.certifications}
            onChange={handleChange}
            className={inputClass(errors.certifications)}
            placeholder="AWS Certified, Google Cloud"
          />
          <p className="mt-1 text-xs text-slate-500">Separate certifications with commas</p>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </form>
    </div>
  );
}
