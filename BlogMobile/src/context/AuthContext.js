import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);  


  useEffect(() => {
    checkStoredToken();
  }, []);

  const checkStoredToken = async () => {
    try {
      const token    = await AsyncStorage.getItem('access_token');
      const username = await AsyncStorage.getItem('username');
      if (token && username) {
        setUser({ username });
      }
    } catch (e) {
      console.log('Token check failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await api.post('/login/', { username, password });
    const { access, refresh } = response.data;

    await AsyncStorage.setItem('access_token',  access);
    await AsyncStorage.setItem('refresh_token', refresh);
    await AsyncStorage.setItem('username',      username);

    setUser({ username });
    return response;
  };

  const register = async (username, email, password) => {
    const response = await api.post('/register/', { username, email, password });
    return response;
  };

  const logout = async () => {
    try {
      const refresh = await AsyncStorage.getItem('refresh_token');
      await api.post('/logout/', { refresh });
    } catch (e) {
      console.log('Logout API error (still clearing locally):', e);
    } finally {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'username']);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);