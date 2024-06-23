import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getProfileAction } from '@web/app/auth/profile/profile.service';
import { UserDto } from '@dto/user/dto/user.dto';
import { useAuth } from './AuthContext';
import { useCustomToast } from '../utils/toast-utils.use';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { useServerAction } from '../utils/server-action.use';

interface ProfileContextType {
  profile: UserDto | null;
  loading: boolean;
  loadProfile: () => Promise<ActionErrorResponse | void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toastError } = useCustomToast();
  const [profile, setProfile] = useState<UserDto | null>(null);
  const { isAuthenticated } = useAuth();
  const [loading, getProfile] = useServerAction(getProfileAction);

  const loadProfile = useCallback(async (): Promise<ActionErrorResponse | void> => {
    const { result, error } = await getProfile();

    if (error) {
      setProfile(null);
      return error;
    }
    setProfile(result);
  }, [getProfile]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile().then((error) => {
        if (error) {
          toastError(error.message);
        }
      });
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, toastError, loadProfile]);

  return <ProfileContext.Provider value={{ profile, loading, loadProfile }}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
