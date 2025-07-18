/**
 * Form validation utility functions
 */

/**
 * Validation rules for common form fields
 */
export const validationRules = {
  required: (value: any) => {
    if (value === undefined || value === null) return 'This field is required';
    if (typeof value === 'string' && value.trim() === '') return 'This field is required';
    return '';
  },
  
  email: (value: string) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email address';
  },
  
  minLength: (length: number) => (value: string) => {
    if (!value) return '';
    return value.length >= length ? '' : `Must be at least ${length} characters`;
  },
  
  maxLength: (length: number) => (value: string) => {
    if (!value) return '';
    return value.length <= length ? '' : `Must be no more than ${length} characters`;
  },
  
  url: (value: string) => {
    if (!value) return '';
    try {
      new URL(value);
      return '';
    } catch (e) {
      return 'Please enter a valid URL';
    }
  },
  
  numeric: (value: string) => {
    if (!value) return '';
    return /^\d+$/.test(value) ? '' : 'Please enter a valid number';
  },
  
  alphanumeric: (value: string) => {
    if (!value) return '';
    return /^[a-zA-Z0-9]+$/.test(value) ? '' : 'Please use only letters and numbers';
  },
  
  password: (value: string) => {
    if (!value) return '';
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasMinLength) return 'Password must be at least 8 characters';
    if (!hasUpperCase) return 'Password must include an uppercase letter';
    if (!hasLowerCase) return 'Password must include a lowercase letter';
    if (!hasNumber) return 'Password must include a number';
    if (!hasSpecialChar) return 'Password must include a special character';
    
    return '';
  },
  
  match: (field: string, fieldName: string) => (value: string, formValues: Record<string, any>) => {
    if (!value) return '';
    return value === formValues[field] ? '' : `Must match ${fieldName}`;
  }
};

/**
 * Validates a form field against a set of validation rules
 */
export function validateField(
  value: any, 
  validations: Array<(value: any, formValues?: Record<string, any>) => string>,
  formValues?: Record<string, any>
): string {
  for (const validation of validations) {
    const error = validation(value, formValues);
    if (error) return error;
  }
  return '';
}

/**
 * Validates an entire form against validation rules
 */
export function validateForm(
  values: Record<string, any>,
  validationSchema: Record<string, Array<(value: any, formValues?: Record<string, any>) => string>>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  Object.keys(validationSchema).forEach(field => {
    const fieldValidations = validationSchema[field];
    const error = validateField(values[field], fieldValidations, values);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
}

/**
 * Custom hook for form validation
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<string, Array<(value: any, formValues?: Record<string, any>) => string>>
) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    // Validate field on change if it's been touched
    if (touched[name]) {
      const fieldValidations = validationSchema[name] || [];
      const error = validateField(value, fieldValidations, values);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validate field on blur
    const fieldValidations = validationSchema[name] || [];
    const error = validateField(values[name], fieldValidations, values);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const validateAll = (): boolean => {
    const newErrors = validateForm(values, validationSchema);
    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };
  
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setValues
  };
}

// Add React import at the top
import React from 'react';