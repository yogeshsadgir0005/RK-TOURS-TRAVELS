import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  // If user is already logged in, kick them to the home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;