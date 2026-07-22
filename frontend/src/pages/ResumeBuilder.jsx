import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { resumeBuilderService } from '../services/resumeBuilderService';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOptimizedResume();
  }, []);

  const fetchOptimizedResume = async () => {
    try {
      setLoading(true);
      const response = await resumeBuilderService.generateATSResume();
      setResumeData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate optimized resume.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute h-full w-full animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
            <svg className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900">AI is optimizing your resume...</h3>
            <p className="text-sm text-slate-500 mt-1">Applying industry best practices for ATS compliance.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 border border-red-100">
          <p>{error}</p>
          <button onClick={fetchOptimizedResume} className="mt-4 inline-block font-medium hover:underline">
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 print:m-0 print:max-w-none print:space-y-0 print:bg-white print:p-0">
        
        {/* Controls - Hidden on Print */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-200 print:hidden">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Your ATS-Optimized Resume</h1>
            <p className="text-sm text-slate-500 mt-1">Ready to download. This format is proven to pass Applicant Tracking Systems.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Save as PDF
            </button>
          </div>
        </div>

        {/* Resume Preview/Print Area */}
        <div className="resume-print-area bg-white shadow-lg border border-slate-200 rounded-lg p-10 print:shadow-none print:border-none print:p-0">
          
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .resume-print-area, .resume-print-area * {
                visibility: visible;
              }
              .resume-print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                font-family: 'Times New Roman', Times, serif;
                color: #000;
              }
              h1, h2, h3, h4, p, li, span {
                color: #000 !important;
              }
            }
          `}</style>

          <div className="font-serif text-slate-900 leading-snug">
            
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-slate-900 pb-4">
              <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{resumeData.contact.fullName}</h1>
              <div className="flex flex-wrap justify-center gap-x-4 text-sm">
                {resumeData.contact.email && <span>{resumeData.contact.email}</span>}
                {resumeData.contact.phone && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{resumeData.contact.phone}</span>
                  </>
                )}
                {resumeData.contact.location && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{resumeData.contact.location}</span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 text-sm mt-1">
                 {resumeData.contact.linkedin && <span>{resumeData.contact.linkedin}</span>}
                 {resumeData.contact.github && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{resumeData.contact.github}</span>
                  </>
                )}
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div className="mb-5">
                <p className="text-sm text-justify">{resumeData.summary}</p>
              </div>
            )}

            {/* Skills */}
            {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase tracking-wide border-b border-slate-400 mb-2 pb-1">Skills</h2>
                <div className="text-sm">
                  {resumeData.skills.technical.length > 0 && (
                    <div className="mb-1">
                      <span className="font-bold">Technical Skills: </span>
                      {resumeData.skills.technical.join(', ')}
                    </div>
                  )}
                  {resumeData.skills.soft.length > 0 && (
                    <div>
                      <span className="font-bold">Soft Skills: </span>
                      {resumeData.skills.soft.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase tracking-wide border-b border-slate-400 mb-2 pb-1">Experience</h2>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-base">{exp.role}</h3>
                      <span className="text-sm italic">{exp.duration}</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-medium text-sm">{exp.company}</span>
                    </div>
                    <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                      {exp.points.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase tracking-wide border-b border-slate-400 mb-2 pb-1">Projects</h2>
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-base">{proj.title}</h3>
                    </div>
                    {proj.technologies && (
                      <div className="mb-1 text-sm italic">
                        <span className="font-medium">Technologies: </span>{proj.technologies}
                      </div>
                    )}
                    <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                      {proj.points.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase tracking-wide border-b border-slate-400 mb-2 pb-1">Education</h2>
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-base">{edu.degree}</h3>
                      <span className="text-sm italic">{edu.year}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-sm">
                      <span>{edu.institution}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase tracking-wide border-b border-slate-400 mb-2 pb-1">Certifications</h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {resumeData.certifications.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
