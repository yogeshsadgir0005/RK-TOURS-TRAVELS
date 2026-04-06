import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);
  const location = useLocation();

  if (loading) return <Loader />;

  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
export default ProtectedRoute;