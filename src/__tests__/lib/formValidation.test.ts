import { renderHook, act } from '@testing-library/react';
import {
  validationRules,
  validateField,
  validateForm,
  useFormValidation,
} from '../../lib/formValidation';

describe('Form Validation Utilities', () => {
  describe('validationRules', () => {
    test('required rule validates correctly', () => {
      expect(validationRules.required('')).toBe('This field is required');
      expect(validationRules.required('  ')).toBe('This field is required');
      expect(validationRules.required(null)).toBe('This field is required');
      expect(validationRules.required(undefined)).toBe('This field is required');
      expect(validationRules.required('value')).toBe('');
      expect(validationRules.required(0)).toBe('');
      expect(validationRules.required(false)).toBe('');
    });

    test('email rule validates correctly', () => {
      expect(validationRules.email('invalid')).toBe('Please enter a valid email address');
      expect(validationRules.email('invalid@')).toBe('Please enter a valid email address');
      expect(validationRules.email('invalid@domain')).toBe('Please enter a valid email address');
      expect(validationRules.email('valid@domain.com')).toBe('');
      expect(validationRules.email('')).toBe('');
    });

    test('minLength rule validates correctly', () => {
      const minLength5 = validationRules.minLength(5);
      expect(minLength5('1234')).toBe('Must be at least 5 characters');
      expect(minLength5('12345')).toBe('');
      expect(minLength5('123456')).toBe('');
      expect(minLength5('')).toBe('');
    });

    test('maxLength rule validates correctly', () => {
      const maxLength5 = validationRules.maxLength(5);
      expect(maxLength5('123456')).toBe('Must be no more than 5 characters');
      expect(maxLength5('12345')).toBe('');
      expect(maxLength5('1234')).toBe('');
      expect(maxLength5('')).toBe('');
    });

    test('url rule validates correctly', () => {
      expect(validationRules.url('invalid')).toBe('Please enter a valid URL');
      expect(validationRules.url('http://example.com')).toBe('');
      expect(validationRules.url('https://example.com/path?query=value')).toBe('');
      expect(validationRules.url('')).toBe('');
    });

    test('numeric rule validates correctly', () => {
      expect(validationRules.numeric('123')).toBe('');
      expect(validationRules.numeric('abc')).toBe('Please enter a valid number');
      expect(validationRules.numeric('123abc')).toBe('Please enter a valid number');
      expect(validationRules.numeric('')).toBe('');
    });

    test('alphanumeric rule validates correctly', () => {
      expect(validationRules.alphanumeric('abc123')).toBe('');
      expect(validationRules.alphanumeric('abc-123')).toBe('Please use only letters and numbers');
      expect(validationRules.alphanumeric('abc 123')).toBe('Please use only letters and numbers');
      expect(validationRules.alphanumeric('')).toBe('');
    });

    test('password rule validates correctly', () => {
      expect(validationRules.password('weak')).toBe('Password must be at least 8 characters');
      expect(validationRules.password('weakpassword')).toBe('Password must include an uppercase letter');
      expect(validationRules.password('WEAKPASSWORD')).toBe('Password must include a lowercase letter');
      expect(validationRules.password('WeakPassword')).toBe('Password must include a number');
      expect(validationRules.password('WeakPassword1')).toBe('Password must include a special character');
      expect(validationRules.password('StrongPassword1!')).toBe('');
      expect(validationRules.password('')).toBe('');
    });

    test('match rule validates correctly', () => {
      const matchPassword = validationRules.match('password', 'Password');
      expect(matchPassword('password123', { password: 'password123' })).toBe('');
      expect(matchPassword('password', { password: 'password123' })).toBe('Must match Password');
      expect(matchPassword('', { password: 'password123' })).toBe('');
    });
  });

  describe('validateField', () => {
    test('validates field against multiple rules', () => {
      const validations = [
        validationRules.required,
        validationRules.email,
      ];

      expect(validateField('', validations)).toBe('This field is required');
      expect(validateField('invalid', validations)).toBe('Please enter a valid email address');
      expect(validateField('valid@example.com', validations)).toBe('');
    });

    test('stops at first validation error', () => {
      const validations = [
        validationRules.required,
        validationRules.email,
      ];

      expect(validateField('', validations)).toBe('This field is required');
      // It should not reach the email validation for empty string
    });
  });

  describe('validateForm', () => {
    test('validates multiple form fields', () => {
      const values = {
        name: '',
        email: 'invalid',
        password: 'weak',
      };

      const validationSchema = {
        name: [validationRules.required],
        email: [validationRules.required, validationRules.email],
        password: [validationRules.required, validationRules.password],
      };

      const errors = validateForm(values, validationSchema);

      expect(errors.name).toBe('This field is required');
      expect(errors.email).toBe('Please enter a valid email address');
      expect(errors.password).toBe('Password must be at least 8 characters');
    });

    test('returns empty object when all validations pass', () => {
      const values = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongPassword1!',
      };

      const validationSchema = {
        name: [validationRules.required],
        email: [validationRules.required, validationRules.email],
        password: [validationRules.required, validationRules.password],
      };

      const errors = validateForm(values, validationSchema);

      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('useFormValidation hook', () => {
    test('initializes with provided values', () => {
      const initialValues = { name: '', email: '' };
      const validationSchema = {
        name: [validationRules.required],
        email: [validationRules.required, validationRules.email],
      };

      const { result } = renderHook(() => useFormValidation(initialValues, validationSchema));

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    test('handles input changes', () => {
      const initialValues = { name: '', email: '' };
      const validationSchema = {
        name: [validationRules.required],
        email: [validationRules.required, validationRules.email],
      };

      const { result } = renderHook(() => useFormValidation(initialValues, validationSchema));

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.values.name).toBe('John Doe');
    });

    test('validates on blur', () => {
      const initialValues = { name: '', email: '' };
      const validationSchema = {
        name: [validationRules.required],
        email: [validationRules.required, validationRules.email],
      };

      const { result } = renderHook(() => useFormValidation(initialValues, validationSchema));

      act(() => {
        result.current.handleBlur({
          target: { name: 'name' },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.touched.name).toBe(true);
      expect(result.current.errors.name).toBe('This field is required');
    });

    test('validates all fields', () => {
      const initialValues = { name: '', email: 'invalid' };
      const validationSchema = {
        name: [validationRules.required],
        email: [validationRules.required, validationRules.email],
      };

      const { result } = renderHook(() => useFormValidation(initialValues, validationSchema));

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateAll();
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.name).toBe('This field is required');
      expect(result.current.errors.email).toBe('Please enter a valid email address');
      expect(result.current.touched.name).toBe(true);
      expect(result.current.touched.email).toBe(true);
    });

    test('resets form state', () => {
      const initialValues = { name: '', email: '' };
      const validationSchema = {
        name: [validationRules.required],
        email: [validationRules.required, validationRules.email],
      };

      const { result } = renderHook(() => useFormValidation(initialValues, validationSchema));

      // Change values and validate to create errors and touched state
      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.validateAll();
      });

      // Reset the form
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });
});