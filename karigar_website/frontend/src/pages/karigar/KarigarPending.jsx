import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../../config/api';

export default function KarigarPending() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await api.put('/karigar-portal/request-approval', { message });
      showToast('✅ Message sent to Admin successfully');
      setMessage('');
    } catch (error) {
      showToast('❌ Failed to send message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.verificationStatus === 'approved') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-800">You are approved!</h1>
        <p className="text-slate-600 mt-2">Please navigate to the dashboard using the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        {user?.verificationStatus === 'rejected' ? (
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
        ) : (
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} />
          </div>
        )}

        <h1 className="text-2xl font-bold text-slate-800 mb-2 font-poppins">
          {user?.verificationStatus === 'rejected' ? 'Application Rejected' : 'Application Pending'}
        </h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          {user?.verificationStatus === 'rejected' 
            ? 'Unfortunately, your application was not approved. Please review your details or contact support.'
            : 'Your karigar application is currently under review by our admin team. Once approved, you will get full access to the dashboard.'}
        </p>

        <form onSubmit={handleSendMessage} className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            Send a message to Admin
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Please approve my application, I have updated my CNIC..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none mb-3"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-primary hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl transition-all"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
