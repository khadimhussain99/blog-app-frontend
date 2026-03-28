import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/auth';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        try {
          const { data } = await getMe();
          setUser(data.user);
        } catch {
          if (refreshToken) {
            await tryRefresh(refreshToken);
          } else {
            clearAuth();
          }
        }
      } else if (refreshToken) {
        await tryRefresh(refreshToken);
      } else {
        clearAuth();
      }

      setLoading(false);
    };

    const tryRefresh = async (refreshToken) => {
      try {
        const { data } = await axios.post(
          'http://localhost:3001/api/auth/refresh',
          { refreshToken }
        );

        localStorage.setItem('accessToken', data.accessToken);
        setToken(data.accessToken);

        const { data: meData } = await getMe();
        setUser(meData.user);
      } catch {
        clearAuth();
      }
    };

    const clearAuth = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    };

    initAuth();
  }, []);

  const login = useCallback((userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};