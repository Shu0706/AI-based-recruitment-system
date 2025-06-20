import { useState, createContext, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Context Providers
import { AuthProvider } from './context/AuthContext'

// Layouts
import AuthLayout from './components/layouts/AuthLayout'
import AdminLayout from './components/layouts/AdminLayout'
import UserLayout from './components/layouts/UserLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import JobManagement from './pages/admin/JobManagement'
import CreateJob from './pages/admin/CreateJob'
import EditJob from './pages/admin/EditJob'
import CandidateMatching from './pages/admin/CandidateMatching'
import InterviewScheduling from './pages/admin/InterviewScheduling'

// User Pages
import UserDashboard from './pages/user/Dashboard'
import JobSearch from './pages/user/JobSearch'
import JobDetails from './pages/user/JobDetails'
import ApplicationStatus from './pages/user/ApplicationStatus'
import UserProfile from './pages/user/UserProfile'
import InterviewDetails from './pages/user/InterviewDetails'

// Resume Components
import ResumeUpload from './components/resume/ResumeUpload'
import ResumeAnalysis from './components/resume/ResumeAnalysis'

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
          <Route path="interviews" element={<InterviewScheduling />} />
          <Route path="interviews/:id" element={<InterviewDetails />} />
        </Route>

        {/* User Routes */}
        <Route path="/" element={<ProtectedRoute element={<UserLayout />} role="user" />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="jobs" element={<JobSearch />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="applications/status" element={<ApplicationStatus />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="interviews/:id" element={<InterviewDetails />} />
          <Route path="resume/upload" element={<ResumeUpload />} />
          <Route path="resume/analysis" element={<ResumeAnalysis />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App;
