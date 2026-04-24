'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const cachedUser = localStorage.getItem('authUser');

    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser));
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    localStorage.setItem('accessToken', response.token);
    localStorage.setItem('authUser', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    localStorage.setItem('accessToken', response.token);
    localStorage.setItem('authUser', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
