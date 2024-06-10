// src/app/auth/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@web/app/auth/login/login.service';
import { LoginFormError } from '@web/app/common/form-error.interface';
import { logoutAction } from '@web/app/auth/logout/logout.service';
import { updateProfileAction, getProfileAction } from '@web/app/auth/profile/profile.service';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';

interface AuthContextType {
  user: { id: string; username: string; createdAt: string; updatedAt: string } | null;
  loading: boolean;
  login: (formData: FormData) => Promise<LoginFormError | null>;
  logout: () => void;
  updateProfile: (newUsername: string) => Promise<ActionErrorResponse | void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; username: string; createdAt: string; updatedAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const data = await getProfileAction();
    if ('status' in data) {
      setUser(null);
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (formData: FormData): Promise<LoginFormError | null> => {
    setLoading(true);

    const loginError = await loginAction(formData);
    if (loginError) {
      setLoading(false);
      return loginError;
    }

    await fetchUser();
    setLoading(false);
    return null;
  };

  const logout = async () => {
    await logoutAction();
    setUser(null);
    router.push('/');
  };

  const updateProfile = async (newUsername: string) => {
    if (!user) return;

    const updateResponse = await updateProfileAction(newUsername);
    if ('status' in updateResponse) {
      return updateResponse;
    }

    setUser(updateResponse);
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
