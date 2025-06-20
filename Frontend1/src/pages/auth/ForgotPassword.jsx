import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  // Forgot password validation schema
  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  // Handle forgot password form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post('/api/auth/forgot-password', values);
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            We've sent password reset instructions to your email address. If you don't see it in your inbox, please check your spam folder.
          </p>
        </div>
        <div className="mt-6">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Reset your password</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className={`mt-1 form-input ${errors.email && touched.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
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
                    Sending...
                  </span>
                ) : (
                  'Send reset instructions'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
