import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  touched,
  className = '',
  labelClassName = '',
  inputClassName = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const hasError = error && touched;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${inputClassName}
        `}
        {...props}
      />
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
