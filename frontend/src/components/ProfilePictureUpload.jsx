import { useRef, useState } from 'react';
import { getImageUrl, validateProfilePicture } from '../utils/profilePicture';

export default function ProfilePictureUpload({ currentUrl, onChange, error }) {
  const [preview, setPreview] = useState(currentUrl || '');
  const [removed, setRemoved] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateProfilePicture(file);
    if (validationError) {
      onChange(null, validationError, false);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setRemoved(false);
    onChange(file, '', false);
  };

  const handleRemove = () => {
    setPreview('');
    setRemoved(true);
    onChange(null, '', true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayUrl = !removed && preview
    ? (preview.startsWith('blob:') ? preview : getImageUrl(preview))
    : '';

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="relative">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 shadow-sm">
          {displayUrl ? (
            <img src={displayUrl} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="text-sm font-semibold text-slate-900">Profile Picture</p>
        <p className="mt-0.5 text-xs text-slate-500">JPG, PNG, WEBP or GIF. Max 2MB.</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
          >
            {displayUrl ? 'Change Photo' : 'Upload Photo'}
          </button>
          {displayUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Remove
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
