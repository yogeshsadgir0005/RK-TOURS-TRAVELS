import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const BrandingContext = createContext();

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState('/RK1.png');
  const [siteName, setSiteName] = useState('RK TOURS & TRAVELS');
  const [contentData, setContentData] = useState({
    contactAddress: "Pune, Maharashtra\nIndia 411001",
    contactPhone: "+91 99999 99999",
    contactEmail: "support@rktours.com"
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BrandingContext.Provider value={{ logoUrl, siteName, contentData, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
};
