import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ProfileForm from '../components/ProfileForm';
import Alert from '../components/Alert';
import { studentProfileAPI } from '../services/api';
import { formatListForInput } from '../utils/profileValidation';

export default function EditProfile() {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await studentProfileAPI.getProfile();
        const profile = data.data.profile;
        setInitialData({
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone || '',
          collegeName: profile.collegeName,
          degree: profile.degree,
          branch: profile.branch,
          cgpa: profile.cgpa.toString(),
          graduationYear: profile.graduationYear.toString(),
          skills: formatListForInput(profile.skills),
          certifications: formatListForInput(profile.certifications),
          targetRole: profile.targetRole,
          targetCompany: profile.targetCompany || '',
          profilePictureUrl: profile.profilePictureUrl || '',
        });
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

  const handleSubmit = async (payload) => {
    const { data } = await studentProfileAPI.updateProfile(payload);
    navigate('/profile', { state: { message: data.message }, replace: true });
  };

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
      <ProfileForm
        initialData={initialData}
        title="Update Student Profile"
        subtitle="Keep your profile up to date for better opportunities"
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
}
