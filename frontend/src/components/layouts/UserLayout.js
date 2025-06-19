import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon, 
  CalendarIcon, 
  UserIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Job Search', path: '/jobs', icon: BriefcaseIcon },
    { name: 'My Resume', path: '/resume', icon: DocumentTextIcon },
    { name: 'My Applications', path: '/applications', icon: ClipboardDocumentCheckIcon },
    { name: 'My Interviews', path: '/interviews', icon: CalendarIcon },
    { name: 'My Profile', path: '/profile', icon: UserIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 m-4">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="p-5">
          <h1 className="text-xl font-bold mb-6">AI Recruitment</h1>
          <nav className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  isActive ? "nav-link-active flex items-center space-x-3 mb-2" : "nav-link flex items-center space-x-3 mb-2"
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            <button 
              onClick={handleLogout}
              className="nav-link flex items-center space-x-3 mt-8 w-full text-left text-red-500 hover:text-red-600"
            >
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Header */}
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'User'}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full border-2 border-blue-500"
                src={user?.avatar || 'https://via.placeholder.com/40'}
                alt="User avatar"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default UserLayout;
