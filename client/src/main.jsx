import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { BrandingProvider } from './context/BrandingContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);
// A production PWA build previously registered a service worker on localhost.
// Remove it in development so stale cached markup cannot replace the current UI.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  const cleanupKey = 'rk-dev-cache-cleaned';
  if (!sessionStorage.getItem(cleanupKey)) {
    Promise.all([
      navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister()))
      ),
      'caches' in window
        ? caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        : Promise.resolve(),
    ]).finally(() => {
      sessionStorage.setItem(cleanupKey, 'true');
      if (navigator.serviceWorker.controller) window.location.reload();
    });
  }
}
// Replace this with your actual Google Client ID from the Google Cloud Console
const GOOGLE_CLIENT_ID = "279223430401-pf2c47kud7s7b8fdivsl135l25q2m188.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <BrandingProvider>
            <AuthProvider>
              <ModalProvider>
                <App />
              </ModalProvider>
            </AuthProvider>
          </BrandingProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);