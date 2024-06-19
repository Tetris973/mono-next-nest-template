import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfileAction } from '@web/app/auth/profile/profile.service';
import { User } from '@web/app/user/user.interface';
import { useAuth } from './AuthContext';
import { ApiException } from '@web/app/common/ApiException';

interface ProfileContextType {
  profile: User | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfileAction();
      setProfile(data);
    } catch (err) {
      if (err instanceof ApiException) {
        console.error(err.message);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
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
