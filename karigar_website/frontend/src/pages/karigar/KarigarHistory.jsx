import React, { useState, useEffect } from 'react';
import { CheckCircle2, Calendar, MapPin, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

export default function KarigarHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ week: 0, month: 0, all: 0 });
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/karigar-portal/bookings?status=completed');
      setHistory(data);
      calculateTotals(data, user?.hourlyRate || 500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (jobs, rate) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let week = 0, month = 0, all = 0;

    jobs.forEach(job => {
      const jobDate = new Date(job.date);
      const amount = rate; // Simplified fixed amount

      all += amount;
      if (jobDate >= firstOfMonth) month += amount;
      if (jobDate >= oneWeekAgo) week += amount;
    });

    setTotals({ week, month, all });
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-poppins">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Job History</h1>
          <p className="text-slate-500 mt-1">A log of your completed work.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-white border border-slate-200 px-5 py-4 rounded-xl flex items-center gap-4 shadow-sm w-full sm:w-auto">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">This Week</p>
              <p className="text-xl font-bold text-slate-800">Rs. {totals.week.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 px-5 py-4 rounded-xl flex items-center gap-4 shadow-sm w-full sm:w-auto">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">This Month</p>
              <p className="text-xl font-bold text-slate-800">Rs. {totals.month.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-5 py-4 rounded-xl flex items-center gap-4 shadow-sm w-full sm:w-auto">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-800 uppercase">All Time</p>
              <p className="text-xl font-bold text-emerald-900">Rs. {totals.all.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No completed jobs yet</h3>
          <p className="text-slate-500 text-sm">Once you finish jobs, they will appear here as a record.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map(job => (
            <div key={job._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{job.customer?.fullName}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                    <span className="font-medium text-secondary">{job.serviceType}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(job.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.address.split(',')[0]}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto px-14 md:px-0">
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Earned</p>
                  <p className="font-bold text-slate-800">Rs. {user?.hourlyRate || 500}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
