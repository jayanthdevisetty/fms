import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('fms_token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('fms_user') || 'null'));
  const [booting, setBooting] = useState(false);

  const login = async (credentials) => {
    setBooting(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('fms_token', data.token);
      localStorage.setItem('fms_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setBooting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fms_token');
    localStorage.removeItem('fms_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, isAuthenticated: Boolean(token), login, logout, booting }), [token, user, booting]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
