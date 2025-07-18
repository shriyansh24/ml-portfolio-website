import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer, ToastProvider, useToast } from '../../../components/ui/Toast';
import { act } from 'react-dom/test-utils';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Toast Component', () => {
  test('renders with correct message and type', () => {
    const onClose = jest.fn();
    render(
      <Toast id="test-id" type="success" message="Test message" onClose={onClose} />
    );
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Toast id="test-id" type="error" message="Error message" onClose={onClose} />
    );
    
    await user.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledWith('test-id');
  });

  test('automatically closes after duration', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    
    render(
      <Toast id="test-id" type="info" message="Info message" duration={1000} onClose={onClose} />
    );
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(onClose).toHaveBeenCalledWith('test-id');
    jest.useRealTimers();
  });
});

describe('ToastContainer Component', () => {
  test('renders with correct position class', () => {
    render(<ToastContainer position="bottom-left" />);
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('bottom-4');
    expect(container).toHaveClass('left-4');
  });

  test('adds and removes toasts', async () => {
    jest.useFakeTimers();
    
    render(<ToastContainer />);
    
    // Add toast via window.toast
    act(() => {
      (window as any).toast.success('Success message');
    });
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Toast should be removed after duration
    act(() => {
      jest.advanceTimersByTime(5000); // Default duration
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });
});

// Test component that uses the useToast hook
const TestComponent = () => {
  const toast = useToast();
  
  return (
    <div>
      <button onClick={() => toast.success('Success!')}>Show Success</button>
      <button onClick={() => toast.error('Error!')}>Show Error</button>
      <button onClick={() => toast.info('Info!')}>Show Info</button>
      <button onClick={() => toast.warning('Warning!')}>Show Warning</button>
    </div>
  );
};

describe('ToastProvider and useToast', () => {
  test('shows toasts when triggered via context', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await user.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success!')).toBeInTheDocument();
    
    await user.click(screen.getByText('Show Error'));
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});