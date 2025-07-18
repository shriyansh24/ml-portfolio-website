import React from 'react';

interface FormTextareaProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

/**
 * Reusable form textarea component with error handling
 */
const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
}) => {
  // Show error only if the field has been touched and there is an error
  const showError = touched && error;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${id}-error` : undefined}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0
          ${showError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
        `}
      />
      {showError && (
        <p 
          id={`${id}-error`} 
          className="mt-1 text-sm text-red-600 animate-fadeIn"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;