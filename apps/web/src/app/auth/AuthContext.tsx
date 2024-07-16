import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginAction as defaultLoginAction,
  isAuthenticatedAction as defaultIsAuthenticatedAction,
  getRolesAction as defaultGetRolesAction,
} from '@web/app/auth/login/login.service';
import { logoutAction as defaultLogoutAction } from '@web/app/auth/logout/logout.service';
import { Role } from './role.enum';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';
import { ActionResponse } from '@web/app/common/action-response.type';
import { useServerAction } from '@web/app/utils/server-action.use';

export interface AuthContextInterface {
  login: (formData: LoginUserDto) => Promise<ActionResponse<null, LoginUserDto>>;
  logout: () => void;
  /**
   * Indicates whether the user is authenticated.
   * Initially undefined as we don't know the authentication status,
   * then it can be either true (authenticated) or false (not authenticated).
   */
  isAuthenticated: boolean | undefined;
  roles: Role[];
  loading: boolean;
}

export interface AuthProviderDependencies {
  loginAction?: typeof defaultLoginAction;
  logoutAction?: typeof defaultLogoutAction;
  isAuthenticatedAction?: typeof defaultIsAuthenticatedAction;
  getRolesAction?: typeof defaultGetRolesAction;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<AuthProviderDependencies>> = ({
  children,
  loginAction = defaultLoginAction,
  logoutAction = defaultLogoutAction,
  isAuthenticatedAction = defaultIsAuthenticatedAction,
  getRolesAction = defaultGetRolesAction,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loginPending, loginActionM] = useServerAction(loginAction);
  const [logoutPending, logoutActionM] = useServerAction(logoutAction);
  const [getRolesPending, getRolesActionM] = useServerAction(getRolesAction);

  const loading = loginPending || logoutPending || getRolesPending;

  useEffect(() => {
    const rehydrateAuth = async () => {
      const isAuthenticated = await isAuthenticatedAction();
      const roles = await getRolesActionM();
      setRoles(roles);
      setIsAuthenticated(isAuthenticated);
    };
    rehydrateAuth();
  }, [getRolesActionM, isAuthenticatedAction]);

  const login = async (formData: LoginUserDto): Promise<ActionResponse<null, LoginUserDto>> => {
    const { error: loginError } = await loginActionM(formData);
    if (loginError) {
      return { error: loginError };
    }
    setIsAuthenticated(true);
    setRoles(await getRolesActionM());
    return { result: null };
  };

  const logout = async () => {
    await logoutActionM();
    setIsAuthenticated(false);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, roles, loading }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
