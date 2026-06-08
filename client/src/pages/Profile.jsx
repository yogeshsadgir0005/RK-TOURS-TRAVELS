import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { FiUser, FiMail, FiPhone, FiCheckCircle, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/auth/profile', formData);
      login(response.data.user, localStorage.getItem('token'));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEOHead title="Profile | RK Tours" />
      <div className="min-h-screen bg-bg-secondary pt-32 px-4 sm:px-8 pb-12 font-sans">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
          
          {/* SAAS SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-32 flex flex-col gap-2">
              <Link to="/profile" className="px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors bg-white shadow-saas-sm text-black border border-gray-100">
                <FiUser className="text-lg" />
                Account Details
              </Link>
              <Link to="/my-bookings" className="px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors text-gray-500 hover:bg-gray-100 hover:text-black">
                <FiBookOpen className="text-lg" />
                My Bookings
              </Link>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div>
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-2">Account Settings</h1>
              <p className="text-gray-500 font-medium">Manage your personal information and preferences.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-saas-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-white"></div>
              
              <div className="relative z-10">
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-extrabold shadow-saas-md border-4 border-white relative group cursor-pointer">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-white">Edit</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black tracking-tight">{user?.name}</h2>
                    <p className="text-sm font-medium text-gray-500">Member since 2026</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          className="w-full h-12 pl-11 pr-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-black focus:border-black focus:bg-white shadow-saas-inner outline-none transition-colors" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          value={formData.email} 
                          disabled
                          className="w-full h-12 pl-11 pr-4 bg-gray-100 border border-transparent rounded-xl text-sm font-semibold text-gray-500 outline-none cursor-not-allowed" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase tracking-widest">Verified</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="tel" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                          className="w-full h-12 pl-11 pr-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-black focus:border-black focus:bg-white shadow-saas-inner outline-none transition-colors" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="h-12 px-8 bg-black text-white rounded-xl font-bold text-sm shadow-saas-glow hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2"
                    >
                      {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Save Changes <FiCheckCircle /></>}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;