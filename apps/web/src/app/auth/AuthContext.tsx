import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction, isAuthenticatedAction } from '@web/app/auth/login/login.service';
import { LoginFormError } from '@web/app/common/form-error.interface';
import { logoutAction } from '@web/app/auth/logout/logout.service';

interface AuthContextType {
  login: (formData: FormData) => Promise<LoginFormError | null>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderNew: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const rehydrateAuth = async () => {
      const isAuthenticated = await isAuthenticatedAction();
      setLoading(false);
      setIsAuthenticated(isAuthenticated);
    };
    rehydrateAuth();
  }, []);

  const login = async (formData: FormData): Promise<LoginFormError | null> => {
    setLoading(true);
    const loginError = await loginAction(formData);
    if (loginError) {
      setLoading(false);
      return loginError;
    }
    setIsAuthenticated(true);
    setLoading(false);
    return null;
  };

  const logout = async () => {
    setLoading(true);

    await logoutAction();
    setIsAuthenticated(false);
    router.push('/');

    setLoading(false);
  };

  return <AuthContext.Provider value={{ login, logout, loading, isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
