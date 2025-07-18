import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from '../../../components/ui/FormInput';

describe('FormInput Component', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'testInput',
    label: 'Test Input',
    value: '',
    onChange: jest.fn(),
  };

  test('renders with label and input', () => {
    render(<FormInput {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('shows required indicator when required prop is true', () => {
    render(<FormInput {...defaultProps} required />);
    
    const label = screen.getByText('*');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-red-500');
  });

  test('shows error message when touched and error props are provided', () => {
    render(
      <FormInput 
        {...defaultProps} 
        touched={true} 
        error="This field is required" 
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'test-input-error');
  });

  test('does not show error message when not touched', () => {
    render(
      <FormInput 
        {...defaultProps} 
        touched={false} 
        error="This field is required" 
      />
    );
    
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  test('calls onChange handler when input value changes', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    
    render(<FormInput {...defaultProps} onChange={onChange} />);
    
    await user.type(screen.getByRole('textbox'), 'test value');
    expect(onChange).toHaveBeenCalled();
  });

  test('calls onBlur handler when input loses focus', async () => {
    const onBlur = jest.fn();
    const user = userEvent.setup();
    
    render(<FormInput {...defaultProps} onBlur={onBlur} />);
    
    await user.click(screen.getByRole('textbox'));
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  test('applies disabled styles when disabled prop is true', () => {
    render(<FormInput {...defaultProps} disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100');
    expect(input).toHaveClass('cursor-not-allowed');
  });

  test('renders different input types correctly', () => {
    render(<FormInput {...defaultProps} type="password" />);
    
    expect(screen.getByLabelText('Test Input')).toHaveAttribute('type', 'password');
  });
});