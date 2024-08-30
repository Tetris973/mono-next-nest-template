import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getProfileAction as defaultGetProfileAction } from '@web/app/auth/profile/profile.service';
import { useAuth as defaultUseAuth } from './AuthContext';
import { UserDto } from '@dto/modules/user/dto/user.dto';
import { showErrorNotification } from '@web/common/helpers/notifications.helpers';
import { ActionErrorResponse } from '@web/common/types/action-response.type';
import { useServerAction } from '@web/common/helpers/server-action.use';

export interface ProfileContextInterface {
  profile: UserDto | null;
  loading: boolean;
  loadProfile: () => Promise<ActionErrorResponse | void>;
}

export interface ProfileProviderDependencies {
  getProfileAction?: typeof defaultGetProfileAction;
  useAuth?: typeof defaultUseAuth;
}

const ProfileContext = createContext<ProfileContextInterface | undefined>(undefined);

export const ProfileProvider: React.FC<React.PropsWithChildren<ProfileProviderDependencies>> = ({
  children,
  getProfileAction = defaultGetProfileAction,
  useAuth = defaultUseAuth,
}) => {
  const [profile, setProfile] = useState<UserDto | null>(null);
  const { isAuthenticated } = useAuth();
  const [getProfilePending, getProfileActionM] = useServerAction(getProfileAction);

  const loadProfile = useCallback(async (): Promise<ActionErrorResponse | void> => {
    const { result, error } = await getProfileActionM();

    if (error) {
      setProfile(null);
      return error;
    }
    setProfile(result);
  }, [getProfileActionM]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile().then((error) => {
        if (error) {
          showErrorNotification({
            message: error.message,
          });
        }
      });
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, loadProfile]);

  return (
    <ProfileContext.Provider value={{ profile, loading: getProfilePending, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextInterface => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
