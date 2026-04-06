import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import RoutePage from './pages/RoutePage';
import CityPage from './pages/CityPage';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SearchResults from './pages/SearchResults';
import CabDetails from './pages/CabDetails';
import BookingPage from './pages/BookingPage';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* MNC-Style Notification Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Navbar />
      <main className="flex-grow">
        <Routes>
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
      </main>
      <Footer />
    </div>
  );
}

export default App;