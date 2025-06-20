import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [registerError, setRegisterError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Registration validation schema
  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Name is too short'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    role: Yup.string()
      .required('Please select a role')
      .oneOf(['user', 'admin'], 'Invalid role'),
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
  });
  // Handle registration form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setRegisterError(null);
      const { confirmPassword, agreeToTerms, name, ...userData } = values;
      
      // Split name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const registrationData = {
        ...userData,
        firstName,
        lastName
      };
      
      const user = await register(registrationData);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Create a new account</h2>
      
      {registerError && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{registerError}</p>
        </div>
      )}

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          agreeToTerms: false
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className={`mt-1 form-input ${errors.name && touched.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`mt-1 form-input ${errors.password && touched.password ? 'border-red-500' : ''}`}
                placeholder="Create a password"
              />
              <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`mt-1 form-input ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Register as
              </label>
              <Field
                as="select"
                name="role"
                id="role"
                className={`mt-1 form-input ${errors.role && touched.role ? 'border-red-500' : ''}`}
              >
                <option value="user">Job Seeker</option>
                <option value="admin">Employer / Recruiter</option>
              </Field>
              <ErrorMessage name="role" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Field
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                  I agree to the <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                </label>
                <ErrorMessage name="agreeToTerms" component="div" className="mt-1 text-sm text-red-600" />
              </div>
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
                    Creating account...
                  </span>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
