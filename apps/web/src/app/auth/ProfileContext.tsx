import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfileAction } from '@web/app/auth/profile/profile.service';
import { UserDto } from '@dto/user/dto/user.dto';
import { useAuth } from './AuthContext';
import { useCustomToast } from '../utils/toastUtils';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';

interface ProfileContextType {
  profile: UserDto | null;
  loading: boolean;
  loadProfile: () => Promise<ActionErrorResponse | void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toastError } = useCustomToast();
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadProfile = async (): Promise<ActionErrorResponse | void> => {
    setLoading(true);
    const data = await getProfileAction();
    setLoading(false);

    if ('status' in data) {
      setProfile(null);
      return data;
    }
    setProfile(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile().then((error) => {
        if (error) {
          toastError(error.message);
        }
      });
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [isAuthenticated, toastError]);

  return <ProfileContext.Provider value={{ profile, loading, loadProfile }}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
