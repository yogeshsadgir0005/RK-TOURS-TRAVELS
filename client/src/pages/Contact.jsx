import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiMapPin, FiPhone } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';
import { useBranding } from '../context/BrandingContext';

const Contact = () => {
  const { contentData } = useBranding();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/messages', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEOHead title="Contact Us | RK Tours" />
      <div className="min-h-screen bg-bg-secondary pt-20 pb-24 px-4 sm:px-8 font-sans">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Get in touch</h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed mb-12 max-w-sm">
              Our enterprise support team is available 24/7. We guarantee a response within 15 minutes.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-saas-sm flex items-center justify-center">
                  <FiMail className="text-xl text-white" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email Support</h4>
                  <p className="text-lg font-bold text-white">{contentData?.contactEmail || 'support@rktours.com'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-saas-sm flex items-center justify-center">
                  <FiPhone className="text-xl text-white" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Priority Hotline</h4>
                  <p className="text-lg font-bold text-white">{contentData?.contactPhone || '+91 99999 99999'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-saas-sm flex items-center justify-center">
                  <FiMapPin className="text-xl text-white" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Headquarters</h4>
                  <p className="text-sm font-bold text-white whitespace-pre-line">{contentData?.contactAddress || 'Pune, Maharashtra, IN'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 sm:p-10 rounded-2xl sm:rounded-[32px] border border-neutral-800 shadow-saas-lg">
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-8">Send a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-white border border-transparent rounded-xl text-sm font-bold text-neutral-900 placeholder-gray-500 focus:border-orange-500 outline-none shadow-md transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-white border border-transparent rounded-xl text-sm font-bold text-neutral-900 placeholder-gray-500 focus:border-orange-500 outline-none shadow-md transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Message</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-4 top-4 text-gray-500 z-10" />
                  <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-white border border-transparent rounded-xl text-sm font-bold text-neutral-900 placeholder-gray-500 focus:border-orange-500 outline-none shadow-md transition-colors resize-none"></textarea>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Send Message <FiSend /></>}
              </button>
            </form>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;