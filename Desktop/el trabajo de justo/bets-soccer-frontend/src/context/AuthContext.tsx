import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

interface User {
  id: number;
  username: string;
  email: string;
  points: number;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const { value: storedUser } = await Preferences.get({ key: 'user' });
      const { value: storedToken } = await Preferences.get({ key: 'token' });

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Error loading auth from storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    await Preferences.set({ key: 'user', value: JSON.stringify(newUser) });
    await Preferences.set({ key: 'token', value: newToken });
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await Preferences.remove({ key: 'user' });
    await Preferences.remove({ key: 'token' });
  };

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await Preferences.set({ key: 'user', value: JSON.stringify(updatedUser) });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!token, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
