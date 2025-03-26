import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../lib/auth';
import Register from '../pages/register';
import { useRouter } from 'next/router';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock fetch API
global.fetch = jest.fn();

describe('Register Component', () => {
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
        user: { id: 'user1', username: 'newuser' }
      })
    });
  });
  
  test('renders registration form correctly', () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );
    
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/sign in to your existing account/i)).toBeInTheDocument();
  });
  
  test('validates form inputs correctly', async () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );
    
    // Submit with empty form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    // Fill with invalid data
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'ab' } // Too short
    });
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalid-email' } // Invalid format
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '12345' } // Too short
    });
    
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: '123456' } // Doesn't match
    });
    
    // Submit with invalid data
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
  
  test('handles successful registration', async () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newuser' }
    });
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'newuser@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check that fetch was called with correct arguments
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'newuser',
          email: 'newuser@example.com',
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
  
  test('displays error message on registration failure', async () => {
    // Mock fetch to return error
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        success: false,
        error: 'User already exists'
      })
    });
    
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'existinguser' }
    });
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'existing@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });
});
