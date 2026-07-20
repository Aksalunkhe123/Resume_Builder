import SkillMatchChart from './SkillMatchChart';
import MissingSkillsTable from './MissingSkillsTable';

const TagList = ({ items, colorClass }) => {
  if (!items?.length) {
    return <p className="text-sm text-slate-500">None</p>;
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

export default function SkillGapPreview({ preview, onSave, saving }) {
  if (!preview) return null;

  return (
    <div className="space-y-6 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/30 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            Live Preview
          </span>
          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {preview.targetRole} — Skill Gap Report
          </h3>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Report'}
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex items-center justify-center rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
          <SkillMatchChart percentage={preview.matchPercentage} />
        </div>

        <div className="grid grid-cols-3 gap-3 lg:col-span-2">
          {[
            { label: 'Matched', value: preview.existingSkills?.length || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Missing', value: preview.missingSkills?.length || 0, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Recommended', value: preview.recommendedSkills?.length || 0, color: 'text-violet-600', bg: 'bg-violet-50' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl ${stat.bg} p-4 text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-600">{stat.label}</p>
            </div>
          ))}
          <div className="col-span-3 rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Required Skills</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{preview.totalRequired} total</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h4 className="mb-3 font-semibold text-emerald-700">Existing Skills</h4>
          <TagList items={preview.existingSkills} colorClass="bg-emerald-50 text-emerald-700 ring-emerald-100" />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h4 className="mb-3 font-semibold text-violet-700">Recommended Skills</h4>
          <TagList items={preview.recommendedSkills} colorClass="bg-violet-50 text-violet-700 ring-violet-100" />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h4 className="mb-4 font-semibold text-slate-900">Missing Skills</h4>
        <MissingSkillsTable
          skills={preview.missingSkills}
          suggestions={preview.improvementSuggestions}
        />
      </div>

      {preview.improvementSuggestions?.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h4 className="mb-4 font-semibold text-slate-900">Improvement Suggestions</h4>
          <div className="space-y-3">
            {preview.improvementSuggestions.map((item) => (
              <div key={item.skill} className="flex gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700">
                  {item.skill.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.skill}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{item.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
