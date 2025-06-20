import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [tokenValid, setTokenValid] = useState(null);
  const [resetComplete, setResetComplete] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  // Check token validity
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`/api/auth/reset-password/${token}`);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        toast.error('Invalid or expired reset token');
      }
    };

    verifyToken();
  }, [token]);

  // Reset password validation schema
  const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  // Handle reset password form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(`/api/auth/reset-password/${token}`, {
        password: values.password
      });
      
      setResetComplete(true);
      toast.success('Password has been reset successfully');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Verifying your reset link</h3>
        <p className="text-sm text-gray-500 mt-2">Please wait while we verify your reset token...</p>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Invalid or expired link</h3>
        <p className="text-sm text-gray-500 mt-2">This password reset link is invalid or has expired.</p>
        <div className="mt-6">
          <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Password reset successful</h3>
        <p className="text-sm text-gray-500 mt-2">Your password has been reset successfully. You'll be redirected to login in a few seconds.</p>
        <div className="mt-6">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Reset your password</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Please create a new password for your account.
      </p>

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`mt-1 form-input ${errors.password && touched.password ? 'border-red-500' : ''}`}
                placeholder="Create a new password"
              />
              <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`mt-1 form-input ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your new password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
              >
                {isSubmitting ? (
                  <span className="flex justify-center items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting password...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
