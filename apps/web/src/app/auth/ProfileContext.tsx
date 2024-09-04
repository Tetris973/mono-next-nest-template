import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getProfileAction as defaultGetProfileAction } from '@web/app/auth/profile/profile.service';
import { useAuth as defaultUseAuth } from './AuthContext';
import { UserDto } from '@web/common/dto/backend-index.dto';
import { showErrorNotification } from '@web/common/helpers/notifications.helpers';
import { ServerActionResponse } from '@web/common/types/server-action-response.type';
import { useServerAction } from '@web/common/helpers/server-action.hook';

export interface ProfileContextInterface {
  profile: UserDto | null;
  loading: boolean;
  loadProfile: () => Promise<ServerActionResponse<UserDto> | void>;
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

  const loadProfile = useCallback(async (): Promise<ServerActionResponse<UserDto> | void> => {
    const response = await getProfileActionM();

    if (response.error) {
      setProfile(null);
      return response;
    }
    setProfile(response.data);
  }, [getProfileActionM]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile().then((res) => {
        if (res && res.error) {
          showErrorNotification({
            message: res.error.message,
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
