import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import JobManagement from './pages/admin/JobManagement';
import CreateJob from './pages/admin/CreateJob';
import EditJob from './pages/admin/EditJob';
import CandidateMatching from './pages/admin/CandidateMatching';
import CandidateDetails from './pages/admin/CandidateDetails';
import InterviewScheduling from './pages/admin/InterviewScheduling';
import AdminSettings from './pages/admin/Settings';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import JobSearch from './pages/user/JobSearch';
import JobDetails from './pages/user/JobDetails';
import ResumeManagement from './pages/user/ResumeManagement';
import ApplicationStatus from './pages/user/ApplicationStatus';
import UserProfile from './pages/user/Profile';
import UserSettings from './pages/user/Settings';
import Interviews from './pages/user/Interviews';

// Misc Pages
import NotFound from './pages/misc/NotFound';
import PrivacyPolicy from './pages/misc/PrivacyPolicy';
import TermsOfService from './pages/misc/TermsOfService';

// Protected Route Component
const ProtectedRoute = ({ element, role }) => {
  // This would normally use the auth context
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (role && userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'} />;
  }
  
  return element;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/edit/:id" element={<EditJob />} />
            <Route path="jobs/:id/candidates" element={<CandidateMatching />} />
            <Route path="candidates/:id" element={<CandidateDetails />} />
            <Route path="interviews" element={<InterviewScheduling />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* User Routes */}
          <Route path="/" element={<ProtectedRoute element={<UserLayout />} role="user" />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="jobs" element={<JobSearch />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="resume" element={<ResumeManagement />} />
            <Route path="applications" element={<ApplicationStatus />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Misc Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <ToastContainer position="top-right" autoClose={5000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
