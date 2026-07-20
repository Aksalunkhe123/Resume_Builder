import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Alert from '../components/Alert';
import { analysisAPI } from '../services/api';

const Section = ({ title, icon, children, accent = 'border-slate-100' }) => (
  <section className={`rounded-2xl border bg-white p-6 shadow-sm ${accent}`}>
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
    {children}
  </section>
);

const TagList = ({ items, colorClass = 'bg-brand-50 text-brand-700 ring-brand-100' }) => {
  if (!items?.length) {
    return <p className="text-sm text-slate-500">None identified</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${colorClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
};

const BulletList = ({ items, bulletColor }) => {
  if (!items?.length) {
    return <p className="text-sm text-slate-500">None identified</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${bulletColor}`} />
          {item}
        </li>
      ))}
    </ul>
  );
};

export default function AnalysisReport() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await analysisAPI.getAnalysis(id);
        setAnalysis(data.data.analysis);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analysis report.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Loading report...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analysis) {
    return (
      <DashboardLayout>
        <Alert type="error" message={error || 'Analysis not found.'} />
        <Link to="/analysis" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
          &larr; Back to Analyzer
        </Link>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link to="/analysis" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              &larr; Back to Analyzer
            </Link>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">{analysis.resumeName}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Analyzed on{' '}
              {new Date(analysis.createdAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-semibold text-violet-700">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a1 1 0 011 1v1.07a7.001 7.001 0 015.93 5.93H20a1 1 0 110 2h-1.07A7.001 7.001 0 0113 17.93V19a1 1 0 11-2 0v-1.07A7.001 7.001 0 014.07 12H3a1 1 0 110-2h1.07A7.001 7.001 0 0111 4.07V3a1 1 0 011-1z" />
            </svg>
            Gemini AI Report
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Skills', value: analysis.skills?.length || 0, color: 'text-violet-600' },
            { label: 'Projects', value: analysis.projects?.length || 0, color: 'text-sky-600' },
            { label: 'Certifications', value: analysis.certifications?.length || 0, color: 'text-emerald-600' },
            { label: 'Missing Keywords', value: analysis.missingKeywords?.length || 0, color: 'text-amber-600' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        {analysis.summary && (
          <Section
            title="Overall Summary"
            icon={
              <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <p className="text-sm leading-relaxed text-slate-700">{analysis.summary}</p>
          </Section>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Section
            title="Skills"
            icon={
              <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
          >
            <TagList items={analysis.skills} colorClass="bg-violet-50 text-violet-700 ring-violet-100" />
          </Section>

          <Section
            title="Certifications"
            icon={
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          >
            <TagList items={analysis.certifications} colorClass="bg-emerald-50 text-emerald-700 ring-emerald-100" />
          </Section>
        </div>

        <Section
          title="Projects"
          icon={
            <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        >
          {analysis.projects?.length ? (
            <div className="space-y-3">
              {analysis.projects.map((project, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{project.title || 'Untitled Project'}</p>
                  {project.description && (
                    <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No projects identified</p>
          )}
        </Section>

        <Section
          title="Education"
          icon={
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          }
        >
          {analysis.education?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {analysis.education.map((edu, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{edu.degree || 'Degree'}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{edu.institution}</p>
                  {edu.year && <p className="mt-1 text-xs text-slate-400">{edu.year}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No education details identified</p>
          )}
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section
            title="Strengths"
            accent="border-emerald-100"
            icon={
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            }
          >
            <BulletList items={analysis.strengths} bulletColor="bg-emerald-500" />
          </Section>

          <Section
            title="Weaknesses"
            accent="border-red-100"
            icon={
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          >
            <BulletList items={analysis.weaknesses} bulletColor="bg-red-400" />
          </Section>
        </div>

        <Section
          title="Missing Keywords"
          accent="border-amber-100"
          icon={
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        >
          <p className="mb-3 text-sm text-slate-600">
            Add these keywords to improve your ATS score and align with industry expectations:
          </p>
          <TagList items={analysis.missingKeywords} colorClass="bg-amber-50 text-amber-800 ring-amber-200" />
        </Section>
      </div>
    </DashboardLayout>
  );
}
