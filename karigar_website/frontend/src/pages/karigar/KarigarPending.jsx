import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, MessageSquare, AlertCircle, AlertTriangle, CheckCircle2, ArrowRight, Upload, Building2, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/api';

export default function KarigarPending() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Message form
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Correction form
  const [correctionValue, setCorrectionValue] = useState('');
  const [correctionFile, setCorrectionFile] = useState(null);
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await api.get('/karigar-portal/profile');
      if (res.data) {
        setProfileData(res.data);
        if (res.data.karigar?.correctionNote?.field) {
          const field = res.data.karigar.correctionNote.field;
          setCorrectionValue(res.data.karigar[field] || '');
        }
      }
    } catch (err) {
      console.warn('Could not fetch portal profile:', err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSendingMessage(true);
    try {
      await api.put('/karigar-portal/request-approval', { message });
      showToast('✅ Message sent to Admin successfully');
      setMessage('');
    } catch (error) {
      showToast('❌ Failed to send message');
      console.error(error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleResubmitCorrection = async (e) => {
    e.preventDefault();
    const karigar = profileData?.karigar;
    const field = karigar?.correctionNote?.field;
    if (!field) return;

    setSubmittingCorrection(true);
    try {
      const formData = new FormData();
      formData.append('field', field);

      if (['profilePhoto', 'coverPhoto', 'cnicFrontFile', 'cnicBackFile'].includes(field)) {
        if (!correctionFile) {
          showToast('❌ Please select a file to upload');
          setSubmittingCorrection(false);
          return;
        }
        formData.append(field, correctionFile);
      } else {
        if (!correctionValue || !correctionValue.toString().trim()) {
          showToast('❌ Please provide a valid value');
          setSubmittingCorrection(false);
          return;
        }
        formData.append('value', correctionValue);
      }

      await api.put('/karigar-portal/correction', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('✅ Tasheeh jama kar di gayi hai — Admin dobara review karega.');
      await fetchProfile();
    } catch (error) {
      console.error('Error submitting correction:', error);
      showToast('❌ Tasheeh submit karne mein masla hua. Dobara koshish karein.');
    } finally {
      setSubmittingCorrection(false);
    }
  };

  const karigar = profileData?.karigar || user;
  const listing = profileData?.listing;
  const isApproved = karigar?.verificationStatus === 'approved';
  const isRejected = karigar?.verificationStatus === 'rejected';
  const hasCorrection = Boolean(karigar?.correctionNote?.field && karigar?.correctionNote?.message);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isApproved) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4 font-poppins">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-2xl font-bold text-[#0A1F44] mb-2">Aapka Account Verified Hai!</h1>
          <p className="text-slate-500 mb-6 text-sm">
            Mubarak ho! Aapka Karigar profile aur business listing verify ho chuka hai. Ab aap bookings receive kar sakte hain.
          </p>
          <button
            onClick={() => navigate('/karigar')}
            className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 rounded-xl transition-all shadow-md"
          >
            Go to Business Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] p-4 sm:p-6 font-poppins">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0A1F44] text-white text-xs sm:text-sm px-5 py-3 rounded-xl shadow-2xl border border-white/20 animate-fade-in">
          {toast}
        </div>
      )}

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
        
        {/* BRANCH 1: REJECTED STATE */}
        {isRejected ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={34} />
            </div>

            <h1 className="text-2xl font-extrabold text-[#0A1F44] mb-2">
              Application Rejected
            </h1>
            
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-5">
              Afsoos, aapki claim application KarigarPK verification team ne approve nahi ki.
            </p>

            {/* Verbatim Rejection Reason Box */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 text-left mb-6">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                Admin Rejection Reason (Verbatim):
              </span>
              <p className="text-sm font-medium text-red-900 whitespace-pre-wrap leading-relaxed">
                "{karigar?.rejectionReason || 'Provided business details could not be verified against official records.'}"
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/find-karigar"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-3 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25"
              >
                <span>Submit New Business Claim</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://wa.me/923427066034?text=Salam%2C%20meri%20KarigarPK%20claim%20reject%20hui%20hai%2C%20mujhe%20support%20chahiye."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#0A1F44] font-semibold py-2.5 px-4 rounded-xl text-xs transition-all"
              >
                Contact Verification Support on WhatsApp
              </a>
            </div>
          </div>

        ) : hasCorrection ? (
          /* BRANCH 2: CORRECTION PATH */
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h1 className="text-2xl font-extrabold text-[#0A1F44] mb-2">
                Tasheeh Darkaar Hai
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                Verification team ne aapki application check ki hai aur ek cheez update karne ka kaha hai.
              </p>
            </div>

            {/* Verbatim Correction Note Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-left mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Field to Update: <span className="font-extrabold text-amber-950 underline">{karigar.correctionNote.field}</span>
                </span>
              </div>
              <p className="text-sm font-medium text-amber-950 whitespace-pre-wrap leading-relaxed">
                "{karigar.correctionNote.message}"
              </p>
            </div>

            {/* Targeted One-Field Edit Form */}
            <form onSubmit={handleResubmitCorrection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                  Update {karigar.correctionNote.field.toUpperCase()}
                </label>

                {['profilePhoto', 'coverPhoto', 'cnicFrontFile', 'cnicBackFile'].includes(karigar.correctionNote.field) ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#FF7A00] transition-colors cursor-pointer bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCorrectionFile(e.target.files[0])}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0A1F44] file:text-white hover:file:bg-[#102747]"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-2">Upload clean JPG, PNG or WEBP</p>
                  </div>
                ) : karigar.correctionNote.field === 'bio' ? (
                  <div>
                    <textarea
                      value={correctionValue}
                      onChange={(e) => setCorrectionValue(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                      placeholder="Write your business bio (minimum 40 characters)..."
                      required
                    />
                    <span className="text-[11px] text-slate-400 block text-right mt-1">
                      {correctionValue.length} characters (min 40)
                    </span>
                  </div>
                ) : (
                  <input
                    type={karigar.correctionNote.field === 'hourlyRate' ? 'number' : 'text'}
                    value={correctionValue}
                    onChange={(e) => setCorrectionValue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    placeholder={`Enter updated ${karigar.correctionNote.field}`}
                    required
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={submittingCorrection}
                className="w-full bg-[#FF7A00] hover:bg-[#F06400] disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm"
              >
                {submittingCorrection ? 'Resubmitting...' : 'Resubmit for Review →'}
              </button>
            </form>
          </div>

        ) : (
          /* BRANCH 3: STANDARD PENDING / UNDER REVIEW */
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <Clock size={32} />
              </div>

              <h1 className="text-2xl font-extrabold text-[#0A1F44] mb-2 font-poppins">
                Under Review
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Response within 24 hours via WhatsApp.
              </p>
            </div>

            {/* Listing Summary Card if available */}
            {listing && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={16} className="text-[#FF7A00]" />
                  <span className="text-xs font-bold text-[#0A1F44]">{listing.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <p><strong>Service:</strong> {listing.service}</p>
                  <p><strong>City & Area:</strong> {listing.area ? `${listing.area}, ` : ''}{listing.city}</p>
                  <p><strong>Registered Phone:</strong> {listing.phone}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left text-xs text-blue-900 leading-relaxed mb-6">
              <strong>Zaroori Note:</strong> KarigarPK team aapki documents aur phone number verify kar rahi hai. Approval ke baad aapka verified badge live hoga aur aap is dashboard se bookings manage kar sakein gay.
            </div>

            {/* Optional message to admin */}
            <form onSubmit={handleSendMessage} className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-[#0A1F44] mb-2 flex items-center gap-2">
                <MessageSquare size={14} className="text-[#FF7A00]" />
                Send a message or query to Admin
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Salam, maine CNIC upload kar diya hai, baraye meherbani jaldi verify karein..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] transition-all resize-none text-xs mb-3 bg-white"
                rows="3"
                required
              />
              <button
                type="submit"
                disabled={sendingMessage || !message.trim()}
                className="w-full bg-[#0A1F44] hover:bg-[#102747] disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition-all text-xs"
              >
                {sendingMessage ? 'Sending...' : 'Send Message to Admin'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
