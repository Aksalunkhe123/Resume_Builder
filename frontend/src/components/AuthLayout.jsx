export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-brand-900 to-indigo-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white shadow-lg">
            SB
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">SkillBridge AI</h1>
          <p className="mt-2 text-sm text-indigo-200">{subtitle}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
