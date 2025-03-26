import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../lib/auth';
import withAuth from '../lib/withAuth';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Create a test component to wrap with withAuth
const TestComponent = () => <div>Protected Content</div>;
const ProtectedComponent = withAuth(TestComponent);

describe('withAuth Higher-Order Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock router
    useRouter.mockReturnValue({
      replace: jest.fn()
    });
  });
  
  test('redirects to login when user is not authenticated', async () => {
    // Create a custom AuthProvider that returns no user
    const CustomAuthProvider = ({ children }) => {
      const authValue = {
        user: null,
        loading: false,
        error: null
      };
      
      return (
        <AuthProvider value={authValue}>
          {children}
        </AuthProvider>
      );
    };
    
    render(
      <CustomAuthProvider>
        <ProtectedComponent />
      </CustomAuthProvider>
    );
    
    // Check that the protected content is not rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    
    // Check that router.replace was called to redirect to login
    const router = useRouter();
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/login');
    });
  });
  
  test('shows loading state while checking authentication', () => {
    // Create a custom AuthProvider that returns loading state
    const CustomAuthProvider = ({ children }) => {
      const authValue = {
        user: null,
        loading: true,
        error: null
      };
      
      return (
        <AuthProvider value={authValue}>
          {children}
        </AuthProvider>
      );
    };
    
    render(
      <CustomAuthProvider>
        <ProtectedComponent />
      </CustomAuthProvider>
    );
    
    // Check that loading indicator is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Check that the protected content is not rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
  
  test('renders protected component when user is authenticated', () => {
    // Create a custom AuthProvider that returns an authenticated user
    const CustomAuthProvider = ({ children }) => {
      const authValue = {
        user: { id: 'user1', username: 'testuser' },
        loading: false,
        error: null
      };
      
      return (
        <AuthProvider value={authValue}>
          {children}
        </AuthProvider>
      );
    };
    
    render(
      <CustomAuthProvider>
        <ProtectedComponent />
      </CustomAuthProvider>
    );
    
    // Check that the protected content is rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
