import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Alert from '../components/Alert';
import { resumeAPI } from '../services/api';
import { validateResumeFile, formatFileSize } from '../utils/resumeValidation';

const FileIcon = ({ extension }) => (
  <div
    className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold uppercase ${
      extension === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
    }`}
  >
    {extension}
  </div>
);

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  const fetchResumes = async () => {
    try {
      const { data } = await resumeAPI.listResumes();
      setResumes(data.data.resumes);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load resumes.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setFileError(file ? validateResumeFile(file) : '');
    setAlert({ type: '', message: '' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const validationError = validateResumeFile(selectedFile);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const { data } = await resumeAPI.uploadResume(formData);
      setResumes((prev) => [data.data.resume, ...prev]);
      setAlert({ type: 'success', message: data.message });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload resume.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    setDeletingId(id);
    try {
      const { data } = await resumeAPI.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      setAlert({ type: 'success', message: data.message });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete resume.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Resumes</h2>
          <p className="mt-1 text-sm text-slate-600">Upload and manage your resume files</p>
        </div>

        {alert.message && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        )}

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Upload Resume</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label
                htmlFor="resume"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-brand-400 hover:bg-brand-50"
              >
                <svg className="mb-3 h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm font-medium text-slate-700">
                  {selectedFile ? selectedFile.name : 'Click to select a file'}
                </p>
                <p className="mt-1 text-xs text-slate-500">PDF or DOCX, max 5MB</p>
                <input
                  ref={fileInputRef}
                  id="resume"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileError && <p className="mt-2 text-xs text-red-600">{fileError}</p>}
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile || !!fileError}
              className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Uploaded Resumes {resumes.length > 0 && `(${resumes.length})`}
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
              <p className="mt-1 text-xs text-slate-400">Upload your first resume above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon extension={resume.fileExtension} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{resume.originalName}</p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(resume.fileSize)} &middot;{' '}
                        {new Date(resume.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === resume.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
