import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../lib/auth';
import Login from '../pages/login';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock fetch API
global.fetch = jest.fn();

describe('Login Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock router
    useRouter.mockReturnValue({
      push: jest.fn()
    });
    
    // Mock fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        token: 'mock-token',
        user: { id: 'user1', username: 'testuser' }
      })
    });
  });
  
  test('renders login form correctly', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/create a new account/i)).toBeInTheDocument();
  });
  
  test('handles form submission correctly', async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that fetch was called with correct arguments
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      });
    });
    
    // Check that router.push was called to redirect to dashboard
    const router = useRouter();
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  test('displays error message on login failure', async () => {
    // Mock fetch to return error
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      })
    });
    
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
  
  test('redirects to dashboard if user is already logged in', async () => {
    // Create a custom AuthProvider that returns a logged-in user
    const CustomAuthProvider = ({ children }) => {
      const authValue = {
        user: { id: 'user1', username: 'testuser' },
        loading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        clearError: jest.fn()
      };
      
      return (
        <AuthProvider value={authValue}>
          {children}
        </AuthProvider>
      );
    };
    
    render(
      <CustomAuthProvider>
        <Login />
      </CustomAuthProvider>
    );
    
    const router = useRouter();
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
