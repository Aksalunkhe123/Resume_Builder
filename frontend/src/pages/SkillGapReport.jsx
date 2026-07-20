import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Alert from '../components/Alert';
import SkillGapPreview from '../components/SkillGapPreview';
import { skillGapAPI } from '../services/api';

export default function SkillGapReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await skillGapAPI.getSkillGap(id);
        setReport(data.data.skillGap);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skill gap report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Loading report...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <Alert type="error" message={error || 'Report not found.'} />
        <Link to="/skill-gap" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
          &larr; Back to Skill Gap
        </Link>
      </DashboardLayout>
    );
  }

  const previewData = {
    targetRole: report.targetRole,
    matchPercentage: report.matchPercentage,
    totalRequired: report.totalRequired,
    existingSkills: report.existingSkills,
    missingSkills: report.missingSkills,
    recommendedSkills: report.recommendedSkills,
    improvementSuggestions: report.improvementSuggestions,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Link to="/skill-gap" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            &larr; Back to Skill Gap
          </Link>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{report.targetRole}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {report.resumeName} &middot; Saved{' '}
            {new Date(report.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <SkillGapPreview preview={previewData} />
      </div>
    </DashboardLayout>
  );
}
