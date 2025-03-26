import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load user from local storage on initial load
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return false;
      }

      setUser(data.user);
      setLoading(false);
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return false;
      }

      setUser(data.user);
      setLoading(false);
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUser(null);
      localStorage.removeItem('token');
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setUser(null);
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      setUser(data.data);
      setLoading(false);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return false;
      }

      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Update failed');
        setLoading(false);
        return false;
      }

      setUser(data.data);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      return false;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
