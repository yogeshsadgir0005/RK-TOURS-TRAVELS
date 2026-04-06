import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import axiosInstance from '../utils/axiosInstance';
import { 
  FiUser, FiMail, FiPhone, FiLock, FiShield, 
  FiLogOut, FiCheckCircle, FiEdit2 
} from 'react-icons/fi';

const Profile = () => {
  const { user, fetchUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  
  // Field Editability States
  const [editStates, setEditStates] = useState({ name: false, email: false, phone: false });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const toggleEdit = (field) => {
    setEditStates(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSensitiveUpdate = async (field, value) => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/request-update-otp', { field, value });
      // Redirect to OTP page with intent
      navigate('/verify-otp', { 
        state: { 
          email: user.email, 
          intent: 'update-profile',
          field, 
          newValue: value 
        } 
      });
    } catch (error) {
      alert(error.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    setLoading(true);
    try {
      await axiosInstance.put('/auth/profile', { name: formData.name });
      await fetchUser();
      toggleEdit('name');
      alert("Name updated successfully");
    } catch (error) {
      alert("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: FiUser },
    { id: 'security', name: 'Security', icon: FiShield },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 pt-32 font-sans">
      <SEOHead title="Account Settings | CabBook" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Account Settings</h1>
            <p className="text-gray-500 mt-1 font-medium">Securely manage your identity and access.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === tab.id ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <tab.icon size={18} /> {tab.name}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all">
                  <FiLogOut size={18} /> Sign Out
                </button>
              </div>
            </nav>
          </aside>

          <main className="flex-grow">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
              {activeTab === 'general' && (
                <div className="p-8 md:p-10">
                  <h2 className="text-xl font-bold text-black mb-8">Personal Information</h2>
                  
                  <div className="space-y-8">
                    {/* Name Field - Basic Update */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <button onClick={() => toggleEdit('name')} className="text-black hover:bg-gray-100 p-2 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.name} 
                          readOnly={!editStates.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`block w-full px-5 py-4 rounded-2xl outline-none font-semibold transition-all ${
                            editStates.name ? 'bg-white ring-2 ring-black text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                          }`} 
                        />
                        {editStates.name && (
                          <button onClick={handleNameUpdate} className="absolute right-3 top-2.5 bg-black text-white px-4 py-1.5 rounded-xl text-xs font-bold">Save</button>
                        )}
                      </div>
                    </div>

                    {/* Email Field - Sensitive Update */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <button onClick={() => toggleEdit('email')} className="text-black hover:bg-gray-100 p-2 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="email" 
                          value={formData.email} 
                          readOnly={!editStates.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`block w-full px-5 py-4 rounded-2xl outline-none font-semibold transition-all ${
                            editStates.email ? 'bg-white ring-2 ring-black text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                          }`} 
                        />
                        {editStates.email && (
                          <button onClick={() => handleSensitiveUpdate('email', formData.email)} className="absolute right-3 top-2.5 bg-black text-white px-4 py-1.5 rounded-xl text-xs font-bold">Verify & Save</button>
                        )}
                      </div>
                    </div>

                    {/* Phone Field - Sensitive Update */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <button onClick={() => toggleEdit('phone')} className="text-black hover:bg-gray-100 p-2 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="tel" 
                          value={formData.phone} 
                          readOnly={!editStates.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`block w-full px-5 py-4 rounded-2xl outline-none font-semibold transition-all ${
                            editStates.phone ? 'bg-white ring-2 ring-black text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                          }`} 
                        />
                        {editStates.phone && (
                          <button onClick={() => handleSensitiveUpdate('phone', formData.phone)} className="absolute right-3 top-2.5 bg-black text-white px-4 py-1.5 rounded-xl text-xs font-bold">Verify & Save</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="p-8 md:p-10">
                  <h2 className="text-xl font-bold text-black mb-8">Security Controls</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-black transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-black"><FiLock size={20} /></div>
                        <div>
                          <p className="font-bold text-black text-sm">Change Password</p>
                          <p className="text-xs text-gray-500 font-medium">Redirects to secure reset flow.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/forgot-password')}
                        className="text-sm font-bold text-white bg-black px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors shadow-lg shadow-black/10"
                      >
                        Initiate Reset
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-black"><FiShield size={20} /></div>
                        <div>
                          <p className="font-bold text-black text-sm">Two-Factor Auth</p>
                          <p className="text-xs text-gray-500 font-medium">Enabled by default via Email OTP.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-tighter">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;