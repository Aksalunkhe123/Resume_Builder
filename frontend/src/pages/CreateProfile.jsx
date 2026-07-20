import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { studentProfileAPI } from '../services/api';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  collegeName: '',
  degree: '',
  branch: '',
  cgpa: '',
  graduationYear: '',
  skills: '',
  certifications: '',
  targetRole: '',
  targetCompany: '',
  profilePictureUrl: '',
};

export default function CreateProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkExisting = async () => {
      try {
        await studentProfileAPI.getProfile();
        navigate('/profile', { replace: true });
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error(err);
        }
        setInitialData({
          ...emptyForm,
          fullName: user?.name || '',
          email: user?.email || '',
        });
      } finally {
        setChecking(false);
      }
    };

    checkExisting();
  }, [user, navigate]);

  const handleSubmit = async (payload) => {
    const { data } = await studentProfileAPI.createProfile(payload);
    navigate('/profile', { state: { message: data.message }, replace: true });
  };

  if (checking) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ProfileForm
        initialData={initialData}
        title="Create Student Profile"
        subtitle="Fill in your academic and career details to get started"
        submitLabel="Create Profile"
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
}
