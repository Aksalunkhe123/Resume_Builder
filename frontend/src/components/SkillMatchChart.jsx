export default function SkillMatchChart({ percentage, size = 160 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 75) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (percentage >= 50) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50' };
    return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-50' };
  };

  const colors = getColor();
  const label = percentage >= 75 ? 'Strong Match' : percentage >= 50 ? 'Moderate Match' : 'Needs Improvement';

  return (
    <div className="flex flex-col items-center">
      <div className={`relative rounded-full ${colors.bg} p-2`}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.text}`}>{percentage}%</span>
          <span className="text-xs font-medium text-slate-500">Match</span>
        </div>
      </div>
      <p className={`mt-3 text-sm font-semibold ${colors.text}`}>{label}</p>
    </div>
  );
}
