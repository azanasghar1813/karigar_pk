import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Phone, Play, CheckCircle2, Settings, Save, Plus, X } from 'lucide-react';
import api from '../../config/api';

export default function KarigarSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [availability, setAvailability] = useState({
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '09:00', end: '18:00' },
    blockedDates: []
  });
  const [newBlockedDate, setNewBlockedDate] = useState('');
  
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        api.get('/karigar-portal/bookings?status=upcoming'),
        api.get('/karigar-portal/stats')
      ]);
      setSchedule(bookingsRes.data);
      if (statsRes.data.availability) {
        setAvailability(statsRes.data.availability);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/karigar-portal/bookings/${id}/status`, { status: newStatus });
      showToastMsg(newStatus === 'completed' ? '✅ Job marked as complete' : '🚀 Job started');
      fetchSchedule(); // Refresh
    } catch (error) {
      showToastMsg('❌ Failed to update status');
    }
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/karigar-portal/schedule', availability);
      setAvailability(data);
      showToastMsg('✅ Schedule saved successfully');
    } catch (error) {
      showToastMsg('❌ Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    setAvailability(prev => {
      const days = prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: days };
    });
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (availability.blockedDates.includes(newBlockedDate)) return;
    setAvailability(prev => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlockedDate]
    }));
    setNewBlockedDate('');
  };

  const handleRemoveBlockedDate = (dateToRemove) => {
    setAvailability(prev => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(d => d !== dateToRemove)
    }));
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-poppins relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold text-slate-800 mb-2">My Schedule</h1>
      <p className="text-slate-500 mb-8">Manage your availability and view upcoming jobs.</p>

      {/* Availability Settings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Settings className="text-primary w-6 h-6" />
          <h2 className="text-xl font-bold text-slate-800">Availability Settings</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Working Days</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    availability.workingDays.includes(day)
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-slate-700 mb-3">Working Hours</h3>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Start</label>
                <input 
                  type="time" 
                  value={availability.workingHours?.start || '09:00'} 
                  onChange={(e) => setAvailability(prev => ({...prev, workingHours: {...prev.workingHours, start: e.target.value}}))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <span className="text-slate-400 mt-5">-</span>
              <div>
                <label className="text-xs text-slate-500 block mb-1">End</label>
                <input 
                  type="time" 
                  value={availability.workingHours?.end || '18:00'} 
                  onChange={(e) => setAvailability(prev => ({...prev, workingHours: {...prev.workingHours, end: e.target.value}}))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Blocked Dates (Vacation/Off Days)</h3>
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="date" 
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none flex-1"
              />
              <button 
                onClick={handleAddBlockedDate}
                className="bg-secondary hover:bg-orange-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
              {availability.blockedDates.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No blocked dates.</p>
              ) : (
                availability.blockedDates.sort().map(date => (
                  <div key={date} className="flex items-center justify-between bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm border border-red-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <button onClick={() => handleRemoveBlockedDate(date)} className="text-red-400 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100">
          <button 
            onClick={handleSaveAvailability}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-md disabled:opacity-70"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Upcoming Bookings</h2>
      </div>

      {schedule.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No upcoming jobs</h3>
          <p className="text-slate-500 text-sm">Accept requests to build your schedule.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {schedule.map(job => (
            <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                
                {/* Left col */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {job.serviceType}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      job.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {job.status === 'in-progress' ? 'In Progress' : 'Confirmed'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{job.customer?.fullName}</h3>
                  
                  {/* Phone is revealed here! */}
                  <div className="flex items-center gap-2 text-primary font-medium mb-4">
                    <Phone size={16} />
                    <a href={`tel:${job.customer?.phone}`} className="hover:underline">{job.customer?.phone}</a>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{new Date(job.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>{job.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <span className="max-w-md leading-snug">{job.address}</span>
                    </div>
                  </div>
                  
                  {job.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                      "{job.notes}"
                    </div>
                  )}
                </div>

                {/* Right col: Actions */}
                <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col gap-3">
                  {job.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(job._id, 'in-progress')}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-md w-full"
                    >
                      <Play size={18} fill="currentColor" />
                      Start Job
                    </button>
                  )}
                  {job.status === 'in-progress' && (
                    <button
                      onClick={() => handleUpdateStatus(job._id, 'completed')}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-md w-full"
                    >
                      <CheckCircle2 size={18} />
                      Mark Complete
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
