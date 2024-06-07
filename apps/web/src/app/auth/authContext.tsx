// src/app/auth/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginService } from '@web/app/auth/login/login.service';
import { LoginFormError } from '@web/app/common/form-error.interface';
import { HttpStatus } from '../constants/http-status';

interface AuthContextType {
  user: { id: string; username: string; createdAt: string; updatedAt: string } | null;
  loading: boolean;
  login: (formData: FormData) => Promise<LoginFormError | null>;
  logout: () => void;
  updateProfile: (newUsername: string) => Promise<void>; // Add updateProfile function to the context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; username: string; createdAt: string; updatedAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.status === HttpStatus.OK) {
        const data = await response.json();
        setUser({ id: data.id, username: data.username, createdAt: data.createdAt, updatedAt: data.updatedAt });
      } else if (response.status === HttpStatus.NO_CONTENT) {
        setUser(null);
      } else {
        console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("UNEXPECTED ERROR: couldn't fetch user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (formData: FormData): Promise<LoginFormError | null> => {
    setLoading(true);

    const loginError = await loginService(formData);
    if (loginError) {
      setLoading(false);
      return loginError;
    }

    await fetchUser();
    setLoading(false);
    return null;
  };

  const logout = async () => {
    await fetch('/api/auth/logout');
    setUser(null);
    router.push('/');
  };

  const updateProfile = async (newUsername: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, id: user.id }),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setUser(updatedProfile); // Update the user context with the new profile data
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
