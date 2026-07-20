import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Alert from '../components/Alert';
import { resumeAPI, analysisAPI } from '../services/api';

const SummaryCard = ({ label, value, accent, icon }) => (
  <div className="rounded-2xl border border-white/60 bg-white p-5 shadow-sm">
    <div className={`mb-3 inline-flex rounded-xl p-2.5 ${accent}`}>{icon}</div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="mt-0.5 text-sm text-slate-500">{label}</p>
  </div>
);

export default function AnalysisDashboard() {
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchData = async () => {
    try {
      const [resumeRes, analysisRes] = await Promise.all([
        resumeAPI.listResumes(),
        analysisAPI.listAnalyses(),
      ]);
      setResumes(resumeRes.data.data.resumes);
      setAnalyses(analysisRes.data.data.analyses);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load analysis data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAnalyze = async (resumeId) => {
    setAnalyzingId(resumeId);
    setAlert({ type: '', message: '' });

    try {
      const { data } = await analysisAPI.analyzeResume(resumeId);
      setAnalyses((prev) => [data.data.analysis, ...prev]);
      setAlert({ type: 'success', message: data.message });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Analysis failed. Please try again.',
      });
    } finally {
      setAnalyzingId(null);
    }
  };

  const latestAnalysis = analyses[0];
  const totalSkills = latestAnalysis?.skills?.length || 0;
  const totalProjects = latestAnalysis?.projects?.length || 0;
  const totalMissing = latestAnalysis?.missingKeywords?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-brand-600 to-indigo-700 px-6 py-8 text-white shadow-xl sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a1 1 0 011 1v1.07a7.001 7.001 0 015.93 5.93H20a1 1 0 110 2h-1.07A7.001 7.001 0 0113 17.93V19a1 1 0 11-2 0v-1.07A7.001 7.001 0 014.07 12H3a1 1 0 110-2h1.07A7.001 7.001 0 0111 4.07V3a1 1 0 011-1z" />
              </svg>
              Powered by Gemini AI
            </div>
            <h2 className="text-3xl font-bold tracking-tight">AI Resume Analyzer</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
              Upload a resume, run AI analysis, and get actionable insights on skills, projects, strengths, and missing keywords.
            </p>
          </div>
        </section>

        {alert.message && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        )}

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-500">Loading analyzer...</p>
          </div>
        ) : (
          <>
            {latestAnalysis && (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                  label="Skills Detected"
                  value={totalSkills}
                  accent="bg-violet-100 text-violet-600"
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  }
                />
                <SummaryCard
                  label="Projects Found"
                  value={totalProjects}
                  accent="bg-sky-100 text-sky-600"
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  }
                />
                <SummaryCard
                  label="Strengths"
                  value={latestAnalysis.strengths?.length || 0}
                  accent="bg-emerald-100 text-emerald-600"
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <SummaryCard
                  label="Missing Keywords"
                  value={totalMissing}
                  accent="bg-amber-100 text-amber-600"
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                />
              </section>
            )}

            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">Analyze a Resume</h3>
              <p className="mt-1 text-sm text-slate-500">Select an uploaded resume to run AI-powered analysis</p>

              {resumes.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
                  <Link to="/resumes" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
                    Upload a resume first &rarr;
                  </Link>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold uppercase ${
                            resume.fileExtension === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {resume.fileExtension}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{resume.originalName}</p>
                          <p className="text-xs text-slate-500">
                            Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAnalyze(resume.id)}
                        disabled={analyzingId === resume.id}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {analyzingId === resume.id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Analyze with AI
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">Analysis History</h3>
              <p className="mt-1 text-sm text-slate-500">View your past resume analysis reports</p>

              {analyses.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <p className="text-sm text-slate-500">No analyses yet. Run your first analysis above.</p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {analyses.map((analysis) => (
                    <Link
                      key={analysis.id}
                      to={`/analysis/${analysis.id}`}
                      className="group flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-brand-200 hover:bg-brand-50/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                          {analysis.resumeName}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                          {analysis.summary || 'Analysis report available'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                            {analysis.skills?.length || 0} skills
                          </span>
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                            {analysis.projects?.length || 0} projects
                          </span>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {analysis.missingKeywords?.length || 0} gaps
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <svg className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
