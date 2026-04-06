import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import axiosInstance from '../utils/axiosInstance';

const Footer = () => {
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

  // Dynamically create the Google Maps Embed URL based on the text address
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(content.officeAddress || 'Mumbai, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <footer className="bg-black text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:pr-8">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              {content.logoUrl ? (
                <img src={content.logoUrl} alt="Brand Logo" className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className="text-white group-hover:scale-105 transition-transform">
                    <FaCar className="text-2xl" />
                  </div>
                </>
              )}

              
                <span className="font-bold text-lg text-white tracking-tight">{content.siteName}</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your trusted cab booking partner. Reliable, affordable, and comfortable rides across India.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-base font-medium text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h4 className="text-base font-medium text-white mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FiPhone className="text-white text-lg flex-shrink-0" />
                <a href={`tel:${content.contactPhone}`}>{content.contactPhone}</a>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors break-all">
                <FiMail className="text-white text-lg flex-shrink-0" />
                <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="text-white text-lg flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{content.officeAddress}</span>
              </li>
            </ul>
          </div>

          {/* Map Column */}
          <div>
            <h4 className="text-base font-medium text-white mb-6">Our Location</h4>
            <div className="w-full h-40 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-inner">
              <iframe 
                title="Google Map Location"
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} CabBook. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {content.facebookUrl && (
              <a href={content.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF className="text-lg" />
              </a>
            )}
            {content.twitterUrl && (
              <a href={content.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="text-lg" />
              </a>
            )}
            {content.instagramUrl && (
              <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram className="text-lg" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;