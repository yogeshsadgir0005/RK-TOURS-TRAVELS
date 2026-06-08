import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const RoutePage = lazy(() => import('./pages/RoutePage'));
const CityPage = lazy(() => import('./pages/CityPage'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const CabDetails = lazy(() => import('./pages/CabDetails'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* MNC-Style Notification Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0"> {/* Padding bottom for mobile BottomNav */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              {/* Protected from Logged-in users */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cab/:id" element={<CabDetails />} />
              <Route path="/city/:citySlug" element={<CityPage />} />
              <Route path="/cabs/:routeSlug" element={<RoutePage />} />
              <Route path="/book" element={<BookingPage />} />
              
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;