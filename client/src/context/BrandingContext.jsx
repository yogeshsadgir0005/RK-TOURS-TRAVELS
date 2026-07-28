/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';

const BrandingContext = createContext();

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children }) => {
  const logoUrl = '/RK1.png';
  const siteName = 'RK TOURS & TRAVELS';
  const contentData = {
    contactAddress: "Mathura residency\nMurlidhar Vyas Colony, Prashant Nagar, Pathardi Phata, Nasik, Nashik, Maharashtra 422010",
    contactPhone: '+91 9130899368',
    contactEmail: 'support@rktours.com',
  };

  return (
    <BrandingContext.Provider value={{ logoUrl, siteName, contentData, isLoading: false }}>
      {children}
    </BrandingContext.Provider>
  );
};