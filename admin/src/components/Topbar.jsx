import { useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { useLocation } from 'react-router-dom';

const Topbar = ({ setIsOpen }) => {
  const { admin, logout } = useContext(AdminAuthContext);
  const location = useLocation();
  const title = location.pathname.split('/')[1] || 'Dashboard';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button onClick={() => setIsOpen(true)} className="text-gray-500 focus:outline-none lg:hidden mr-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 capitalize">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Welcome, {admin?.name}</span>
          <button onClick={logout} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
export default Topbar;