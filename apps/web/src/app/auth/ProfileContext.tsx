import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfileAction } from '@web/app/auth/profile/profile.service';
import { UserDto } from '@dto/user/dto/user.dto';
import { useAuth } from './AuthContext';
import { HttpStatus } from '@web/app/common/http-status.enum';

interface ProfileContextType {
  profile: UserDto | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadProfile = async () => {
    setLoading(true);
    const data = await getProfileAction();
    if ('status' in data) {
      if (data.status === HttpStatus.SERVICE_UNAVAILABLE) {
        console.error(data.message);
      }
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  return <ProfileContext.Provider value={{ profile, loading, loadProfile }}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
