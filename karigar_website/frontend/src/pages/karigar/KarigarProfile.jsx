import React, { useState, useEffect } from 'react';
import { User, AlertCircle, Camera, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

export default function KarigarProfile() {
  const { user, login } = useAuth(); // We might need to re-fetch user or just login(data)
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    hourlyRate: user?.hourlyRate || 500,
    services: user?.services || []
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    cnicFrontFile: null,
    cnicBackFile: null
  });

  // Fetch available services for the multi-select
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setAvailableServices(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceToggle = (serviceName) => {
    setFormData(prev => {
      if (prev.services.includes(serviceName)) {
        return { ...prev, services: prev.services.filter(s => s !== serviceName) };
      } else {
        return { ...prev, services: [...prev.services, serviceName] };
      }
    });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('bio', formData.bio);
    submitData.append('hourlyRate', formData.hourlyRate);
    submitData.append('services', JSON.stringify(formData.services));
    
    if (files.profilePhoto) submitData.append('profilePhoto', files.profilePhoto);
    if (files.cnicFrontFile) submitData.append('cnicFrontFile', files.cnicFrontFile);
    if (files.cnicBackFile) submitData.append('cnicBackFile', files.cnicBackFile);

    try {
      const { data } = await api.put('/karigar-portal/profile', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToastMsg('✅ Profile updated successfully');
      
      // If CNIC changed, verification goes pending. Update local auth state if possible.
      // But a simple page reload or fetching /me works too.
      if (files.cnicFrontFile || files.cnicBackFile) {
        showToastMsg('⚠️ CNIC updated. Status changed to Pending.');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      showToastMsg('❌ Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-poppins">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        {user?.verificationStatus === 'approved' ? (
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><User size={16} /> Verified</span>
        ) : user?.verificationStatus === 'rejected' ? (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><AlertCircle size={16} /> Needs Resubmission</span>
        ) : (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><AlertCircle size={16} /> Pending Verification</span>
        )}
      </div>
      <p className="text-slate-500 mb-8">Manage your public information and verification details.</p>

      {/* Warning Box */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mb-8">
        <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
        <div>
          <h4 className="font-semibold text-amber-800">Important Note on CNIC Updates</h4>
          <p className="text-sm text-amber-700 mt-1">
            Updating your CNIC images will automatically reset your verification status to <strong>Pending</strong>. You will lose access to new requests until an Admin approves your new documents.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Public Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell customers about your experience..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none h-32"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hourly Rate (Rs.)</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all mb-4"
              />

              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo (Optional)</label>
              <div className="flex items-center gap-4">
                {user?.profilePhoto && !files.profilePhoto && (
                  <img src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `https://karigar-pk-xuea.onrender.com/${user.profilePhoto}`} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                )}
                {files.profilePhoto && (
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xs text-center border border-slate-200">New</div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Services Provided</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableServices.map((service) => (
                <label key={service._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.services.includes(service.name) ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.name)}
                    onChange={() => handleServiceToggle(service.name)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">{service.icon} {service.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Upload size={18} /> Re-Upload Verification Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                CNIC Front Image
                {files.cnicFrontFile && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Selected</span>}
              </label>
              <input type="file" name="cnicFrontFile" onChange={handleFileChange} className="text-sm text-slate-500" />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                CNIC Back Image
                {files.cnicBackFile && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Selected</span>}
              </label>
              <input type="file" name="cnicBackFile" onChange={handleFileChange} className="text-sm text-slate-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading || formData.services.length === 0}
            className="px-8 py-3 bg-primary hover:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md disabled:bg-slate-300"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
