import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SectionErrorBoundary from '../../../components/error/SectionErrorBoundary';

// Create a component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error');
};

// Mock console.error to prevent test output noise
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('SectionErrorBoundary Component', () => {
  test('renders children when no error occurs', () => {
    render(
      <SectionErrorBoundary sectionName="Test Section">
        <div>Test Content</div>
      </SectionErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('renders fallback UI when error occurs', () => {
    // We need to suppress the React error boundary warning in the test
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    
    render(
      <SectionErrorBoundary sectionName="Test Section">
        <ErrorComponent />
      </SectionErrorBoundary>
    );
    
    expect(screen.getByText('Test Section section could not be loaded')).toBeInTheDocument();
    expect(screen.getByText(/We're having trouble displaying this content/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    
    spy.mockRestore();
  });
  
  test('resets error state when "Try Again" button is clicked', async () => {
    // We need a component that can toggle between error and non-error state
    const ToggleErrorComponent = ({ shouldError }: { shouldError: boolean }) => {
      if (shouldError) {
        throw new Error('Test error');
      }
      return <div>No Error</div>;
    };
    
    // We need to control the shouldError prop from outside the error boundary
    let shouldError = true;
    
    const TestComponent = () => (
      <SectionErrorBoundary sectionName="Test Section">
        <ToggleErrorComponent shouldError={shouldError} />
      </SectionErrorBoundary>
    );
    
    // We need to suppress the React error boundary warning in the test
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    
    const { rerender } = render(<TestComponent />);
    
    // Verify error state is shown
    expect(screen.getByText('Test Section section could not be loaded')).toBeInTheDocument();
    
    // Set up for no error on next render
    shouldError = false;
    
    // Click the "Try Again" button
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Try Again/i }));
    
    // Rerender with the new shouldError value
    rerender(<TestComponent />);
    
    // Verify the component now shows the non-error content
    expect(screen.getByText('No Error')).toBeInTheDocument();
    
    spy.mockRestore();
  });
});