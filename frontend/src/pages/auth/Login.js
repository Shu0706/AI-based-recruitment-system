import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setIsLoading(true);
      const response = await login(values.email, values.password);
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      
      // Set form error
      if (error.response?.status === 401) {
        setErrors({ password: 'Invalid email or password' });
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-center mb-6 text-gray-900">Sign in to your account</h3>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/register"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create new account
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
