export default function MissingSkillsTable({ skills, suggestions = [] }) {
  if (!skills?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
        <p className="text-sm text-emerald-600 font-medium">No missing skills — great job!</p>
      </div>
    );
  }

  const suggestionMap = Object.fromEntries(
    suggestions.map((s) => [s.skill, s.suggestion])
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full min-w-[500px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="px-4 py-3 font-semibold text-slate-700">#</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Missing Skill</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Priority</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Suggestion</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill, index) => (
            <tr key={skill} className="border-b border-slate-50 transition hover:bg-slate-50/80">
              <td className="px-4 py-3 text-slate-400">{index + 1}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2 font-medium text-slate-900">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  {skill}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    index < 3
                      ? 'bg-red-100 text-red-700'
                      : index < 6
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {index < 3 ? 'High' : index < 6 ? 'Medium' : 'Low'}
                </span>
              </td>
              <td className="max-w-xs px-4 py-3 text-slate-600">
                {suggestionMap[skill] || `Learn ${skill} and add it to your resume.`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
