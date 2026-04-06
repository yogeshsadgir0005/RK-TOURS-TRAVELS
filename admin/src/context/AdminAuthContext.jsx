import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      if (res.data.role === 'admin') {
        setAdmin(res.data);
      } else {
        throw new Error('Not authorized as admin');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      fetchAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    if (res.data.role !== 'admin') {
      throw new Error('Access denied. Admin only.');
    }
    localStorage.setItem('adminToken', res.data.token);
    setAdmin(res.data);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading, fetchAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};