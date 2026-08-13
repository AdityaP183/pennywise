import { createContext, useContext, useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user details if valid session exists
  const checkSession = async () => {
    try {
      setIsLoading(true);
      const userData = await api.get('/users/me');
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      // Fail silently for session checks
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    // Listen for forced logouts from the api fetch client
    const handleForcedLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-logout', handleForcedLogout);
    return () => {
      window.removeEventListener('auth-logout', handleForcedLogout);
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const loggedUser = await api.post('/auth/login', { email, password });
      setUser(loggedUser);
      setIsAuthenticated(true);
      return loggedUser;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setError(null);
    try {
      const registeredUser = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      return registeredUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (firstName, lastName) => {
    try {
      const updatedUser = await api.patch('/users/me', { firstName, lastName });
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
    } catch (err) {
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
