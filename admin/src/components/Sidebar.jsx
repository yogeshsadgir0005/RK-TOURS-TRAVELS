import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Cabs', path: '/cabs' },
    { name: 'Routes', path: '/routes' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Reviews', path: '/testimonials' },
    { name: 'Users', path: '/users' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsOpen(false)}></div>
      )}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-800">
          <span className="text-2xl font-extrabold text-blue-500">Admin Panel</span>
        </div>
        <nav className="mt-5 px-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;