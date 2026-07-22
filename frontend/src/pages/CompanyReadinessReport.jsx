import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { companyService } from '../services/companyService';
import SkillMatchChart from '../components/SkillMatchChart'; // We can reuse this or build a simple progress circle

export default function CompanyReadinessReport() {
  const { id } = useParams(); // companyName
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await companyService.getCompanyReadiness(id);
      
      if (!response.data.report) {
        // Automatically generate if it doesn't exist
        handleAnalyze();
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError('Failed to load readiness report.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const response = await companyService.generateCompanyReadiness(id);
      // Fetch full data again to get company details + report
      const fullData = await companyService.getCompanyReadiness(id);
      setData(fullData.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate readiness analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || analyzing) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-slate-500">{analyzing ? 'Analyzing profile and resume...' : 'Loading report...'}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 border border-red-100">
          <p>{error || 'Report not found'}</p>
          <Link to="/company-readiness" className="mt-4 inline-block font-medium hover:underline">
            Back to Companies
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { company, report } = data;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            to="/company-readiness"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{company.name} Readiness Report</h1>
            <p className="mt-1 text-slate-600">{company.description}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Score Card */}
          <div className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Readiness Score</h3>
            
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-slate-50 shadow-inner">
              <svg className="absolute h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="stroke-slate-200"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="10"
                />
                <circle
                  className={`transition-all duration-1000 ease-out ${
                    report.score >= 70 ? 'stroke-green-500' :
                    report.score >= 40 ? 'stroke-yellow-500' : 'stroke-red-500'
                  }`}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${report.score * 2.827} 282.7`}
                />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-bold text-slate-900">{report.score}%</span>
              </div>
            </div>
            
            <p className="mt-6 text-center text-sm text-slate-600">
              {report.score >= 70 ? 'You are highly ready for this company.' :
               report.score >= 40 ? 'You have a moderate chance. Focus on your weaknesses.' :
               'Significant skill gap detected. Review the missing skills below.'}
            </p>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="mt-6 w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Recalculate Score
            </button>
            
            <Link
              to="/resume-builder"
              className="mt-4 w-full block text-center rounded-xl bg-brand-50 border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors"
            >
              Generate ATS Resume
            </Link>
          </div>

          {/* Details */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Strengths (Matched Skills)
              </h3>
              {report.strengths.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {report.strengths.map((skill, index) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-200">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No matched skills found for this company.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Weaknesses (Missing Skills)
              </h3>
              {report.weaknesses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {report.weaknesses.map((skill, index) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 border border-red-200">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Excellent! You have all the required skills.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">All Required Skills for {company.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {company.requiredSkills.join(', ')}
              </p>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
