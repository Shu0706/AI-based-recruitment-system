import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('First name is required')
      .max(50, 'First name must be at most 50 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .max(50, 'Last name must be at most 50 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string()
      .required('Role is required')
      .oneOf(['user', 'admin'], 'Invalid role'),
  });

  // Initial form values
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setIsLoading(true);
      
      // Remove confirmPassword from values
      const { confirmPassword, ...userData } = values;
      
      const response = await register(userData);
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Set form error
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        setErrors({ email: 'Email already in use' });
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold text-center mb-6 text-gray-900">Create your account</h3>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  />
                  <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  />
                  <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
            </div>

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
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account type
              </label>
              <div className="mt-1">
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.role && errors.role ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                >
                  <option value="user">Job Seeker</option>
                  <option value="admin">Recruiter/HR</option>
                </Field>
                <ErrorMessage name="role" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
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
            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
