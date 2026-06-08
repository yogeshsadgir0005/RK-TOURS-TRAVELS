import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const BrandingContext = createContext();

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [siteName, setSiteName] = useState('RK Tours & Travels');
  const [contentData, setContentData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axiosInstance.get('/content');
        if (res.data.logoUrl) setLogoUrl(res.data.logoUrl);
        if (res.data.siteName) setSiteName(res.data.siteName);
        setContentData(res.data);
      } catch (err) {
        console.error("Branding fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranding();
  }, []);

  return (
    <BrandingContext.Provider value={{ logoUrl, siteName, contentData, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
};
