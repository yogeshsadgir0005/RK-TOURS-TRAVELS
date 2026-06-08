import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Footer = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [siteName, setSiteName] = useState('RK Tours & Travels');

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axiosInstance.get('/content');
        if (res.data.logoUrl) setLogoUrl(res.data.logoUrl);
        if (res.data.siteName) setSiteName(res.data.siteName);
      } catch (err) {
        console.error("Branding fetch failed", err);
      }
    };
    fetchBranding();
  }, []);

  return (
    <footer className="bg-black text-white relative overflow-hidden pt-32 pb-16">
      {/* SaaS Glowing Aurora Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-white/10 to-transparent blur-[120px] rounded-full pointer-events-none opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group inline-flex">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain rounded-[10px] transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black text-2xl shadow-[var(--shadow-saas-inner)] group-hover:scale-105 transition-transform duration-300">
                  {siteName.charAt(0)}
                </div>
              )}
              <span className="font-extrabold text-2xl tracking-tighter text-white">
                {siteName}
              </span>
            </Link>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
              The premier SaaS platform for booking outstation cabs and intercity travel across India. Fast, reliable, and absolutely uncompromising on quality.
            </p>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Contact</Link></li>
              <li><Link to="/careers" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Terms of Service</Link></li>
              <li><Link to="/cancellation" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Cancellation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="text-gray-400 text-sm">support@rktours.com</li>
              <li className="text-gray-400 text-sm">+91 99999 99999</li>
              <li className="text-gray-400 text-sm mt-4">
                Pune, Maharashtra<br/>India 411001
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} RK Tours & Travels. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-gray-500 text-sm">Powered by SaaS Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;