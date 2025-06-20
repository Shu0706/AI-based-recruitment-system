import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo.svg"
            alt="AI Recruitment System"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          AI Recruitment System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Modern recruitment platform powered by artificial intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} AI Recruitment System. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link to="/privacy-policy" className="hover:text-gray-700">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-gray-700">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
