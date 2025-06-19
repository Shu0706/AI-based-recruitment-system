import React from 'react';
import { Outlet } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          AI Recruitment System
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
