import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';

const withAdminAuth = (WrappedComponent) => {
  const AdminComponent = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If not loading and no user, redirect to login
      if (!loading && !user) {
        router.replace('/login');
        return;
      }
      
      // If user is not an admin, redirect to dashboard
      if (!loading && user && user.role !== 'admin') {
        router.replace('/dashboard');
      }
    }, [loading, user, router]);

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <svg className="animate-spin mx-auto h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // If authenticated and admin, render the component
    if (user && user.role === 'admin') {
      return <WrappedComponent {...props} />;
    }

    // Return null while redirecting
    return null;
  };

  return AdminComponent;
};

export default withAdminAuth;
