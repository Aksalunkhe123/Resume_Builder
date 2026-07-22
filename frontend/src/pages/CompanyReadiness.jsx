import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { companyService } from '../services/companyService';

export default function CompanyReadiness() {
  const [companiesData, setCompaniesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await companyService.getCompanyReadinessReports();
      setCompaniesData(response.data);
    } catch (err) {
      setError('Failed to load company readiness data. Please try again.');
      console.error('Error fetching company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (companyName) => {
    try {
      setLoading(true);
      await companyService.generateCompanyReadiness(companyName);
      navigate(`/company-readiness/${companyName}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate readiness analysis.');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Company-Specific Readiness</h1>
          <p className="mt-2 text-slate-600">
            Analyze your profile and resume against the required skills for top tech companies.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companiesData.map((data) => (
              <div
                key={data.name}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">{data.name}</h3>
                  {data.report && (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      data.report.score >= 70 ? 'bg-green-100 text-green-800' : 
                      data.report.score >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {data.report.score}% Match
                    </span>
                  )}
                </div>
                
                <p className="mb-6 flex-1 text-sm text-slate-600 line-clamp-3">
                  {data.description}
                </p>

                <div className="mt-auto">
                  {data.report ? (
                    <Link
                      to={`/company-readiness/${data.name}`}
                      className="block w-full rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
                    >
                      View Report
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleAnalyze(data.name)}
                      className="block w-full rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-brand-700"
                    >
                      Analyze Readiness
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
