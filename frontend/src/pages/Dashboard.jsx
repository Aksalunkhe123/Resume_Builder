import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { authAPI, studentProfileAPI, resumeAPI } from '../services/api';

const StatCard = ({ icon, label, value, subtext, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className={`mb-4 inline-flex rounded-xl p-3 ${accent}`}>{icon}</div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
    <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-slate-50 to-transparent opacity-80" />
  </div>
);

const ActionCard = ({ to, title, description, cta, gradient, icon }) => (
  <Link
    to={to}
    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:min-h-[200px] ${gradient}`}
  >
    <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
    <div className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-white/5" />
    <div className="relative">
      <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur-sm">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">{description}</p>
    </div>
    <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold">
      {cta}
      <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  </Link>
);

const CheckItem = ({ done, label }) => (
  <div className="flex items-center gap-3">
    <div
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
      }`}
    >
      {done ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        '·'
      )}
    </div>
    <span className={`text-sm ${done ? 'text-slate-600 line-through decoration-slate-300' : 'font-medium text-slate-800'}`}>
      {label}
    </span>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [authProfile, setAuthProfile] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [hasStudentProfile, setHasStudentProfile] = useState(false);
  const [resumeCount, setResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authRes, profileRes, resumeRes] = await Promise.allSettled([
          authAPI.getProfile(),
          studentProfileAPI.getProfile(),
          resumeAPI.listResumes(),
        ]);

        if (authRes.status === 'fulfilled') {
          setAuthProfile(authRes.value.data.data.user);
        }

        if (profileRes.status === 'fulfilled') {
          setStudentProfile(profileRes.value.data.data.profile);
          setHasStudentProfile(true);
        }

        if (resumeRes.status === 'fulfilled') {
          setResumeCount(resumeRes.value.data.data.resumes.length);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayUser = authProfile || user;
  const firstName = displayUser?.name?.split(' ')[0] || 'Learner';
  const initials = displayUser?.name
    ? displayUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SB';

  const completionSteps = [
    { done: true, label: 'Create your account' },
    { done: hasStudentProfile, label: 'Complete student profile' },
    { done: resumeCount > 0, label: 'Upload your resume' },
  ];
  const completionPercent = Math.round(
    (completionSteps.filter((s) => s.done).length / completionSteps.length) * 100
  );

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DashboardLayout>
      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Loading your dashboard...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-900 to-indigo-900 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-indigo-500 text-xl font-bold shadow-lg ring-4 ring-white/10">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-200">{today}</p>
                  <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                    Welcome back, {firstName}!
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-indigo-100/90 sm:text-base">
                    Your career command center — track progress, manage your profile, and land your dream role.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20 lg:shrink-0">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="url(#progressGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(completionPercent / 100) * 213.6} 213.6`}
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {completionPercent}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Profile Progress</p>
                  <p className="mt-0.5 text-xs text-indigo-200">
                    {completionPercent === 100 ? 'All set! You\'re ready to go.' : 'Complete the steps below'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Profile Status"
              value={hasStudentProfile ? 'Complete' : 'Pending'}
              subtext={hasStudentProfile ? studentProfile.targetRole : 'Not created yet'}
              accent="bg-violet-100 text-violet-600"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <StatCard
              label="Resumes"
              value={resumeCount}
              subtext={resumeCount === 1 ? 'file uploaded' : 'files uploaded'}
              accent="bg-sky-100 text-sky-600"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              label="Skills Listed"
              value={hasStudentProfile ? studentProfile.skills?.length || 0 : '—'}
              subtext={hasStudentProfile ? 'in your profile' : 'Add a profile first'}
              accent="bg-amber-100 text-amber-600"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            />
            <StatCard
              label="CGPA"
              value={hasStudentProfile ? studentProfile.cgpa : '—'}
              subtext={hasStudentProfile ? `Class of ${studentProfile.graduationYear}` : 'Not available'}
              accent="bg-emerald-100 text-emerald-600"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              }
            />
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <ActionCard
                to={hasStudentProfile ? '/profile' : '/profile/create'}
                title="Student Profile"
                description={
                  hasStudentProfile
                    ? `Targeting ${studentProfile.targetRole}${studentProfile.targetCompany ? ` at ${studentProfile.targetCompany}` : ''}. Keep your details up to date.`
                    : 'Build your academic profile with skills, goals, and career targets.'
                }
                cta={hasStudentProfile ? 'View Profile' : 'Create Profile'}
                gradient="bg-gradient-to-br from-violet-600 to-indigo-700"
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <ActionCard
                to="/resumes"
                title="Resume Manager"
                description={
                  resumeCount > 0
                    ? `${resumeCount} resume${resumeCount > 1 ? 's' : ''} ready. Upload new versions or manage existing files.`
                    : 'Upload your resume in PDF or DOCX format to get started with applications.'
                }
                cta={resumeCount > 0 ? 'Manage Resumes' : 'Upload Resume'}
                gradient="bg-gradient-to-br from-sky-600 to-cyan-700"
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                }
              />
            </div>
          </section>

          {/* Bottom grid */}
          <section className="grid gap-6 lg:grid-cols-5">
            {/* Getting started / checklist */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-900">Getting Started</h3>
              <p className="mt-1 text-sm text-slate-500">Complete these steps to unlock the full experience</p>
              <div className="mt-5 space-y-4">
                {completionSteps.map((step) => (
                  <CheckItem key={step.label} done={step.done} label={step.label} />
                ))}
              </div>
              {completionPercent < 100 && (
                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Overall progress</span>
                    <span className="text-brand-600">{completionPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Account info */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3">
              <h3 className="text-lg font-bold text-slate-900">Account Overview</h3>
              <p className="mt-1 text-sm text-slate-500">Your registered account details</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</p>
                  <p className="mt-1 font-semibold text-slate-900">{displayUser?.name}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
                  <p className="mt-1 break-all font-semibold text-slate-900">{displayUser?.email}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Member Since</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {displayUser?.createdAt
                      ? new Date(displayUser.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              </div>

              {hasStudentProfile && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {studentProfile.skills?.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100"
                      >
                        {skill}
                      </span>
                    ))}
                    {(studentProfile.skills?.length || 0) > 6 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        +{studentProfile.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
