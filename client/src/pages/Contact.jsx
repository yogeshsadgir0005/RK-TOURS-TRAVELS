import { useState , useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';
import { FiSend, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

    const [content, setContent] = useState({
      logoUrl: '',
      contactEmail: '',
      contactPhone: '',
      officeAddress: '',
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      siteName: ''
    });
  
    useEffect(() => {
      const fetchContent = async () => {
        try {
          const res = await axiosInstance.get('/content');
          if (res.data) {
            setContent(prev => ({ ...prev, ...res.data }));
          }
        } catch (error) {
          console.error("Failed to fetch footer content", error);
        }
      };
      fetchContent();
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axiosInstance.post('/content/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      <SEOHead title="Contact Us" description="Get in touch with CabBook support team." url="/contact" />
      
      {/* Header Section */}
      <section className="bg-black pt-32 pb-32 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-2xl mx-auto">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Form Section (Left) */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-8 tracking-tight">Send us a message</h2>
            
            {status === 'success' && (
              <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Message sent successfully! We will get back to you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Failed to send message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-black" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-black" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Message</label>
                <textarea 
                  required 
                  rows={5} 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-black resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'loading'} 
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-white font-bold bg-black hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-200 disabled:opacity-70 transition-all shadow-md"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiSend className="text-lg" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information Section (Right) */}
          <div className="space-y-6 lg:pl-4">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-6 hover:border-black transition-colors duration-300">
              <div className="bg-black text-white p-4 rounded-xl flex-shrink-0">
                <FiPhone className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-black text-lg tracking-tight">Phone</h3>
                <p className="text-gray-500 font-medium mt-1">{content.contactPhone}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-6 hover:border-black transition-colors duration-300">
              <div className="bg-black text-white p-4 rounded-xl flex-shrink-0">
                <FiMail className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-black text-lg tracking-tight">Email</h3>
                <p className="text-gray-500 font-medium mt-1">{content.contactEmail}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-6 hover:border-black transition-colors duration-300">
              <div className="bg-black text-white p-4 rounded-xl flex-shrink-0">
                <FiMapPin className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-black text-lg tracking-tight">Address</h3>
                <p className="text-gray-500 font-medium mt-1">{content.officeAddress}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;