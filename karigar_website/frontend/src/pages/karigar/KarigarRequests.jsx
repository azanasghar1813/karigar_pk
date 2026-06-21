import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Check, X, AlertCircle } from 'lucide-react';
import api from '../../config/api';

export default function KarigarRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Decline modal state
  const [showDecline, setShowDecline] = useState(false);
  const [declineId, setDeclineId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/karigar-portal/bookings?status=pending');
      setRequests(data);
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

  const handleAccept = async (id) => {
    try {
      await api.put(`/karigar-portal/bookings/${id}/status`, { status: 'confirmed' });
      showToastMsg('✅ Request Accepted');
      fetchRequests();
    } catch (error) {
      showToastMsg('❌ Failed to accept');
    }
  };

  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    if (!declineReason.trim()) return;
    
    setActionLoading(true);
    try {
      await api.put(`/karigar-portal/bookings/${declineId}/status`, { 
        status: 'cancelled',
        declineReason 
      });
      showToastMsg('Request Declined');
      setShowDecline(false);
      setDeclineReason('');
      fetchRequests();
    } catch (error) {
      showToastMsg('❌ Failed to decline');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-poppins relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      {/* Decline Modal */}
      {showDecline && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Decline Request</h3>
            <p className="text-sm text-slate-500 mb-4">Please provide a reason for declining. This helps the customer know why you're unavailable.</p>
            <form onSubmit={handleDeclineSubmit}>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. I am fully booked today..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 mb-4 resize-none"
                rows="3"
                required
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDecline(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !declineReason.trim()}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Declining...' : 'Decline Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-slate-800 mb-2">New Requests</h1>
      <p className="text-slate-500 mb-8">Pending bookings that require your approval.</p>

      {requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No pending requests</h3>
          <p className="text-slate-500 text-sm">When customers book you, their requests will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map(req => (
            <div key={req._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {req.serviceType}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">Req #{req._id.slice(-6)}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{req.customer?.fullName}</h3>
                
                <div className="flex flex-col gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{new Date(req.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span>{req.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="max-w-md leading-snug">{req.address}</span>
                  </div>
                </div>
                
                {req.notes && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                    "{req.notes}"
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button
                  onClick={() => {
                    setDeclineId(req._id);
                    setShowDecline(true);
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition-colors"
                >
                  <X size={18} />
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(req._id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-blue-800 text-white font-semibold transition-colors shadow-md"
                >
                  <Check size={18} />
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
