import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import PasswordStrengthIndicator from '../../components/ui/PasswordStrengthIndicator';

const Register = () => {
  const [registerError, setRegisterError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Enhanced registration validation schema
  const registerSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
    
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
    
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'),
    
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
      ),
    
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    
    role: Yup.string()
      .required('Please select a role')
      .oneOf(['user', 'admin'], 'Invalid role'),
    
    phone: Yup.string()
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
    
    location: Yup.string()
      .optional()
      .max(100, 'Location cannot exceed 100 characters'),
    
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
  });

  // Handle registration form submission with better error handling
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsLoading(true);
      setRegisterError(null);
      
      const { confirmPassword, agreeToTerms, ...userData } = values;
      
      const response = await register(userData);
      
      // Show success message
      console.log('Registration successful:', response);
      
      // Redirect based on user role
      if (response.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      // First try to get errors from the response data
      if (error.response?.data?.errors) {
        // Handle validation errors from express-validator
        const errors = error.response.data.errors;
        errors.forEach(err => {
          if (err.field || err.param) {
            setFieldError(err.field || err.param, err.message || err.msg);
          }
        });
      } else {
        // Handle general error messages
        const errorMessage = error.message || 
                           error.response?.data?.message || 
                           'Registration failed. Please try again.';
        setRegisterError(errorMessage);
      }
    } finally {
      setIsLoading(false);
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
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          phone: '',
          location: '',
          agreeToTerms: false
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  className={`mt-1 form-input ${errors.firstName && touched.firstName ? 'border-red-500' : ''}`}
                  placeholder="Enter your first name"
                />
                <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <Field
                  type="text"
                  name="lastName"
                  id="lastName"
                  className={`mt-1 form-input ${errors.lastName && touched.lastName ? 'border-red-500' : ''}`}
                  placeholder="Enter your last name"
                />
                <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className={`mt-1 form-input ${errors.email && touched.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
              <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`mt-1 form-input ${errors.password && touched.password ? 'border-red-500' : ''}`}
                placeholder="Create a strong password"
              />
              <PasswordStrengthIndicator password={values.password} />
              <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number (optional)
                </label>
                <Field
                  type="tel"
                  name="phone"
                  id="phone"
                  className={`mt-1 form-input ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                />
                <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location (optional)
                </label>
                <Field
                  type="text"
                  name="location"
                  id="location"
                  className={`mt-1 form-input ${errors.location && touched.location ? 'border-red-500' : ''}`}
                  placeholder="Enter your location"
                />
                <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Register as *
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
                  I agree to the <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link> *
                </label>
                <ErrorMessage name="agreeToTerms" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <span className="flex justify-center items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
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
