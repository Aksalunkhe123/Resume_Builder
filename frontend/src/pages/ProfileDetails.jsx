import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Alert from '../components/Alert';
import { studentProfileAPI } from '../services/api';
import { getImageUrl } from '../utils/profilePicture';

const DetailItem = ({ label, value }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">{value || '—'}</p>
  </div>
);

const TagList = ({ items, emptyText = 'None added' }) => {
  if (!items?.length) {
    return <p className="text-sm text-slate-500">{emptyText}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 sm:text-sm"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default function ProfileDetails() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await studentProfileAPI.getProfile();
        setProfile(data.data.profile);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/profile/create', { replace: true });
          return;
        }
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert type="error" message={error} onClose={() => setError('')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-2xl font-bold text-white shadow-lg ring-4 ring-white">
              {profile.profilePictureUrl ? (
                <img
                  src={getImageUrl(profile.profilePictureUrl)}
                  alt={profile.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.fullName?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile.fullName}</h2>
              <p className="mt-0.5 text-sm text-slate-600">{profile.targetRole}</p>
              <p className="text-xs text-slate-400">{profile.email}</p>
            </div>
          </div>
          <Link
            to="/profile/edit"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Edit Profile
          </Link>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Full Name" value={profile.fullName} />
            <DetailItem label="Email" value={profile.email} />
            <DetailItem label="Phone" value={profile.phone} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Academic Details</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="College" value={profile.collegeName} />
            <DetailItem label="Degree" value={profile.degree} />
            <DetailItem label="Branch" value={profile.branch} />
            <DetailItem label="CGPA" value={profile.cgpa} />
            <DetailItem label="Graduation Year" value={profile.graduationYear} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Career Goals</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Target Role" value={profile.targetRole} />
            <DetailItem label="Target Company" value={profile.targetCompany} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Skills</h3>
          <TagList items={profile.skills} emptyText="No skills added yet" />
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Certifications</h3>
          <TagList items={profile.certifications} emptyText="No certifications added" />
        </section>

        <p className="text-xs text-slate-400">
          Last updated:{' '}
          {profile.updatedAt
            ? new Date(profile.updatedAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : '—'}
        </p>
      </div>
    </DashboardLayout>
  );
}
