import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Alert from '../components/Alert';
import SkillGapPreview from '../components/SkillGapPreview';
import { analysisAPI, skillGapAPI } from '../services/api';

export default function SkillGapDashboard() {
  const [roles, setRoles] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, analysesRes, historyRes] = await Promise.all([
          skillGapAPI.getRoles(),
          analysisAPI.listAnalyses(),
          skillGapAPI.listSkillGaps(),
        ]);
        setRoles(rolesRes.data.data.roles);
        setAnalyses(analysesRes.data.data.analyses);
        setHistory(historyRes.data.data.skillGaps);
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to load skill gap data.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePreview = async () => {
    if (!selectedAnalysis || !selectedRole) {
      setAlert({ type: 'error', message: 'Please select a resume analysis and target role.' });
      return;
    }

    setPreviewing(true);
    setAlert({ type: '', message: '' });

    try {
      const { data } = await skillGapAPI.previewSkillGap({
        analysisId: selectedAnalysis,
        targetRole: selectedRole,
      });
      setPreview(data.data.preview);
    } catch (error) {
      setPreview(null);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to generate preview.',
      });
    } finally {
      setPreviewing(false);
    }
  };

  const handleSave = async () => {
    if (!selectedAnalysis || !selectedRole) return;

    setSaving(true);
    try {
      const { data } = await skillGapAPI.analyzeSkillGap({
        analysisId: selectedAnalysis,
        targetRole: selectedRole,
      });
      setHistory((prev) => [data.data.skillGap, ...prev]);
      setAlert({ type: 'success', message: data.message });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save report.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-6 py-8 text-white shadow-xl sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Skill Gap Analysis
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Compare Skills vs Target Role</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-100 sm:text-base">
              Identify skill gaps between your resume and your dream role. Preview results instantly, then save your report.
            </p>
          </div>
        </section>

        {alert.message && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        )}

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-500">Loading...</p>
          </div>
        ) : (
          <>
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">Run Analysis</h3>
              <p className="mt-1 text-sm text-slate-500">
                Select a resume analysis and target role to compare skills
              </p>

              {analyses.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <p className="text-sm text-slate-500">No resume analyses found.</p>
                  <Link to="/analysis" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
                    Run AI Resume Analysis first &rarr;
                  </Link>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Resume Analysis</label>
                    <select
                      value={selectedAnalysis}
                      onChange={(e) => {
                        setSelectedAnalysis(e.target.value);
                        setPreview(null);
                      }}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select analysis...</option>
                      {analyses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.resumeName} ({a.skills?.length || 0} skills)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Target Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e.target.value);
                        setPreview(null);
                      }}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select role...</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handlePreview}
                      disabled={previewing || !selectedAnalysis || !selectedRole}
                      className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {previewing ? 'Generating Preview...' : 'Preview Skill Gap'}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setPreview(null);
                    }}
                    className={`rounded-xl border p-3 text-left text-sm transition ${
                      selectedRole === role
                        ? 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200'
                        : 'border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-emerald-50/50'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{role}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Click to select</p>
                  </button>
                ))}
              </div>
            </section>

            {preview && (
              <SkillGapPreview preview={preview} onSave={handleSave} saving={saving} />
            )}

            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">Saved Reports</h3>
              <p className="mt-1 text-sm text-slate-500">Previously saved skill gap analyses</p>

              {history.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <p className="text-sm text-slate-500">No saved reports yet. Preview and save your first analysis above.</p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {history.map((gap) => (
                    <Link
                      key={gap.id}
                      to={`/skill-gap/${gap.id}`}
                      className="group flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${
                            gap.matchPercentage >= 75
                              ? 'bg-emerald-100 text-emerald-700'
                              : gap.matchPercentage >= 50
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {gap.matchPercentage}%
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-emerald-700">
                            {gap.targetRole}
                          </p>
                          <p className="text-xs text-slate-500">{gap.resumeName}</p>
                          <div className="mt-1 flex gap-2">
                            <span className="text-xs text-emerald-600">{gap.existingSkills?.length} matched</span>
                            <span className="text-xs text-red-500">{gap.missingSkills?.length} missing</span>
                          </div>
                        </div>
                      </div>
                      <svg className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
