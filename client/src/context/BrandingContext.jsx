import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const BrandingContext = createContext();

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState('/RK1.png');
  const [siteName, setSiteName] = useState('RK TOURS & TRAVELS');
  const [contentData, setContentData] = useState({
    contactAddress: "Mathura residency\nMurlidhar Vyas Colony, Prashant Nagar, Pathardi Phata, Nasik, Nashik, Maharashtra 422010",
    contactPhone: "+91 9130899368",
    contactEmail: "support@rktours.com"
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BrandingContext.Provider value={{ logoUrl, siteName, contentData, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
};
